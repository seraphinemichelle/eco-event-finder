from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display  = ['title', 'category', 'status', 'date_start', 'location']
    list_filter   = ['category', 'status']
    search_fields = ['title', 'location', 'organizer']