from . import views
from django.urls import path


urlpatterns = [
    path('', views.index, name='home'),
    path('crypto-list/', views.crypto_list, name='crypto_list'),
    path('markets/', views.markets, name='markets'),
    path('crypto-search-results/', views.crypto_search_results, name='crypto_search_results'),
    path('get_market_data/', views.get_market_data, name='get_market_data'),
    path('get_popular_crypto/', views.get_popular_crypto, name='get_popular_crypto'),
]