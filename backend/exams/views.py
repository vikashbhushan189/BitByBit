from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import transaction
import csv
import io
from .models import Course, Exam, ExamAttempt, Question, Option, StudentResponse, Topic, Chapter, Subject, AdBanner, UserSubscription
from .serializers import CourseSerializer, ExamSerializer, ExamAttemptSerializer, TopicSerializer, AdBannerSerializer
from .ai_service import generate_questions_from_text, generate_question_from_image
from .permissions import IsPaidSubscriberOrAdmin
import logging

logger = logging.getLogger(__name__)

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def enrolled(self, request):
        if not request.user.is_authenticated:
            return Response([])
        subscribed_ids = UserSubscription.objects.filter(user=request.user, active=True).values_list('course_id', flat=True)
        courses = Course.objects.filter(id__in=subscribed_ids)
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)

class TopicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [permissions.IsAuthenticated, IsPaidSubscriberOrAdmin]

class ExamViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [permissions.IsAuthenticated, IsPaidSubscriberOrAdmin]

    @action(detail=True, methods=['post'])
    def start_attempt(self, request, pk=None):
        exam = self.get_object()
        attempt = ExamAttempt.objects.create(user=request.user, exam=exam)
        return Response({'attempt_id': attempt.id, 'start_time': attempt.start_time, 'duration': exam.duration_minutes})

    @action(detail=True, methods=['post'])
    def submit_exam(self, request, pk=None):
        exam = self.get_object()
        data = request.data
        attempt_id = data.get('attempt_id')
        answers = data.get('answers', {})

        try:
            attempt = ExamAttempt.objects.get(id=attempt_id, user=request.user, exam=exam)
        except ExamAttempt.DoesNotExist:
            return Response({"error": "Invalid attempt"}, status=400)

        if attempt.is_completed:
            return Response({"error": "Exam already submitted"}, status=400)

        score = 0
        questions_map = {q.id: q for q in exam.questions.all()}
        
        for q_id, opt_id in answers.items():
            question = questions_map.get(int(q_id))
            if not question: continue
            
            try:
                selected_option = Option.objects.get(id=opt_id, question=question)
            except Option.DoesNotExist: continue

            StudentResponse.objects.create(attempt=attempt, question=question, selected_option=selected_option)

            if selected_option.is_correct:
                score += question.marks
            else:
                score -= (question.marks * exam.negative_marking_ratio)

        attempt.total_score = max(0, score)
        attempt.submit_time = timezone.now()
        attempt.is_completed = True
        attempt.save()

        return Response({"score": attempt.total_score, "total_marks": exam.total_marks, "status": "Completed"})

class AttemptHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ExamAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ExamAttempt.objects.filter(user=self.request.user).order_by('-start_time')

class AIGeneratorViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAdminUser]

    @action(detail=False, methods=['post'])
    def generate(self, request):
        topic_id = request.data.get('topic_id')
        source_type = request.data.get('source_type')
        source_id = request.data.get('source_id')
        num_questions = int(request.data.get('num_questions', 5))
        difficulty = request.data.get('difficulty', 'Medium')
        custom_instructions = request.data.get('custom_instructions', '')

        # Fallback for older logic
        if not source_id and topic_id: source_id = topic_id
        if not source_type: source_type = 'topic'

        text_content = ""
        if source_type == 'topic':
            topic = get_object_or_404(Topic, id=source_id)
            text_content = topic.study_notes or ""
        elif source_type == 'subject':
            topics = Topic.objects.filter(chapter__subject_id=source_id)
            for t in topics:
                if t.study_notes: text_content += f"\n\nTopic: {t.title}\n{t.study_notes}"
        elif source_type == 'course':
            topics = Topic.objects.filter(chapter__subject__course_id=source_id)[:30]
            for t in topics:
                if t.study_notes: text_content += f"\n\nTopic: {t.title}\n{t.study_notes}"

        if not text_content:
            return Response({"error": "No notes found to generate from."}, status=400)
        
        questions_json = generate_questions_from_text(text_content, num_questions, difficulty, custom_instructions)
        return Response(questions_json)

    @action(detail=False, methods=['post'])
    def generate_image(self, request):
        image = request.FILES.get('image')
        difficulty = request.data.get('difficulty', 'Medium')
        custom_instructions = request.data.get('custom_instructions', '')

        if not image:
            return Response({"error": "No image uploaded"}, status=400)

        questions = generate_question_from_image(image, difficulty, custom_instructions)
        return Response(questions)
    
    # --- NEW: CSV Upload for Questions ---
    @action(detail=False, methods=['post'])
    def upload_questions_csv(self, request):
        file = request.FILES.get('file')
        exam_id = request.data.get('exam_id')
        
        if not file or not exam_id:
            return Response({"error": "File and Exam ID required"}, status=400)
            
        exam = get_object_or_404(Exam, id=exam_id)
        
        try:
            decoded_file = file.read().decode('utf-8')
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string)
            
            count = 0
            for row in reader:
                # Expected headers: Question Text, Option A, Option B, Option C, Option D, Correct Option, Marks
                q_text = row.get('Question Text')
                options = [
                    row.get('Option A'),
                    row.get('Option B'),
                    row.get('Option C'),
                    row.get('Option D')
                ]
                correct_opt = row.get('Correct Option', '').upper().strip() # A, B, C, D
                marks = row.get('Marks', 2)
                
                if not q_text or not all(options) or not correct_opt:
                    continue
                    
                # Map 'A'->0, 'B'->1 etc.
                correct_idx = -1
                if correct_opt == 'A': correct_idx = 0
                elif correct_opt == 'B': correct_idx = 1
                elif correct_opt == 'C': correct_idx = 2
                elif correct_opt == 'D': correct_idx = 3
                
                if correct_idx == -1: continue

                question = Question.objects.create(
                    exam=exam,
                    text_content=q_text,
                    marks=marks
                )
                
                for idx, opt_text in enumerate(options):
                    Option.objects.create(
                        question=question,
                        text=opt_text,
                        is_correct=(idx == correct_idx)
                    )
                count += 1
            
            return Response({"status": "success", "added": count})
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    @action(detail=False, methods=['post'])
    def save_bulk(self, request):
        exam_id = request.data.get('exam_id')
        questions_data = request.data.get('questions', [])
        duration = request.data.get('duration')
        exam = get_object_or_404(Exam, id=exam_id)
        if duration:
            exam.duration_minutes = int(duration)
            exam.save()
        count = 0
        for q_data in questions_data:
            question = Question.objects.create(
                exam=exam,
                text_content=q_data['question_text'],
                marks=q_data.get('marks', 2)
            )
            for idx, opt_text in enumerate(q_data['options']):
                Option.objects.create(
                    question=question,
                    text=opt_text,
                    is_correct=(idx == q_data['correct_index'])
                )
            count += 1
        return Response({"status": "success", "added": count, "duration_updated": bool(duration)})

class BulkNotesViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAdminUser]

    @action(detail=False, methods=['post'])
    def upload_csv(self, request):
        file = request.FILES.get('file')
        if not file: 
            return Response({"error": "No file uploaded"}, status=400)

        if not file.name.endswith('.csv'):
            return Response({"error": "File must be a CSV"}, status=400)

        try:
            # 1. Stream the file (Memory Safe for Render Free Tier)
            # encoding='utf-8-sig' handles Excel's hidden BOM characters
            file.seek(0)
            text_file = TextIOWrapper(file.file, encoding='utf-8-sig', errors='replace')
            reader = csv.DictReader(text_file)
            
            # 2. Smart Header Mapping (Case-insensitive)
            # This allows "course", "Course", "COURSE" to all work
            header_map = {}
            if reader.fieldnames:
                for field in reader.fieldnames:
                    clean = field.strip().lower()
                    if 'course' in clean: header_map['course'] = field
                    elif 'subject' in clean: header_map['subject'] = field
                    elif 'chapter' in clean: header_map['chapter'] = field
                    elif 'topic' in clean: header_map['topic'] = field
                    elif 'note' in clean: header_map['notes'] = field 

            updated_count = 0
            created_count = 0
            
            # 3. Process Row by Row
            for row in reader:
                # Safe extraction
                c_title = row.get(header_map.get('course'), '').strip()
                s_title = row.get(header_map.get('subject'), '').strip()
                ch_title = row.get(header_map.get('chapter'), '').strip()
                t_title = row.get(header_map.get('topic'), '').strip()
                notes = row.get(header_map.get('notes'), '').strip()

                # Skip empty/invalid rows
                if not (c_title and s_title and ch_title and t_title):
                    continue

                # Get or Create Hierarchy
                course, _ = Course.objects.get_or_create(title=c_title)
                subject, _ = Subject.objects.get_or_create(title=s_title, course=course)
                chapter, _ = Chapter.objects.get_or_create(title=ch_title, subject=subject)
                
                # Update Topic
                topic, created = Topic.objects.get_or_create(title=t_title, chapter=chapter)
                
                if notes:
                    topic.study_notes = notes
                    topic.save()
                    if created: created_count += 1
                    else: updated_count += 1

            return Response({
                "status": "success", 
                "message": f"Upload Complete! Created {created_count} topics, Updated {updated_count} topics."
            })

        except Exception as e:
            print(f"CSV UPLOAD ERROR: {e}")
            return Response({"error": str(e)}, status=500)

class AdBannerViewSet(viewsets.ModelViewSet):
    queryset = AdBanner.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = AdBannerSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]