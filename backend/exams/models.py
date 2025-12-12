from django.db import models
from django.conf import settings
from django.utils import timezone

# --- 1. Course Hierarchy ---
class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_paid = models.BooleanField(default=False, help_text="If checked, requires subscription")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    def __str__(self):
        return self.title

class Subject(models.Model):
    course = models.ForeignKey(Course, related_name='subjects', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    # Group subjects into sections (e.g., "Paper 1", "Paper 2")
    section = models.CharField(
        max_length=100, 
        default="Main", 
        help_text="e.g. 'Paper 1', 'Technical', 'General Studies'"
    )
    order = models.IntegerField(default=1)

    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.course.title} - {self.section} - {self.title}"

class Chapter(models.Model):
    subject = models.ForeignKey(Subject, related_name='chapters', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    order = models.IntegerField(default=1)
    
    # MOVED: Notes are now here
    study_notes = models.TextField(blank=True, help_text="Markdown/HTML content")

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.subject.title} - {self.title}"

class Topic(models.Model):
    chapter = models.ForeignKey(Chapter, related_name='topics', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    order = models.IntegerField(default=1)
    
    # Removed study_notes from here

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

# --- 2. Exam System ---
class Exam(models.Model):
    EXAM_TYPES = (
        ('TOPIC_QUIZ', 'Topic Quiz Card'),
        ('SUBJECT_TEST', 'Full Subject Test'),
        ('MOCK_FULL', 'Full Length Mock'),
        ('PYQ', 'Previous Year Question'),
    )
    
    title = models.CharField(max_length=255)
    exam_type = models.CharField(max_length=20, choices=EXAM_TYPES)
    
    # Linkage
    topic = models.OneToOneField(Topic, null=True, blank=True, on_delete=models.SET_NULL, related_name='quiz')
    subject = models.ForeignKey(Subject, null=True, blank=True, on_delete=models.SET_NULL, related_name='tests')
    course = models.ForeignKey(Course, null=True, blank=True, on_delete=models.SET_NULL, related_name='mocks')

    duration_minutes = models.IntegerField(default=30)
    total_marks = models.IntegerField(default=100)
    negative_marking_ratio = models.FloatField(default=0.25)
    
    def __str__(self):
        return f"{self.get_exam_type_display()} - {self.title}"

class Question(models.Model):
    exam = models.ForeignKey(Exam, related_name='questions', on_delete=models.CASCADE)
    text_content = models.TextField()
    marks = models.FloatField(default=1.0)

    def __str__(self):
        return self.text_content[:50]
    
class Option(models.Model):
    question = models.ForeignKey(Question, related_name='options', on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text

class UserSubscription(models.Model):
    """Tracks which user has bought which course"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    active = models.BooleanField(default=True)
    purchase_date = models.DateTimeField(auto_now_add=True)

class AdBanner(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    button_text = models.CharField(max_length=50, default="Learn More")
    link = models.CharField(max_length=255, blank=True)
    bg_gradient_from = models.CharField(max_length=50, default="blue-600")
    bg_gradient_to = models.CharField(max_length=50, default="purple-600")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

# --- 3. Progress Tracking ---
class ExamAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    submit_time = models.DateTimeField(null=True, blank=True)
    total_score = models.FloatField(default=0.0)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user} - {self.exam.title}"

class StudentResponse(models.Model):
    attempt = models.ForeignKey(ExamAttempt, related_name='responses', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.ForeignKey(Option, null=True, blank=True, on_delete=models.SET_NULL)
    status = models.CharField(max_length=20, default='answered')

    class Meta:
        unique_together = ('attempt', 'question')