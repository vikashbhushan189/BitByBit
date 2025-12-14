from rest_framework import serializers
from djoser.serializers import UserSerializer as BaseUserSerializer
from .models import Course, Subject, Chapter, Topic, Exam, Question, Option, ExamAttempt, AdBanner

# --- CUSTOM USER SERIALIZER ---
class CustomUserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_superuser', 'is_staff')
        ref_name = 'CustomUser'

# --- APP SERIALIZERS ---

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text']

class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)
    class Meta:
        model = Question
        fields = ['id', 'text_content', 'marks', 'options', 'explanation']

# --- LIGHTWEIGHT EXAM SERIALIZER (No Questions, No Count) ---
# Removing question_count for list views to prevent N+1 DB hits causing 500 timeout
class SimpleExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['id', 'title', 'duration_minutes', 'total_marks', 'exam_type']

# --- HEAVY EXAM SERIALIZER (With Questions) ---
class ExamSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    class Meta:
        model = Exam
        fields = ['id', 'title', 'duration_minutes', 'total_marks', 'questions', 'negative_marking_ratio', 'exam_type']

class TopicSerializer(serializers.ModelSerializer):
    quiz_id = serializers.SerializerMethodField()
    class Meta:
        model = Topic
        fields = ['id', 'title', 'order', 'quiz_id']

    def get_quiz_id(self, obj):
        try:
            # Check both relationships safely
            if hasattr(obj, 'quiz'): return obj.quiz.id
            if hasattr(obj, 'quiz_legacy'): return obj.quiz_legacy.id
        except Exception: pass
        return None

class ChapterSerializer(serializers.ModelSerializer):
    # Don't load topics unless needed to avoid recursion depth issues
    topics = TopicSerializer(many=True, read_only=True)
    quiz_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Chapter
        fields = ['id', 'title', 'order', 'study_notes', 'topics', 'quiz_details']

    def get_quiz_details(self, obj):
        exam = None
        try:
            # 1. Direct Chapter Link
            if hasattr(obj, 'quiz'): exam = obj.quiz
            
            # 2. Legacy Topic Link (Fallback)
            if not exam:
                for topic in obj.topics.all():
                    if hasattr(topic, 'quiz'): 
                        exam = topic.quiz
                        break
                    if hasattr(topic, 'quiz_legacy'):
                        exam = topic.quiz_legacy
                        break
        except Exception: pass
        
        if exam:
            return SimpleExamSerializer(exam).data
        return None

class SubjectSerializer(serializers.ModelSerializer):
    chapters = ChapterSerializer(many=True, read_only=True)
    tests = serializers.SerializerMethodField() 

    class Meta:
        model = Subject
        fields = ['id', 'title', 'section', 'order', 'chapters', 'tests']
    
    def get_tests(self, obj):
        # Use Python filtering on the prefetched 'tests' set
        exams = [e for e in obj.tests.all() if e.exam_type == 'SUBJECT_TEST']
        return SimpleExamSerializer(exams, many=True).data

class CourseSerializer(serializers.ModelSerializer):
    subjects = SubjectSerializer(many=True, read_only=True)
    mocks = serializers.SerializerMethodField()
    pyqs = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'is_paid', 'subjects', 'mocks', 'pyqs']

    def get_mocks(self, obj):
        # Use Python filtering to avoid hitting DB again
        exams = [e for e in obj.mocks.all() if e.exam_type == 'MOCK_FULL']
        return SimpleExamSerializer(exams, many=True).data

    def get_pyqs(self, obj):
        # Use Python filtering
        exams = [e for e in obj.mocks.all() if e.exam_type == 'PYQ']
        return SimpleExamSerializer(exams, many=True).data

class ExamAttemptSerializer(serializers.ModelSerializer):
    exam_title = serializers.CharField(source='exam.title', read_only=True)
    exam_total_marks = serializers.IntegerField(source='exam.total_marks', read_only=True)
    class Meta:
        model = ExamAttempt
        fields = ['id', 'exam_title', 'start_time', 'total_score', 'exam_total_marks', 'is_completed']

class AdBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdBanner
        fields = '__all__'