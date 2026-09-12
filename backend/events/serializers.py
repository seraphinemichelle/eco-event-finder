from rest_framework import serializers
from .models import Event, Registration

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Event
        fields = '__all__'

class EventDetailSerializer(serializers.ModelSerializer):
    is_registered = serializers.SerializerMethodField()

    class Meta:
        model  = Event
        fields = '__all__'

    def get_is_registered(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.registrations.filter(user=request.user).exists()
        return False

class RegistrationSerializer(serializers.ModelSerializer):
    event = EventSerializer()

    class Meta:
        model  = Registration
        fields = ['id', 'event', 'created_at']