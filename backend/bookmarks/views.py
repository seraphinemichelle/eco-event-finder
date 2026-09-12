from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Bookmark
from .serializers import BookmarkSerializer

class BookmarkViewSet(viewsets.ViewSet):
    def list(self, request):
        session_id = request.query_params.get('session_id', '')
        qs = Bookmark.objects.filter(session_id=session_id).select_related('event')
        return Response(BookmarkSerializer(qs, many=True).data)

    def create(self, request):
        session_id = request.data.get('session_id')
        event_id   = request.data.get('event_id')
        bm, created = Bookmark.objects.get_or_create(session_id=session_id, event_id=event_id)
        return Response(BookmarkSerializer(bm).data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        session_id = request.query_params.get('session_id', '')
        Bookmark.objects.filter(session_id=session_id, event_id=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)