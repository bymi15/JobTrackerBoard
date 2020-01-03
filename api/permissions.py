from rest_framework import permissions

class IsSameUser(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has a `user` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Instance must have an attribute named `user`.
        return obj == request.user

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Instance must have an attribute named `user`.
        return request.user.is_superuser or obj.user == request.user

class IsOwnerApplication(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Instance must have an attribute named `application.user`.
        return obj.application.user == request.user
        
class IsOwnerInterview(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Instance must have an attribute named `interview.application.user`.
        return obj.interview.application.user == request.user