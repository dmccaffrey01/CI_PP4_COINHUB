from django.contrib import admin
from .models import CryptoCurrency, PopularCryptoCurrency, TopLoserCrypto, TopGainerCrypto, CryptoDetail, Asset, Transaction


@admin.register(CryptoCurrency)
@admin.register(PopularCryptoCurrency)
@admin.register(TopGainerCrypto)
@admin.register(TopLoserCrypto)
class CryptoCurrencyAdmin(admin.ModelAdmin):
    
    search_fields = ('symbol', 'name', 'uuid')
    ordering = ('rank',)


@admin.register(CryptoDetail)
class CryptoCurrencyAdmin(admin.ModelAdmin):
    
    search_fields = ('symbol', 'name', 'uuid')
    ordering = ('rank',)


@admin.register(Asset)
class CryptoCurrencyAdmin(admin.ModelAdmin):
    
    search_fields = ('symbol', 'name', 'user__username')
    ordering = ('user__username',)  # Order by username of the related user
    list_filter = ('name', 'symbol', 'user__username')  # Filter by name, symbol, and username
    list_display = ('name', 'user_username')  # Add 'user_username' method to display user's username

    def user_username(self, obj):
        return obj.user.username

    user_username.short_description = 'User'


@admin.register(Transaction)
class CryptoCurrencyAdmin(admin.ModelAdmin):
    
    search_fields = ('symbol', 'type', 'user__username', 'transaction_uuid')
    ordering = ('user__username', 'time', 'type', 'status', 'symbol')  # Order by username of the related user
    list_filter = ('user__username', 'type', 'symbol', 'time', 'status')  # Filter by name, symbol, and username
    list_display = ('user_username', 'symbol', 'type', 'status')  # Add 'user_username' method to display user's username

    def user_username(self, obj):
        return obj.user.username

    user_username.short_description = 'User'








