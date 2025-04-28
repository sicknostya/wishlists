import json
from rest_framework import serializers
from .models import Wishlist, WishlistItem, Comment

class WishlistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WishlistItem
        fields = ['id', 'name', 'description', 'link', 'image']


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'author', 'text', 'date']


class WishlistSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    user = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'title', 'description', 'image', 'comments', 'items', 'access_level', 'user']

    def get_items(self, obj):
        return WishlistItemSerializer(obj.items.all(), many=True).data

    def create(self, validated_data):
        try:
            request = self.context.get('request')
            items_data = self.initial_data.get('items', [])

            if isinstance(items_data, str):
                import json
                try:
                    items_data = json.loads(items_data)
                except json.JSONDecodeError:
                    items_data = []

            # ❗ user уже передан в validated_data → не дублируем
            wishlist = Wishlist.objects.create(**validated_data)

            for index, item in enumerate(items_data):
                image = None
                image_field = f'item_images_{index}'
                if request and image_field in request.FILES:
                    image = request.FILES[image_field]

                WishlistItem.objects.create(
                    wishlist=wishlist,
                    name=item.get('name', ''),
                    description=item.get('description', ''),
                    link=item.get('link', ''),
                    image=image
                )

            return wishlist

        except Exception as e:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'error': str(e)})
