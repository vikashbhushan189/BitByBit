from django.contrib import admin
from .models import Course, Subject, Chapter, Topic, Exam, Question, Option, UserSubscription, ExamAttempt, StudentResponse
from .models import AdBanner

class OptionInline(admin.TabularInline):
    model = Option
    extra = 4

class QuestionAdmin(admin.ModelAdmin):
    inlines = [OptionInline]
    list_filter = ('exam',)

# --- ENHANCED CHAPTER ADMIN ---
class ChapterAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'has_notes', 'has_topic_quizzes')
    list_filter = ('subject__course', 'subject')
    search_fields = ('title', 'subject__title')

    def has_notes(self, obj):
        return bool(obj.study_notes)
    has_notes.boolean = True # Shows a nice Green/Red icon in Admin

    def has_topic_quizzes(self, obj):
        # Checks if any topic in this chapter has an exam attached
        return any(hasattr(topic, 'quiz') for topic in obj.topics.all())
    has_topic_quizzes.boolean = True
    has_topic_quizzes.short_description = "Has Quizzes?"

admin.site.register(Course)
admin.site.register(Subject)
admin.site.register(Chapter, ChapterAdmin) 

# --- REMOVED TOPIC REGISTRATION ---
# admin.site.register(Topic) 

admin.site.register(Exam)
admin.site.register(Question, QuestionAdmin)
admin.site.register(UserSubscription)
admin.site.register(ExamAttempt)
admin.site.register(StudentResponse)
admin.site.register(AdBanner)