from django.urls import path
from .views import RegisterView, LoginView, RefreshToken


urlpatterns = [
    path('register/', RegisterView.as_view(), name='user-register'),
    path('token/', LoginView.as_view(), name='token-obtain-pair'),
    path('token/refresh/', RefreshToken.as_view(), name='token-refresh'),
]
