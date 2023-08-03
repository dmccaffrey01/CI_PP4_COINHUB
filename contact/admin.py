from django.contrib import admin
from .models import Contact


@admin.register(Contact)
class CryptoCurrencyAdmin(admin.ModelAdmin):
    
    search_fields = ('name', 'email')
    list_filter = ('issue',)
    ordering = ('time',)
