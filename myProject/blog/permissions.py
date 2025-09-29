from rest_framework import permissions


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission:
    - Admins can edit/delete any object
    - Regular users can only edit/delete their own
    """

    def has_object_permission(self, request, view, obj):
        # Allow safe methods (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True

        # Admins always allowed
        if (request.user.is_staff or request.user.is_superuser) and request.method == "DELETE":
            return True

        # Otherwise, only owner
        return obj.user == request.user
