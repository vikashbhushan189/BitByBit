from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, ChapterViewSet, ExamViewSet, AttemptHistoryViewSet, TopicViewSet,AdBannerViewSet, AIGeneratorViewSet, BulkNotesViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'topics', TopicViewSet)  # <--- NEW: Added this
router.register(r'exams', ExamViewSet)
router.register(r'history', AttemptHistoryViewSet, basename='history')
router.register(r'ai-generator', AIGeneratorViewSet, basename='ai-generator')
router.register(r'bulk-notes', BulkNotesViewSet, basename='bulk-notes')
router.register(r'banners', AdBannerViewSet, basename='banners')
router.register(r'chapters', ChapterViewSet)
urlpatterns = [
    path('', include(router.urls)),
]