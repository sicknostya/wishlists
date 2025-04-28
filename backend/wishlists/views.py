import json
from rest_framework import viewsets, permissions, status
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Wishlist, WishlistItem
from .serializers import WishlistSerializer
from rest_framework.exceptions import PermissionDenied

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

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)