from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, ExamViewSet, AttemptHistoryViewSet, TopicViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'topics', TopicViewSet)  # <--- NEW: Added this
router.register(r'exams', ExamViewSet)
router.register(r'history', AttemptHistoryViewSet, basename='history')

urlpatterns = [
    path('', include(router.urls)),
]