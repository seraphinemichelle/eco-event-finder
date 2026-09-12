from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from .models import Event, Registration
from .serializers import EventSerializer, EventDetailSerializer, RegistrationSerializer

class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset         = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'status']
    search_fields    = ['title', 'location', 'organizer']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EventDetailSerializer
        return EventSerializer

    def get_serializer_context(self):
        return {'request': self.request}

    @action(detail=True, methods=['post'],
            authentication_classes=[TokenAuthentication],
            permission_classes=[IsAuthenticated])
    def register(self, request, pk=None):
        event = self.get_object()
        if event.status == 'completed':
            return Response({'error': 'Event sudah selesai.'}, status=400)
        if Registration.objects.filter(user=request.user, event=event).exists():
            return Response({'error': 'Kamu sudah terdaftar di event ini.'}, status=400)
        if event.registered >= event.quota:
            return Response({'error': 'Kuota penuh.'}, status=400)
        Registration.objects.create(user=request.user, event=event)
        event.registered += 1
        event.save()
        return Response({
            'message': 'Berhasil mendaftar!',
            'registered': event.registered
        })

    @action(detail=True, methods=['delete'],
            authentication_classes=[TokenAuthentication],
            permission_classes=[IsAuthenticated],
            url_path='unregister')
    def unregister(self, request, pk=None):
        event = self.get_object()
        if event.status == 'completed':
            return Response({'error': 'Tidak bisa membatalkan event yang sudah selesai.'}, status=400)
        reg = Registration.objects.filter(user=request.user, event=event).first()
        if not reg:
            return Response({'error': 'Kamu tidak terdaftar di event ini.'}, status=400)
        reg.delete()
        event.registered = max(0, event.registered - 1)
        event.save()
        return Response({'message': 'Registrasi dibatalkan.', 'registered': event.registered})

    @action(detail=False, methods=['get'],
            authentication_classes=[TokenAuthentication],
            permission_classes=[IsAuthenticated],
            url_path='my_registrations')
    def my_registrations(self, request):
        regs = Registration.objects.filter(
            user=request.user
        ).select_related('event').order_by('-created_at')
        serializer = RegistrationSerializer(regs, many=True)
        return Response(serializer.data)