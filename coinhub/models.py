from django.db import models
from cloudinary.models import CloudinaryField


class CryptoCurrency(models.Model):
    rank = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=10)
    price = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    change = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    icon = models.TextField(default="")
    sparkline = models.TextField(default="")
    market_cap = models.DecimalField(max_digits=20, decimal_places=2, default=0)

    def __str__(self):
        return self.name
    

class PopularCryptoCurrency(models.Model):
    rank = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=10)
    price = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    change = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    icon = models.TextField(default="")
    sparkline = models.TextField(default="")
    market_cap = models.DecimalField(max_digits=20, decimal_places=2, default=0)

    def __str__(self):
        return self.name