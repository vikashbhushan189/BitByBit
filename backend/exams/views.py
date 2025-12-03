from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import transaction
import csv
import io

from .models import Course, Exam, ExamAttempt, Question, Option, StudentResponse, Topic, Chapter, Subject
from .serializers import CourseSerializer, ExamSerializer, ExamAttemptSerializer, TopicSerializer
from .ai_service import generate_questions_from_text
from .permissions import IsPaidSubscriberOrAdmin

# ... [Keep your existing ViewSets: CourseViewSet, TopicViewSet, ExamViewSet, AttemptHistoryViewSet] ...
# (I am repeating them briefly so the file is complete and valid when you copy-paste)

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

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
        num_questions = request.data.get('num_questions', 5)
        difficulty = request.data.get('difficulty', 'Medium')
        topic = get_object_or_404(Topic, id=topic_id)
        if not topic.study_notes:
            return Response({"error": "This topic has no notes to generate from."}, status=400)
        questions_json = generate_questions_from_text(topic.study_notes, num_questions, difficulty)
        return Response(questions_json)

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

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    # --- NEW: Action to get only purchased courses ---
    @action(detail=False, methods=['get'])
    def enrolled(self, request):
        """Returns courses the user has subscribed to"""
        if not request.user.is_authenticated:
            return Response([])
        
        # Get active subscriptions
        subscribed_ids = UserSubscription.objects.filter(
            user=request.user, 
            active=True
        ).values_list('course_id', flat=True)
        
        # Filter courses
        courses = Course.objects.filter(id__in=subscribed_ids)
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)
    
# --- NEW: Bulk Notes Uploader ---
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
            # Decode file
            decoded_file = file.read().decode('utf-8')
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string)
            
            updated_count = 0
            created_count = 0
            
            with transaction.atomic():
                for row in reader:
                    # Expected CSV Headers: Course, Subject, Chapter, Topic, Notes
                    course_title = row.get('Course', '').strip()
                    subject_title = row.get('Subject', '').strip()
                    chapter_title = row.get('Chapter', '').strip()
                    topic_title = row.get('Topic', '').strip()
                    notes_content = row.get('Notes', '').strip()

                    if not (course_title and subject_title and chapter_title and topic_title):
                        continue # Skip empty rows

                    # Get or Create Hierarchy
                    course, _ = Course.objects.get_or_create(title=course_title)
                    subject, _ = Subject.objects.get_or_create(title=subject_title, course=course)
                    chapter, _ = Chapter.objects.get_or_create(title=chapter_title, subject=subject)
                    
                    # Update Topic
                    topic, created = Topic.objects.get_or_create(title=topic_title, chapter=chapter)
                    
                    if notes_content:
                        topic.study_notes = notes_content
                        topic.save()
                        if created: created_count += 1
                        else: updated_count += 1

            return Response({
                "status": "success",
                "message": f"Processed successfully. Created {created_count} topics, Updated {updated_count} topics."
            })

        except Exception as e:
            return Response({"error": str(e)}, status=500)