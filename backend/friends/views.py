from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def friends_list(request):
    friends = request.user.profile.friends.all()
    data = [{'id': f.id, 'username': f.username} for f in friends]
    return Response(data)


class FriendViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        friends = request.user.profile.friends.all()
        data = [{'id': f.id, 'username': f.username} for f in friends]
        return Response(data)

    @action(detail=True, methods=['post'])
    def add(self, request, pk=None):
        if str(request.user.pk) == pk:
            return Response({'error': 'Нельзя добавить самого себя в друзья'}, status=400)

        try:
            friend = User.objects.get(pk=pk)
            if friend in request.user.profile.friends.all():
                return Response({'status': 'Уже в друзьях'})
            request.user.profile.friends.add(friend)
            return Response({'status': 'Друг добавлен'})
        except User.DoesNotExist:
            return Response({'error': 'Пользователь не найден'}, status=404)

    @action(detail=True, methods=['post'])
    def remove(self, request, pk=None):
        try:
            friend = User.objects.get(pk=pk)
            if friend not in request.user.profile.friends.all():
                return Response({'status': 'Нет в друзьях'})
            request.user.profile.friends.remove(friend)
            return Response({'status': 'Друг удалён'})
        except User.DoesNotExist:
            return Response({'error': 'Пользователь не найден'}, status=404)

    @action(detail=True, methods=['get'])
    def is_friend(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
            is_friend = user in request.user.profile.friends.all()
            return Response({'is_friend': is_friend})
        except User.DoesNotExist:
            return Response({'error': 'Пользователь не найден'}, status=404)
