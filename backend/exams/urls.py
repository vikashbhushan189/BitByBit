from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet, TopicViewSet, ChapterViewSet, ExamViewSet, 
    AttemptHistoryViewSet, AIGeneratorViewSet, BulkNotesViewSet, 
    AdBannerViewSet, AuthViewSet
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'topics', TopicViewSet)
router.register(r'chapters', ChapterViewSet)
router.register(r'exams', ExamViewSet)
router.register(r'history', AttemptHistoryViewSet, basename='history')
router.register(r'ai-generator', AIGeneratorViewSet, basename='ai-generator')
router.register(r'bulk-notes', BulkNotesViewSet, basename='bulk-notes')
router.register(r'banners', AdBannerViewSet)
router.register(r'auth-otp', AuthViewSet, basename='auth-otp')

urlpatterns = [
    path('', include(router.urls)),
]