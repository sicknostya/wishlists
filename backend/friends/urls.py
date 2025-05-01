from django.urls import path, include
from .views import FriendViewSet, friends_list
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', FriendViewSet, basename='friends')

urlpatterns = [
    path('', include(router.urls)),
	path('list/', friends_list, name='friends-list-api'),
]
