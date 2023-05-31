from . import views
from django.urls import path


urlpatterns = [
    path('', views.index, name='home'),
    path('crypto-list/', views.crypto_list, name='crypto_list'),
    path('markets/', views.markets, name='markets'),
    path('crypto-search-results/', views.crypto_search_results, name='crypto_search_results'),
]