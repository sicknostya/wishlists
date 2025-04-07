from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from api.models import Wishlist, Comment
from .serializers import WishlistSerializer, CommentSerializer, UserSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, password=password)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

class WishlistListCreateView(generics.ListCreateAPIView):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class WishlistDetailView(generics.RetrieveAPIView):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer

class WishlistCopyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        wishlist = Wishlist.objects.get(pk=pk)
        new_wishlist = Wishlist.objects.create(
            type=wishlist.type,
            text=wishlist.text,
            image=wishlist.image,
            author=request.user
        )
        return Response(WishlistSerializer(new_wishlist).data, status=status.HTTP_201_CREATED)

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        wishlist_id = self.kwargs['wishlist_id']
        return Comment.objects.filter(wishlist_id=wishlist_id)

    def perform_create(self, serializer):
        wishlist_id = self.kwargs['wishlist_id']
        wishlist = Wishlist.objects.get(pk=wishlist_id)
        serializer.save(author=self.request.user, wishlist=wishlist)