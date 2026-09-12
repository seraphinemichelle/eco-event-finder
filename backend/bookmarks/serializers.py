from rest_framework import serializers
from .models import Bookmark
from events.serializers import EventSerializer

class BookmarkSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    event_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Bookmark
        fields = ['id', 'session_id', 'event', 'event_id', 'created_at']