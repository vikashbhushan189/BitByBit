import random
import csv
import codecs
from io import TextIOWrapper
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import transaction
from django.conf import settings

# DRF & JWT Imports
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# Project Imports
from .models import Course, Exam, ExamAttempt, Question, Option, StudentResponse, Topic, Chapter, Subject, AdBanner, UserSubscription, User, OTP
from .serializers import CourseSerializer, ExamSerializer, ExamAttemptSerializer, TopicSerializer, AdBannerSerializer, ChapterSerializer
from .ai_service import generate_questions_from_text, generate_question_from_image
from .permissions import IsPaidSubscriberOrAdmin
import chardet

# --- CUSTOM EXCEPTION FOR CONFLICT ---
class Conflict(APIException):
    status_code = 409
    default_detail = 'Device Conflict'
    default_code = 'conflict'

# --- CUSTOM PASSWORD LOGIN (With Conflict Check) ---
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # 1. Validate Credentials (Username/Pass)
        # This will raise 401 if wrong, which is correct.
        data = super().validate(attrs)
        
        # 2. Check for Force Login Flag
        request = self.context.get('request')
        force_login = request.data.get('force_login', False)
        
        # 3. Check for Active Session
        # If token_version > 0, it means they have logged in before.
        # Ideally, we would check for *active* tokens, but JWT is stateless.
        # So we treat "has logged in before" as "might be logged in elsewhere".
        if self.user.token_version > 0 and not force_login:
             raise Conflict({
                 "message": "You are logged in on another device. Do you want to logout from there?",
                 "requires_confirmation": True
             })
        
        # 4. Increment Version (This invalidates all old tokens)
        self.user.token_version += 1
        self.user.save()
        
        # 5. Re-Generate Token with NEW Version
        # We discard the initial token from super().validate() because it used the OLD version.
        refresh = RefreshToken.for_user(self.user)
        refresh['token_version'] = self.user.token_version # Stamp it!
        
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['role'] = "admin" if self.user.is_superuser else "student"
        
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# --- OTP LOGIN VIEWS ---
class AuthViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    # ... (Keep send_otp and verify_otp for your manual testing if you want, or replace them) ...
    @action(detail=False, methods=['post'])
    def send_otp(self, request):
        phone = request.data.get('phone')
        if not phone: return Response({"error": "Phone number required"}, status=400)
        otp_code = str(random.randint(1000, 9999))
        OTP.objects.create(phone_number=phone, otp_code=otp_code)
        print(f"XXX OTP for {phone} is: {otp_code} XXX")
        if settings.DEBUG:
            return Response({"status": "success", "message": f"OTP sent to {phone}", "debug_otp": otp_code})
        return Response({"status": "success", "message": "OTP sent successfully"})

    @action(detail=False, methods=['post'])
    def verify_otp(self, request):
        phone = request.data.get('phone')
        otp_input = request.data.get('otp')
        force_login = request.data.get('force_login', False)
        
        otp_record = OTP.objects.filter(phone_number=phone, otp_code=otp_input).last()
        if not otp_record or not otp_record.is_valid():
            return Response({"error": "Invalid or expired OTP"}, status=400)
        
        return self._perform_login(phone, force_login)

    @action(detail=False, methods=['post'])
    def firebase_exchange(self, request):
        phone = request.data.get('phone')
        force_login = request.data.get('force_login', False)
        
        if not phone: return Response({"error": "Phone number required"}, status=400)

        return self._perform_login(phone, force_login)

    def _perform_login(self, phone, force_login):
        # FIX: Do NOT auto-create. Check if user exists first.
        try:
            user = User.objects.get(phone_number=phone)
        except User.DoesNotExist:
            # If user doesn't exist, tell frontend to redirect to Register
            return Response({
                "status": "not_registered",
                "message": "Account does not exist. Please register first.",
                "phone": phone
            }, status=404) # 404 Not Found is appropriate here

        # 3. Single Device Check
        if not force_login and user.token_version > 0:
             return Response({
                 "status": "conflict", 
                 "message": "You are logged in on another device. Do you want to logout from there?",
                 "requires_confirmation": True
             }, status=409)

        # 4. Perform Login
        user.token_version += 1
        user.last_login = timezone.now()
        user.save()
        
        refresh = RefreshToken.for_user(user)
        refresh['token_version'] = user.token_version
        
        return Response({
            "status": "success",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": "admin" if user.is_superuser else "student"
        })
    

# --- STUDENT VIEWS ---
class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    # OPTIMIZED QUERYSET: Fetch deeply nested relations to prevent N+1 crashes
    queryset = Course.objects.prefetch_related(
        'subjects',
        'subjects__chapters',
        'subjects__chapters__topics',      # Needed for legacy quiz check
        'subjects__chapters__quiz',        # New chapter quizzes
        'subjects__chapters__topics__quiz_legacy', # Legacy topic quizzes
        'subjects__tests',                 # Subject tests
        'mocks'                            # Course mocks/pyqs
    ).all()
    
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def enrolled(self, request):
        if not request.user.is_authenticated:
            return Response([])
        
        subscribed_ids = UserSubscription.objects.filter(user=request.user, active=True).values_list('course_id', flat=True)
        
        # Apply EXACT SAME prefetch optimization
        courses = Course.objects.filter(id__in=subscribed_ids).prefetch_related(
            'subjects',
            'subjects__chapters',
            'subjects__chapters__topics',
            'subjects__chapters__quiz',
            'subjects__chapters__topics__quiz_legacy',
            'subjects__tests',
            'mocks'
        )
        
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)

class ChapterViewSet(viewsets.ModelViewSet):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    def get_permissions(self):
        if self.action in ['list', 'retrieve']: permission_classes = [permissions.IsAuthenticated, IsPaidSubscriberOrAdmin]
        else: permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    def get_permissions(self):
        if self.action in ['list', 'retrieve']: permission_classes = [permissions.IsAuthenticated, IsPaidSubscriberOrAdmin]
        else: permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

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

    # --- NEW: Check Single Answer (For Practice Mode) ---
    @action(detail=True, methods=['post'])
    def check_answer(self, request, pk=None):
        question_id = request.data.get('question_id')
        option_id = request.data.get('option_id')
        question = get_object_or_404(Question, id=question_id)
        correct_option = question.options.filter(is_correct=True).first()
        is_correct = False
        if option_id:
            try:
                selected = Option.objects.get(id=option_id)
                is_correct = selected.is_correct
            except: pass
        return Response({
            "is_correct": is_correct,
            "correct_option_id": correct_option.id if correct_option else None,
            "explanation": question.explanation
        })

    @action(detail=True, methods=['post'])
    def subscribe(self, request, pk=None):
        course = self.get_object()
        subscription, created = UserSubscription.objects.get_or_create(
            user=request.user,
            course=course,
            defaults={'active': True}
        )
        if not subscription.active:
            subscription.active = True
            subscription.save()
        return Response({"status": "success", "message": f"Enrolled in {course.title}"})

class AttemptHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ExamAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ExamAttempt.objects.filter(user=self.request.user).order_by('-start_time')

# --- ADMIN VIEWS ---

class AIGeneratorViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAdminUser]

    @action(detail=False, methods=['post'])
    def generate(self, request):
        # ... (Keep existing generate logic)
        topic_id = request.data.get('topic_id')
        source_type = request.data.get('source_type')
        source_id = request.data.get('source_id')
        num_questions = int(request.data.get('num_questions', 5))
        difficulty = request.data.get('difficulty', 'Medium')
        custom_instructions = request.data.get('custom_instructions', '')
        if not source_id and topic_id: source_id = topic_id
        if not source_type: source_type = 'topic'
        if source_type == 'topic': source_type = 'chapter' 
        text_content = ""
        if source_type == 'chapter':
            chapter = get_object_or_404(Chapter, id=source_id)
            text_content = chapter.study_notes or ""
        elif source_type == 'subject':
            chapters = Chapter.objects.filter(subject_id=source_id)
            for ch in chapters:
                if ch.study_notes: text_content += f"\n\n--- Chapter: {ch.title} ---\n{ch.study_notes}"
        elif source_type == 'course':
            chapters = Chapter.objects.filter(subject__course_id=source_id)[:20]
            for ch in chapters:
                if ch.study_notes: text_content += f"\n\n--- Chapter: {ch.title} ---\n{ch.study_notes}"
        if not text_content: return Response({"error": "No notes found to generate from."}, status=400)
        questions_json = generate_questions_from_text(text_content, num_questions, difficulty, custom_instructions)
        return Response(questions_json)

    @action(detail=False, methods=['post'])
    def generate_image(self, request):
        image = request.FILES.get('image')
        difficulty = request.data.get('difficulty', 'Medium')
        custom_instructions = request.data.get('custom_instructions', '')
        if not image: return Response({"error": "No image uploaded"}, status=400)
        questions = generate_question_from_image(image, difficulty, custom_instructions)
        return Response(questions)
    
    # --- IMPROVED CSV UPLOAD ---
    @action(detail=False, methods=['post'])
    def upload_questions_csv(self, request):
        file_obj = request.FILES.get('file')
        exam_id = request.data.get('exam_id')
        
        if not file_obj or not exam_id:
            return Response({"error": "File and Exam ID required"}, status=400)
            
        exam = get_object_or_404(Exam, id=exam_id)
        
        try:
            # 1. Stream & Decode (Fix memory issues & BOM)
            decoded_file = codecs.iterdecode(file_obj, 'utf-8-sig')
            reader = csv.DictReader(decoded_file)
            
            # 2. Normalize Headers
            header_map = {}
            if reader.fieldnames:
                for field in reader.fieldnames:
                    clean = field.strip().lower()
                    if 'question' in clean: header_map['question'] = field
                    elif 'option a' in clean: header_map['a'] = field
                    elif 'option b' in clean: header_map['b'] = field
                    elif 'option c' in clean: header_map['c'] = field
                    elif 'option d' in clean: header_map['d'] = field
                    elif 'correct' in clean: header_map['correct'] = field
                    elif 'mark' in clean: header_map['marks'] = field

            count = 0
            skipped = 0
            total_new_marks = 0

            for row in reader:
                q_text = row.get(header_map.get('question'), '').strip()
                options = [
                    row.get(header_map.get('a'), '').strip(),
                    row.get(header_map.get('b'), '').strip(),
                    row.get(header_map.get('c'), '').strip(),
                    row.get(header_map.get('d'), '').strip()
                ]
                correct_opt = row.get(header_map.get('correct'), '').upper().strip()
                marks_str = row.get(header_map.get('marks'), '2').strip()
                marks = float(marks_str) if marks_str else 2.0
                
                # Validation: Skip if critical data missing
                if not q_text or not all(options) or not correct_opt:
                    skipped += 1
                    continue
                    
                correct_idx = -1
                if correct_opt == 'A': correct_idx = 0
                elif correct_opt == 'B': correct_idx = 1
                elif correct_opt == 'C': correct_idx = 2
                elif correct_opt == 'D': correct_idx = 3
                
                if correct_idx == -1: 
                    skipped += 1
                    continue

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
                total_new_marks += marks

            # 3. Update Exam Total Marks
            # Add new marks to existing total
            exam.total_marks += int(total_new_marks)
            exam.save()
            
            return Response({
                "status": "success", 
                "added": count, 
                "skipped": skipped,
                "message": f"Added {count} questions. Skipped {skipped} rows (check formatting). Total Marks Updated."
            })

        except Exception as e:
            return Response({"error": f"CSV Error: {str(e)}"}, status=500)

    @action(detail=False, methods=['post'])
    def save_bulk(self, request):
        exam_id = request.data.get('exam_id')
        new_exam_title = request.data.get('new_exam_title')
        
        source_type = request.data.get('source_type') 
        source_id = request.data.get('source_id')
        questions_data = request.data.get('questions', [])
        duration = request.data.get('duration')
        
        exam = None

        if exam_id:
            exam = get_object_or_404(Exam, id=exam_id)
        elif new_exam_title:
            exam_defaults = {
                'title': new_exam_title,
                'duration_minutes': int(duration) if duration else 30,
                'total_marks': len(questions_data) * 2, 
                'exam_type': 'SUBJECT_TEST'
            }

            if source_type == 'course' and source_id:
                exam_defaults['course_id'] = source_id
                exam_defaults['exam_type'] = 'MOCK_FULL'
            elif source_type == 'subject' and source_id:
                exam_defaults['subject_id'] = source_id
                exam_defaults['exam_type'] = 'SUBJECT_TEST'
            elif source_type == 'chapter' and source_id:
                try:
                    # FIX: Link directly to Chapter
                    chapter = Chapter.objects.get(id=source_id)
                    exam_defaults['chapter'] = chapter
                    exam_defaults['exam_type'] = 'TOPIC_QUIZ' # or rename to CHAPTER_QUIZ
                except Exception as e:
                    print(f"Error linking chapter: {e}")
            
            exam = Exam.objects.create(**exam_defaults)
        
        if not exam:
            return Response({"error": "Please select an existing exam OR enter a name for a new one."}, status=400)

        if duration:
            exam.duration_minutes = int(duration)
            exam.save()
        
        count = 0
        for q_data in questions_data:
            question = Question.objects.create(
                exam=exam,
                text_content=q_data['question_text'],
                marks=q_data.get('marks', 2),
                explanation=q_data.get('explanation', '')
            )
            for idx, opt_text in enumerate(q_data['options']):
                Option.objects.create(
                    question=question,
                    text=opt_text,
                    is_correct=(idx == q_data['correct_index'])
                )
            count += 1
            
        return Response({
            "status": "success", 
            "added": count, 
            "exam_title": exam.title,
            "message": f"Saved {count} questions to '{exam.title}'"
        })

class BulkNotesViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAdminUser]

    @action(detail=False, methods=['post'])
    def upload_csv(self, request):
        # DEBUG: Print what we received
        print(f"DEBUG: upload_csv called. User: {request.user}")
        print(f"DEBUG: FILES keys: {request.FILES.keys()}")

        file_obj = request.FILES.get('file')
        if not file_obj: 
            return Response({"error": "No file uploaded. Key 'file' missing in request."}, status=400)

        # Case-insensitive check
        if not file_obj.name.lower().endswith('.csv'):
            return Response({"error": f"File '{file_obj.name}' is not a CSV"}, status=400)

        try:
            # 1. Detect Encoding
            raw_data = file_obj.read()
            result = chardet.detect(raw_data)
            encoding = result['encoding'] or 'utf-8'
            file_obj.seek(0)
            
            # 2. Stream & Decode
            decoded_file = raw_data.decode(encoding, errors='replace').splitlines()
            reader = csv.DictReader(decoded_file)
            
            # 3. Map Headers
            header_map = {}
            if reader.fieldnames:
                for field in reader.fieldnames:
                    clean = field.strip().lower()
                    if 'course' in clean: header_map['course'] = field
                    elif 'paper' in clean or 'section' in clean: header_map['section'] = field
                    elif 'subject' in clean: header_map['subject'] = field
                    elif 'chapter' in clean: header_map['chapter'] = field
                    elif 'topic' in clean: header_map['topic'] = field
                    elif 'note' in clean: header_map['notes'] = field 

            updated_count = 0
            created_count = 0
            
            for row in reader:
                c_title = row.get(header_map.get('course'), '').strip()
                sec_title = row.get(header_map.get('section'), 'Main').strip() 
                s_title = row.get(header_map.get('subject'), '').strip()
                ch_title = row.get(header_map.get('chapter'), '').strip()
                notes = row.get(header_map.get('notes'), '').strip()

                if not (c_title and s_title and ch_title): continue

                course, _ = Course.objects.get_or_create(title=c_title)
                
                subject, _ = Subject.objects.get_or_create(
                    title=s_title, 
                    course=course,
                    defaults={'section': sec_title} 
                )
                if subject.section != sec_title and sec_title:
                    subject.section = sec_title
                    subject.save()

                chapter, created = Chapter.objects.get_or_create(title=ch_title, subject=subject)
                
                if notes:
                    chapter.study_notes = notes
                    chapter.save()
                    if created: created_count += 1
                    else: updated_count += 1

            return Response({
                "status": "success", 
                "message": f"Processed successfully! Created {created_count}, Updated {updated_count} chapters."
            })

        except Exception as e:
            print(f"CSV ERROR: {e}")
            return Response({"error": f"Server Error: {str(e)}"}, status=500)

class AdBannerViewSet(viewsets.ModelViewSet):
    queryset = AdBanner.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = AdBannerSerializer
    def get_permissions(self):
        if self.action in ['list', 'retrieve']: permission_classes = [permissions.AllowAny]
        else: permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]