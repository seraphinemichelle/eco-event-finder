from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from events.views import EventViewSet
from bookmarks.views import BookmarkViewSet
from accounts.views import register, login as login_view

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'bookmarks', BookmarkViewSet, basename='bookmark')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/register/', register),
    path('api/auth/login/',    login_view),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)