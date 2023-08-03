from django.contrib import admin
from .models import MemberProfile


@admin.register(MemberProfile)
class CryptoCurrencyAdmin(admin.ModelAdmin):
    
    search_fields = ('user__username', 'first_name', 'last_name')
    ordering = ('user__username',)

    def user_username(self, obj):
        return obj.user.username

    user_username.short_description = 'User'