from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, ChapterViewSet, ExamViewSet, AuthViewSet, AttemptHistoryViewSet, TopicViewSet,AdBannerViewSet, AIGeneratorViewSet, BulkNotesViewSet
from django.contrib import admin
from exams.views import MyTokenObtainPairView

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'topics', TopicViewSet)  # <--- NEW: Added this
router.register(r'exams', ExamViewSet)
router.register(r'history', AttemptHistoryViewSet, basename='history')
router.register(r'ai-generator', AIGeneratorViewSet, basename='ai-generator')
router.register(r'bulk-notes', BulkNotesViewSet, basename='bulk-notes')
router.register(r'banners', AdBannerViewSet, basename='banners')
router.register(r'chapters', ChapterViewSet)
router.register(r'auth-otp', AuthViewSet, basename='auth-otp')
urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    # Use Custom View for Password Login
    path('api/auth/jwt/create/', MyTokenObtainPairView.as_view(), name='jwt-create'),
    path('api/', include('exams.urls')),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
]