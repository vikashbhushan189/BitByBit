from rest_framework import permissions
from .models import UserSubscription, Exam

class IsPaidSubscriberOrAdmin(permissions.BasePermission):
    """
    Allows access if:
    1. User is Superuser (Admin) -> ALLOW
    2. Content is Free -> ALLOW
    3. Content is Paid -> Check UserSubscription -> ALLOW if active
    """
    def has_object_permission(self, request, view, obj):
        # 1. Admin God Mode
        if request.user.is_superuser:
            return True

        course = None

        # Logic to find the Course from different objects
        if isinstance(obj, Exam):
            if obj.course: # Mock Test
                course = obj.course
            elif obj.subject: # Subject Test
                course = obj.subject.course
            elif obj.chapter: # Chapter Test
                course = obj.chapter.subject.course
            elif obj.topic: # Legacy Topic Test
                course = obj.topic.chapter.subject.course
        
        # ... (Handle other model types if necessary, e.g. Topic, Chapter) ...
        # But mostly we use this on ExamViewSet.

        # If we couldn't find a course, assume it's free/public or let other permissions handle it
        if not course:
            return True 

        # 2. Free Content
        if not course.is_paid:
            return True
        
        # 3. Paid Content - Check Subscription
        if request.user.is_authenticated:
            return UserSubscription.objects.filter(user=request.user, course=course, active=True).exists()
            
        return False