from django.contrib import admin
from .models import CryptoCurrency, PopularCryptoCurrency

admin.site.register(CryptoCurrency)
admin.site.register(PopularCryptoCurrency)
