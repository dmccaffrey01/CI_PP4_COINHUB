from django.db import models
from cloudinary.models import CloudinaryField
from django.contrib.auth.models import User


class MemberProfile(models.Model):
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=255, blank=True, default='')
    last_name = models.CharField(max_length=255, blank=True, default='')
    profile_image = CloudinaryField('Profile Image', null=True, blank=True, default='https://res.cloudinary.com/dzwyiggcp/image/upload/v1689692743/MREEA/default-profile-pic_yp9kzz.png')
    profile_image_change = models.CharField(max_length=1000, blank=True, default='')
    
    def save(self, *args, **kwargs):
        if self.user.is_superuser and not self.user.first_name:
            self.user.first_name = "Admin"
            self.user.save()
        if not self.pk:  # Only set default values for new instances
            self.first_name = self.user.first_name
            self.last_name = self.user.last_name
        super().save(*args, **kwargs)

    def __str__(self):
        return self.user.first_name + ' ' + self.user.last_name
