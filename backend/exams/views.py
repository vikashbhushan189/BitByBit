from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Course, Exam, ExamAttempt, Question, Option, StudentResponse
from .serializers import CourseSerializer, ExamSerializer, ExamAttemptSerializer
from rest_framework import viewsets, permissions

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ExamViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def start_attempt(self, request, pk=None):
        """Creates a new attempt timer for the user"""
        exam = self.get_object()
        attempt = ExamAttempt.objects.create(user=request.user, exam=exam)
        return Response({
            'attempt_id': attempt.id,
            'start_time': attempt.start_time,
            'duration': exam.duration_minutes
        })

    @action(detail=True, methods=['post'])
    def submit_exam(self, request, pk=None):
        """Calculates score and saves answers"""
        exam = self.get_object()
        data = request.data
        attempt_id = data.get('attempt_id')
        answers = data.get('answers', {}) # { "question_id": "option_id" }

        try:
            attempt = ExamAttempt.objects.get(id=attempt_id, user=request.user, exam=exam)
        except ExamAttempt.DoesNotExist:
            return Response({"error": "Invalid attempt"}, status=400)

        if attempt.is_completed:
            return Response({"error": "Exam already submitted"}, status=400)

        # 1. Save Answers & Calculate Score
        score = 0
        total_questions = 0
        
        # Prefetch questions to avoid DB hammering
        questions_map = {q.id: q for q in exam.questions.all()}
        
        for q_id, opt_id in answers.items():
            question = questions_map.get(int(q_id))
            if not question:
                continue # Skip invalid questions
            
            # Fetch selected option
            try:
                selected_option = Option.objects.get(id=opt_id, question=question)
            except Option.DoesNotExist:
                continue

            # Save Response to DB
            StudentResponse.objects.create(
                attempt=attempt,
                question=question,
                selected_option=selected_option
            )

            # Scoring Math
            if selected_option.is_correct:
                score += question.marks
            else:
                # Negative Marking (e.g., 2 marks * 0.25 = 0.5 deduction)
                score -= (question.marks * exam.negative_marking_ratio)

        # 2. Finalize Attempt
        attempt.total_score = max(0, score) # No negative total scores
        attempt.submit_time = timezone.now()
        attempt.is_completed = True
        attempt.save()

        return Response({
            "score": attempt.total_score,
            "total_marks": exam.total_marks,
            "status": "Completed"
        })
    
class AttemptHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ExamAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return attempts belonging to the logged-in user
        return ExamAttempt.objects.filter(user=self.request.user).order_by('-start_time')