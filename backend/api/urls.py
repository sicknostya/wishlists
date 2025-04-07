from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, WishlistListCreateView, WishlistDetailView, WishlistCopyView, CommentListCreateView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('wishlists/', WishlistListCreateView.as_view(), name='wishlist-list'),
    path('wishlists/<int:pk>/', WishlistDetailView.as_view(), name='wishlist-detail'),
    path('wishlists/<int:pk>/copy/', WishlistCopyView.as_view(), name='wishlist-copy'),
    path('wishlists/<int:wishlist_id>/comments/', CommentListCreateView.as_view(), name='comment-list'),
]
