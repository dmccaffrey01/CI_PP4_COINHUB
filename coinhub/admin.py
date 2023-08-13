from django.contrib import admin
from .models import CryptoCurrency, PopularCryptoCurrency
from .models import TopLoserCrypto
from .models import TopGainerCrypto, CryptoDetail, Asset, Transaction


@admin.register(CryptoCurrency)
@admin.register(PopularCryptoCurrency)
@admin.register(TopGainerCrypto)
@admin.register(TopLoserCrypto)
class CryptoCurrencyAdmin(admin.ModelAdmin):
    """
    Crypto Currency Admin with search filters and ordering of rank
    """
    search_fields = ('symbol', 'name', 'uuid')
    ordering = ('rank',)


@admin.register(CryptoDetail)
class CryptoCurrencyAdmin(admin.ModelAdmin):
    """
    Crpto Detail Admin with search filters and ordering of rank
    """
    search_fields = ('symbol', 'name', 'uuid')
    ordering = ('rank',)


@admin.register(Asset)
class CryptoCurrencyAdmin(admin.ModelAdmin):
    """
    Asset admin with search filter ordering filter and display
    """
    search_fields = ('symbol', 'name', 'user__username')
    ordering = ('user__username',)
    list_filter = ('name', 'symbol', 'user__username')
    list_display = ('name', 'user_username')

    def user_username(self, obj):
        return obj.user.username

    user_username.short_description = 'User'


@admin.register(Transaction)
class CryptoCurrencyAdmin(admin.ModelAdmin):
    """
    Transaction admin with search filter ordering filter and display
    """
    search_fields = ('symbol', 'type', 'user__username', 'transaction_uuid')
    ordering = ('user__username', 'time', 'type', 'status', 'symbol')
    list_filter = ('user__username', 'type', 'symbol', 'time', 'status')
    list_display = ('user_username', 'symbol', 'type', 'status')

    def user_username(self, obj):
        return obj.user.username

    user_username.short_description = 'User'
