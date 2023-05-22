from django.db import models
from cloudinary.models import CloudinaryField

class CryptoCurrency(models.Model):
    rank = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=10)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    change = models.DecimalField(max_digits=10, decimal_places=2)
    icon = models.TextField()

    def __str__(self):
        return self.name
