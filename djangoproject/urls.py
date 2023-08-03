from django.contrib import admin
from django.urls import path, include
from contact.views import contact_view


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('coinhub.urls')),
    path('accounts/', include('allauth.urls')),
    path('contact/', contact_view, name='contact'),
    path('profile/', include('profileapp.urls')),
    path('summernote/', include('django_summernote.urls')),
]

