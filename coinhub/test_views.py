from django.test import TestCase
from django.urls import reverse


class TestViews(TestCase):
    def test_index_view(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'index.html')

    def test_create_crypto_list_view(self):
        response = self.client.get(reverse('create_crypto_list'))
        self.assertEqual(response.status_code, 200)

    def test_markets_view(self):
        response = self.client.get(reverse('markets'))
        self.assertEqual(response.status_code, 200)

    def test_get_market_data_view(self):
        response = self.client.get(reverse('get_market_data'))
        self.assertEqual(response.status_code, 200)

    def test_get_popular_crypto_view(self):
        response = self.client.get(reverse('get_popular_crypto'))
        self.assertEqual(response.status_code, 200)

    def test_get_crypto_detail_json_view(self):
        response = self.client.get(reverse('get_crypto_detail_json'))
        self.assertEqual(response.status_code, 200)

    def test_trade_page_view(self):
        response = self.client.get(reverse('trade'))
        self.assertEqual(response.status_code, 200)

    def test_get_trading_pair_data_view(self):
        symbol = 'btc'
        url = reverse('get_trading_pair_data', args=[symbol])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)