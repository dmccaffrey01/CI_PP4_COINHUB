from django import forms
from .models import MemberProfile


class MemberProfileForm(forms.ModelForm):
    class Meta:
        model = MemberProfile
        fields = ('first_name', 'last_name')


class MemberProfilePictureForm(forms.ModelForm):
    class Meta:
        model = MemberProfile
        fields = ['profile_image_change']