from django.contrib import admin
from .models import Course, Subject, Chapter, Topic, Exam, Question, Option, UserSubscription, ExamAttempt, StudentResponse

class OptionInline(admin.TabularInline):
    model = Option
    extra = 4

class QuestionAdmin(admin.ModelAdmin):
    inlines = [OptionInline]
    list_filter = ('exam',)

class TopicAdmin(admin.ModelAdmin):
    list_display = ('title', 'chapter', 'has_notes', 'has_quiz')
    
    def has_notes(self, obj):
        return bool(obj.study_notes)
    
    def has_quiz(self, obj):
        return hasattr(obj, 'quiz')

admin.site.register(Course)
admin.site.register(Subject)
admin.site.register(Chapter)
admin.site.register(Topic, TopicAdmin)
admin.site.register(Exam)
admin.site.register(Question, QuestionAdmin)
admin.site.register(UserSubscription)
admin.site.register(ExamAttempt)
admin.site.register(StudentResponse)