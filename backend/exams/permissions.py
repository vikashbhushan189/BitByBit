from rest_framework import permissions
from .models import UserSubscription

class IsPaidSubscriberOrAdmin(permissions.BasePermission):
    """
    Allows access if:
    1. User is Superuser (Admin) -> FULL ACCESS
    2. Content is Free -> ALLOW
    3. Content is Paid -> Check UserSubscription
    """
    def has_object_permission(self, request, view, obj):
        # 1. Admin God Mode
        if request.user.is_superuser:
            return True

        # Determine the course based on the object type
        course = None
        if hasattr(obj, 'course'): # Subject, Exam
            course = obj.course
        elif hasattr(obj, 'subject'): # Chapter
            course = obj.subject.course
        elif hasattr(obj, 'chapter'): # Topic
            course = obj.chapter.subject.course
        elif hasattr(obj, 'subjects'): # Course itself
            course = obj
        
        # 2. Free Content
        if course and not course.is_paid:
            return True
        
        # 3. Paid Content - Check Subscription
        if request.user.is_authenticated:
            return UserSubscription.objects.filter(user=request.user, course=course, active=True).exists()
            
        return False