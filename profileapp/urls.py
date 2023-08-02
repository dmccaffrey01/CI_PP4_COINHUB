from django.urls import path
from . import views

app_name = 'profileapp'

urlpatterns = [
    path('', views.profile, name='profile'),
    path('edit', views.edit_profile, name='edit_profile'),
    path('edit_profile_picture', views.edit_profile_picture, name='edit_profile_picture'),
]