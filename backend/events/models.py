from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
    ]
    CATEGORY_CHOICES = [
        ('Volunteer', 'Volunteer'),
        ('Workshop', 'Workshop'),
        ('Seminar', 'Seminar'),
    ]
    title       = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category    = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    date_start  = models.DateField()
    date_end    = models.DateField(null=True, blank=True)
    time_info   = models.CharField(max_length=100, blank=True)
    location    = models.CharField(max_length=255)
    organizer   = models.CharField(max_length=255)
    quota       = models.IntegerField(default=100)
    registered  = models.IntegerField(default=0)
    sdg_tags    = models.JSONField(default=list, blank=True)
    image       = models.ImageField(upload_to='events/', blank=True, null=True)
    cover_color = models.CharField(max_length=200, default='linear-gradient(135deg,#74C69D,#2D6A4F)')
    created_at  = models.DateTimeField(auto_now_add=True)
    
class Registration(models.Model):
    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='registrations')
    event      = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'event')

    def __str__(self):
        return f"{self.user.username} - {self.event.title}"