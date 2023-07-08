from . import views
from django.urls import path


urlpatterns = [
    path('', views.index, name='home'),
    path('create-crypto-list/', views.create_crypto_list, name='create_crypto_list'),
    path('markets/', views.markets, name='markets'),
    path('crypto-search-results/', views.crypto_search_results, name='crypto_search_results'),
    path('get_market_data/', views.get_market_data, name='get_market_data'),
    path('get_popular_crypto/', views.get_popular_crypto, name='get_popular_crypto'),
    path('crypto/<str:symbol>/', views.crypto_details, name='crypto_details'),
    path('crypto_detail_price_data_from_api/<str:time_period>/<str:symbol>/', 
         views.crypto_detail_price_data_from_api, name='crypto_detail_price_data_from_api'),
    path('get_crypto_detail_json/', views.get_crypto_detail_json, name='get_crypto_detail_json'),
    path('trade/', views.trade_page, name='trade'),
    path('deposit_euro/', views.deposit_page, name='deposit_page'),
    path('deposit/<str:amount>/', views.deposit, name='deposit'),
    path('portfolio/', views.portfolio, name='portfolio'),
    path('get_user_data/', views.get_user_data, name='get_user_data'),
    path('trading_pair/<str:symbol>/', views.trading_pair, name='trading_pair'),
    path('get_trading_pair_data/<str:symbol>/', views.get_trading_pair_data, name='get_trading_pair_data'),
    path('get_transaction_data/', views.get_transaction_data, name='get_transaction_data'),
    path('buy_sell_order/<str:time_placed>/<str:symbol>/<str:orderType>/<str:bsType>/<str:price>/<str:amount>/<str:total>/', views.buy_sell_order, name='buy_sell_order'),
]