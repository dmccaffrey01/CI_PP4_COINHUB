from django.db import models


class CryptoCurrency(models.Model):
    rank = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=10)
    # icon = models.URLField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    change = models.DecimalField(max_digits=10, decimal_places=2)
    # chart = models.CharField(max_length=100)
