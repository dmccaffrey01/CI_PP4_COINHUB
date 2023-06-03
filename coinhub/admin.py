from django.contrib import admin
from .models import CryptoCurrency, PopularCryptoCurrency, TopLoserCrypto, TopGainerCrypto, CryptoDetail

admin.site.register(CryptoCurrency)
admin.site.register(PopularCryptoCurrency)
admin.site.register(TopGainerCrypto)
admin.site.register(TopLoserCrypto)
admin.site.register(CryptoDetail)
