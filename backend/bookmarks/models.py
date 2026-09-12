from django.db import models
from events.models import Event

class Bookmark(models.Model):
    session_id = models.CharField(max_length=100)
    event      = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='bookmarks')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('session_id', 'event')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.session_id} → {self.event.title}"