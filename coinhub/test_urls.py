from django.test import SimpleTestCase
from django.urls import reverse, resolve

import coinhub.views as views


class TestMenuUrls(SimpleTestCase):
    def test_index_resolved(self):
        url = reverse('home')
        self.assertEquals(resolve(url).func, views.index)
        
    def test_create_crypto_list_resolved(self):
        url = reverse('create_crypto_list')
        self.assertEquals(resolve(url).func, views.create_crypto_list)
        
    def test_markets_resolved(self):
        url = reverse('markets')
        self.assertEquals(resolve(url).func, views.markets)
        
    def test_crypto_search_results_resolved(self):
        url = reverse('crypto_search_results')
        self.assertEquals(resolve(url).func, views.crypto_search_results)
        
    def test_get_market_data_resolved(self):
        url = reverse('get_market_data')
        self.assertEquals(resolve(url).func, views.get_market_data)
        
    def test_get_popular_crypto_resolved(self):
        url = reverse('get_popular_crypto')
        self.assertEquals(resolve(url).func, views.get_popular_crypto)
        
    def test_crypto_details_resolved(self):
        url = reverse('crypto_details', args=['btc'])
        self.assertEquals(resolve(url).func, views.crypto_details)
        
    def test_crypto_detail_price_data_from_api_resolved(self):
        url = reverse('crypto_detail_price_data_from_api', args=['1d', 'btc'])
        self.assertEquals(resolve(url).func, views.crypto_detail_price_data_from_api)
        
    def test_get_crypto_detail_json_resolved(self):
        url = reverse('get_crypto_detail_json')
        self.assertEquals(resolve(url).func, views.get_crypto_detail_json)
        
    def test_trade_page_resolved(self):
        url = reverse('trade')
        self.assertEquals(resolve(url).func, views.trade_page)
    
    def test_deposit_page_resolved(self):
        url = reverse('deposit_page')
        self.assertEquals(resolve(url).func, views.deposit_page)
        
    def test_deposit_resolved(self):
        url = reverse('deposit', args=['100'])
        self.assertEquals(resolve(url).func, views.deposit)
        
    def test_portfolio_resolved(self):
        url = reverse('portfolio')
        self.assertEquals(resolve(url).func, views.portfolio)
        
    def test_get_user_data_resolved(self):
        url = reverse('get_user_data')
        self.assertEquals(resolve(url).func, views.get_user_data)
        
    def test_trading_pair_resolved(self):
        url = reverse('trading_pair', args=['btc'])
        self.assertEquals(resolve(url).func, views.trading_pair)
        
    def test_get_trading_pair_data_resolved(self):
        url = reverse('get_trading_pair_data', args=['btc'])
        self.assertEquals(resolve(url).func, views.get_trading_pair_data)
        
    def test_get_transaction_data_resolved(self):
        url = reverse('get_transaction_data')
        self.assertEquals(resolve(url).func, views.get_transaction_data)
        
    def test_delete_transaction_resolved(self):
        url = reverse('delete_transaction', args=['uuid', 'btc'])
        self.assertEquals(resolve(url).func, views.delete_transaction)
        
    def test_buy_sell_order_resolved(self):
        url = reverse('buy_sell_order', args=['time', 'btc', 'orderType', 'bsType', 'price', 'amount', 'total'])
        self.assertEquals(resolve(url).func, views.buy_sell_order)