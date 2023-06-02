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
    volume = models.DecimalField(max_digits=20, decimal_places=2, default=0)

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
    volume = models.DecimalField(max_digits=20, decimal_places=2, default=0)

    def __str__(self):
        return self.name

 
class TopGainerCrypto(models.Model):
    rank = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=10)
    price = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    change = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    icon = models.TextField(default="")
    sparkline = models.TextField(default="")
    market_cap = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    volume = models.DecimalField(max_digits=20, decimal_places=2, default=0)

    def __str__(self):
        return self.name
    

class TopLoserCrypto(models.Model):
    rank = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=10)
    price = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    change = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    icon = models.TextField(default="")
    sparkline = models.TextField(default="")
    market_cap = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    volume = models.DecimalField(max_digits=20, decimal_places=2, default=0)

    def __str__(self):
        return self.name
    

class CryptoDetail(models.Model):
    price = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    chart_1h = models.TextField(default="")
    chart_1d = models.TextField(default="")
    chart_1w = models.TextField(default="")
    chart_1m = models.TextField(default="")
    chart_1y = models.TextField(default="")
    chart_all = models.TextField(default="")
    market_cap = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    volume = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    supply = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    hold_time = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    rank = models.CharField(max_length=100)
    all_time_high = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    change_1h = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    change_24h = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    change_7d = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    ath_change = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    about = models.TextField(default="To find out more about this project visit the resources.")
