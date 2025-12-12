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

class ExamSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    class Meta:
        model = Exam
        fields = ['id', 'title', 'duration_minutes', 'total_marks', 'questions', 'negative_marking_ratio']

class TopicSerializer(serializers.ModelSerializer):
    quiz_id = serializers.SerializerMethodField()
    class Meta:
        model = Topic
        fields = ['id', 'title', 'order', 'quiz_id']

    def get_quiz_id(self, obj):
        # FIX: Safely check for reverse relationship
        try:
            return obj.quiz.id
        except Exception: # Catches ObjectDoesNotExist if no quiz exists
            return None

class ChapterSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)
    class Meta:
        model = Chapter
        fields = ['id', 'title', 'order', 'study_notes', 'topics']

class SubjectSerializer(serializers.ModelSerializer):
    chapters = ChapterSerializer(many=True, read_only=True)
    class Meta:
        model = Subject
        fields = ['id', 'title', 'section', 'order', 'chapters']

class CourseSerializer(serializers.ModelSerializer):
    subjects = SubjectSerializer(many=True, read_only=True)
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'is_paid', 'subjects']

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