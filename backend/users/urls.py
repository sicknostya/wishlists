from django.urls import path
from .views import get_user_by_username

urlpatterns = [
    path('<str:username>/', get_user_by_username),
]
