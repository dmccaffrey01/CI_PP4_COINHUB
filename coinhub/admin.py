from django.contrib import admin
from django.contrib.auth.models import User
from .models import CryptoCurrency, PopularCryptoCurrency, TopLoserCrypto, TopGainerCrypto, CryptoDetail, CustomUser, Asset

admin.site.register(CryptoCurrency)
admin.site.register(PopularCryptoCurrency)
admin.site.register(TopGainerCrypto)
admin.site.register(TopLoserCrypto)
admin.site.register(CryptoDetail)
admin.site.register(CustomUser)
admin.site.register(Asset)
admin.site.register(User)
