from django.contrib import admin
from django.urls import path, include
from exams.views import MyTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Custom JWT Login (Single Device Enforcement)
    path('api/auth/jwt/create/', MyTokenObtainPairView.as_view(), name='jwt-create'),
    
    # Djoser Auth (Register, Reset Password, etc.)
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    
    # Main API Routes (Courses, Exams, etc.)
    path('api/', include('exams.urls')),
]