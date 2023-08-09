from django.test import TestCase
from coinhub.models import CryptoCurrency


class CryptoCurrencyModelTest(TestCase):
    def setUp(self):
        self.crypto = CryptoCurrency.objects.create(
            rank=1, name="Bitcoin", symbol="BTC", price=50000, change=5.0,
            icon="", sparkline="", market_cap=1000000000, volume=1000000,
            euro_trading_pair="", uuid=""
        )

    def test_crypto_currency_str(self):
        self.assertEqual(str(self.crypto), "Bitcoin")

    def test_crypto_currency_defaults(self):
        self.assertEqual(self.crypto.price, 50000)
        self.assertEqual(self.crypto.change, 5.0)
        self.assertEqual(self.crypto.icon, "")
        self.assertEqual(self.crypto.sparkline, "")
        self.assertEqual(self.crypto.market_cap, 1000000000)
        self.assertEqual(self.crypto.volume, 1000000)
        self.assertEqual(self.crypto.euro_trading_pair, "")
        self.assertEqual(self.crypto.uuid, "")

    def test_name_max_length(self):
        max_length = self.crypto._meta.get_field('name').max_length
        self.assertEqual(max_length, 100)

    def test_symbol_max_length(self):
        max_length = self.crypto._meta.get_field('symbol').max_length
        self.assertEqual(max_length, 10)

    def test_get_full_description(self):
        full_description = self.crypto.get_full_description()
        expected_description = "Bitcoin (BTC) - Rank: 1, Price: $50000"
        self.assertEqual(full_description, expected_description)