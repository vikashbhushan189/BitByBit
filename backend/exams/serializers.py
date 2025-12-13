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
        fields = ['id', 'text_content', 'marks', 'options']

# LIGHTWEIGHT EXAM SERIALIZER
class SimpleExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['id', 'title', 'duration_minutes', 'total_marks', 'exam_type']

# HEAVY EXAM SERIALIZER
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
            if hasattr(obj, 'quiz'): return obj.quiz.id
            if hasattr(obj, 'quiz_legacy'): return obj.quiz_legacy.id
        except Exception: pass
        return None

class ChapterSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)
    quiz_id = serializers.SerializerMethodField()
    
    class Meta:
        model = Chapter
        fields = ['id', 'title', 'order', 'study_notes', 'topics', 'quiz_id']

    def get_quiz_id(self, obj):
        # 1. Check direct Chapter Quiz
        try:
            if hasattr(obj, 'quiz'): return obj.quiz.id
        except Exception: pass
        
        # 2. Check Topic Quizzes (Fallback for legacy data)
        # If this chapter has no direct quiz, but has topics with quizzes, return the first one
        # This ensures the "Chapter Quiz" tab isn't empty for old data.
        for topic in obj.topics.all():
            try:
                if hasattr(topic, 'quiz'): return topic.quiz.id
                if hasattr(topic, 'quiz_legacy'): return topic.quiz_legacy.id
            except: continue
            
        return None

class SubjectSerializer(serializers.ModelSerializer):
    chapters = ChapterSerializer(many=True, read_only=True)
    tests = serializers.SerializerMethodField() 

    class Meta:
        model = Subject
        fields = ['id', 'title', 'section', 'order', 'chapters', 'tests']
    
    def get_tests(self, obj):
        # FIX: Only return exams specifically marked as SUBJECT_TEST
        # This hides Topic/Chapter quizzes from the "Subject Quiz" tab
        exams = obj.tests.filter(exam_type='SUBJECT_TEST')
        return SimpleExamSerializer(exams, many=True).data

class CourseSerializer(serializers.ModelSerializer):
    subjects = SubjectSerializer(many=True, read_only=True)
    mocks = serializers.SerializerMethodField()
    pyqs = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'is_paid', 'subjects', 'mocks', 'pyqs']

    def get_mocks(self, obj):
        exams = obj.mocks.filter(exam_type='MOCK_FULL')
        return SimpleExamSerializer(exams, many=True).data

    def get_pyqs(self, obj):
        exams = obj.mocks.filter(exam_type='PYQ')
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