import json
from rest_framework import viewsets, permissions, status
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from .models import Wishlist, WishlistItem, Comment
from .serializers import WishlistSerializer, CommentSerializer
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def wishlists_by_user(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=404)

    wishlists = Wishlist.objects.filter(user=user, access_level='public')
    serializer = WishlistSerializer(wishlists, many=True, context={'request': request})
    return Response(serializer.data)

class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.action == 'list':
            return Wishlist.objects.filter(access_level='public')
        return Wishlist.objects.all()

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my(self, request):
        user_wishlists = Wishlist.objects.filter(user=request.user)
        serializer = self.get_serializer(user_wishlists, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='favorites')
    def favorites(self, request):
        user = request.user
        favorites = Wishlist.objects.filter(favorites=user)
        serializer = self.get_serializer(favorites, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        wishlist = self.get_object()

        # Запрет доступа к приватным вишлистам других пользователей
        if wishlist.access_level == 'private' and wishlist.user != request.user:
            raise PermissionDenied("Этот вишлист приватный.")

        return super().retrieve(request, *args, **kwargs)
    
    def update(self, request, pk=None):
        wishlist = self.get_object()
        if wishlist.user != request.user:
            return Response({'detail': 'Недостаточно прав'}, status=status.HTTP_403_FORBIDDEN)

        # Обновление полей wishlist
        wishlist.title = request.data.get('title', wishlist.title)
        wishlist.description = request.data.get('description', wishlist.description)
        wishlist.access_level = request.data.get('access_level', wishlist.access_level)

        if request.FILES.get('image'):
            wishlist.image = request.FILES.get('image')

        wishlist.save()

        # Обновление items
        items_data = request.data.get('items')
        if items_data:
            try:
                items = json.loads(items_data)
            except json.JSONDecodeError:
                return Response({'detail': 'Неверный формат items'}, status=status.HTTP_400_BAD_REQUEST)

            # Удалить старые элементы
            old_items = {item.name: item for item in wishlist.items.all()}
            wishlist.items.all().delete()

            for index, item in enumerate(items):
                image_key = item.get('image_key')
                image_file = request.FILES.get(image_key) if image_key else None

                # Сохраняем старую картинку, если новую не загрузили
                if not image_file:
                    old_item = old_items.get(item.get('name'))
                    if old_item:
                        image_file = old_item.image

                WishlistItem.objects.create(
                    wishlist=wishlist,
                    name=item.get('name'),
                    description=item.get('description'),
                    link=item.get('link'),
                    image=image_file
                )

        serializer = self.get_serializer(wishlist)
        return Response(serializer.data)
    
    def destroy(self, request, pk=None):
        wishlist = self.get_object()
        if wishlist.user != request.user:
            return Response({'detail': 'Недостаточно прав'}, status=status.HTTP_403_FORBIDDEN)

        wishlist.delete()
        return Response({'detail': 'Вишлист удалён'}, status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_comment(self, request, pk=None):
        wishlist = self.get_object()

        if wishlist.access_level == 'private' and wishlist.user != request.user:
            return Response({'detail': 'Вы не можете комментировать приватный вишлист.'},
                            status=status.HTTP_403_FORBIDDEN)

        text = request.data.get('text')
        if not text:
            return Response({'detail': 'Текст комментария обязателен.'},
                            status=status.HTTP_400_BAD_REQUEST)

        comment = Comment.objects.create(
            wishlist=wishlist,
            author=request.user,
            text=text
        )

        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_to_favorites(self, request, pk=None):
        wishlist = self.get_object()

        if wishlist.access_level == 'private' and wishlist.user != request.user:
            return Response({'detail': 'Нельзя добавить приватный вишлист в избранное.'},
                            status=status.HTTP_403_FORBIDDEN)

        wishlist.favorites.add(request.user)
        return Response({'detail': 'Добавлено в избранное.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def remove_from_favorites(self, request, pk=None):
        wishlist = self.get_object()
        wishlist.favorites.remove(request.user)
        return Response({'detail': 'Удалено из избранного.'}, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)