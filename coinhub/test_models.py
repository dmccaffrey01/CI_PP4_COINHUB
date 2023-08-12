from django.test import TestCase

from .models import CryptoCurrency, PopularCryptoCurrency
from .models import TopGainerCrypto, TopLoserCrypto
from .models import CryptoDetail, Asset, Transaction
from django.contrib.auth.models import User
import uuid


class TestModels(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', password='testpassword'
        )

    def test_new_crypto_currency(self):
        crypto_currency = CryptoCurrency.objects.create(
            name='Test Coin',
            rank=10,
            symbol='TST',
            price='123.45',
            change='2.34',
            icon='test_icon_url',
            sparkline='test_sparkline_data',
            market_cap='6789.00',
            volume='9876.00',
            euro_trading_pair='TST/EUR',
            uuid='test_uuid'
        )

        self.assertEqual(crypto_currency.name, 'Test Coin')
        self.assertEqual(crypto_currency.rank, 10)
        self.assertEqual(crypto_currency.symbol, 'TST')
        self.assertEqual(crypto_currency.price, '123.45')
        self.assertEqual(crypto_currency.change, '2.34')
        self.assertEqual(crypto_currency.icon, 'test_icon_url')
        self.assertEqual(crypto_currency.sparkline, 'test_sparkline_data')
        self.assertEqual(crypto_currency.market_cap, '6789.00')
        self.assertEqual(crypto_currency.volume, '9876.00')
        self.assertEqual(crypto_currency.euro_trading_pair, 'TST/EUR')
        self.assertEqual(crypto_currency.uuid, 'test_uuid')

    def test_new_popular_crypto_currency(self):
        popular_crypto_currency = PopularCryptoCurrency.objects.create(
            rank='1',
            name='Bitcoin',
            symbol='BTC',
            price='40000.00',
            change='5.67',
            icon='bitcoin_icon_url',
            sparkline='bitcoin_sparkline_data',
            market_cap='800000000000',
            volume='1000000000'
        )

        self.assertEqual(popular_crypto_currency.rank, '1')
        self.assertEqual(popular_crypto_currency.name, 'Bitcoin')
        self.assertEqual(popular_crypto_currency.symbol, 'BTC')
        self.assertEqual(popular_crypto_currency.price, '40000.00')
        self.assertEqual(popular_crypto_currency.change, '5.67')
        self.assertEqual(popular_crypto_currency.icon, 'bitcoin_icon_url')
        self.assertEqual(popular_crypto_currency.sparkline, 'bitcoin_sparkline_data')
        self.assertEqual(popular_crypto_currency.market_cap, '800000000000')
        self.assertEqual(popular_crypto_currency.volume, '1000000000')

    def test_new_top_gainer_crypto(self):
        top_gainer_crypto = TopGainerCrypto.objects.create(
            rank='1',
            name='Gainer Coin',
            symbol='GNC',
            price='10.00',
            change='8.76',
            icon='gainer_icon_url',
            sparkline='gainer_sparkline_data',
            market_cap='5000000000',
            volume='8000000'
        )

        self.assertEqual(top_gainer_crypto.rank, '1')
        self.assertEqual(top_gainer_crypto.name, 'Gainer Coin')
        self.assertEqual(top_gainer_crypto.symbol, 'GNC')
        self.assertEqual(top_gainer_crypto.price, '10.00')
        self.assertEqual(top_gainer_crypto.change, '8.76')
        self.assertEqual(top_gainer_crypto.icon, 'gainer_icon_url')
        self.assertEqual(top_gainer_crypto.sparkline, 'gainer_sparkline_data')
        self.assertEqual(top_gainer_crypto.market_cap, '5000000000')
        self.assertEqual(top_gainer_crypto.volume, '8000000')

    def test_new_top_loser_crypto(self):
        top_loser_crypto = TopLoserCrypto.objects.create(
            rank='50',
            name='Loser Coin',
            symbol='LSC',
            price='0.05',
            change='-5.32',
            icon='loser_icon_url',
            sparkline='loser_sparkline_data',
            market_cap='2000000',
            volume='3000'
        )

        self.assertEqual(top_loser_crypto.rank, '50')
        self.assertEqual(top_loser_crypto.name, 'Loser Coin')
        self.assertEqual(top_loser_crypto.symbol, 'LSC')
        self.assertEqual(top_loser_crypto.price, '0.05')
        self.assertEqual(top_loser_crypto.change, '-5.32')
        self.assertEqual(top_loser_crypto.icon, 'loser_icon_url')
        self.assertEqual(top_loser_crypto.sparkline, 'loser_sparkline_data')
        self.assertEqual(top_loser_crypto.market_cap, '2000000')
        self.assertEqual(top_loser_crypto.volume, '3000')

    def test_new_crypto_detail(self):
        crypto_detail = CryptoDetail.objects.create(
            uuid='123456',
            name='Test Coin',
            symbol='TST',
            color='blue',
            icon='test_icon_url',
            website_url='https://testcoin.com',
            links='{"twitter": "https://twitter.com/testcoin", "reddit": "https://reddit.com/r/testcoin"}',
            price='100.00',
            chart_1h='test_chart_data',
            chart_1d='test_chart_data',
            chart_1w='test_chart_data',
            chart_1m='test_chart_data',
            chart_1y='test_chart_data',
            chart_all='test_chart_data',
            market_cap='500000000',
            fully_diluted_market_cap='550000000',
            volume='1000000',
            max_supply='1000000000',
            total_supply='900000000',
            circulating_supply='800000000',
            rank='10',
            all_time_high='200.00',
            ath_time_stamp='1678845600.00',
            change_1h='5.00',
            change_24h='-2.50',
            change_7d='10.00',
            ath_change='50.00',
            about='This is a test coin.',
            weekly_incline=True,
            dayly_incline=True,
            hourly_incline=False
        )

        self.assertEqual(crypto_detail.uuid, '123456')
        self.assertEqual(crypto_detail.name, 'Test Coin')
        self.assertEqual(crypto_detail.symbol, 'TST')
        self.assertEqual(crypto_detail.color, 'blue')
        self.assertEqual(crypto_detail.icon, 'test_icon_url')
        self.assertEqual(crypto_detail.website_url, 'https://testcoin.com')
        self.assertEqual(crypto_detail.links, '{"twitter": "https://twitter.com/testcoin", "reddit": "https://reddit.com/r/testcoin"}')
        self.assertEqual(crypto_detail.price, '100.00')
        self.assertEqual(crypto_detail.chart_1h, 'test_chart_data')
        self.assertEqual(crypto_detail.chart_1d, 'test_chart_data')
        self.assertEqual(crypto_detail.chart_1w, 'test_chart_data')
        self.assertEqual(crypto_detail.chart_1m, 'test_chart_data')
        self.assertEqual(crypto_detail.chart_1y, 'test_chart_data')
        self.assertEqual(crypto_detail.chart_all, 'test_chart_data')
        self.assertEqual(crypto_detail.market_cap, '500000000')
        self.assertEqual(crypto_detail.fully_diluted_market_cap, '550000000')
        self.assertEqual(crypto_detail.volume, '1000000')
        self.assertEqual(crypto_detail.max_supply, '1000000000')
        self.assertEqual(crypto_detail.total_supply, '900000000')
        self.assertEqual(crypto_detail.circulating_supply, '800000000')
        self.assertEqual(crypto_detail.rank, '10')
        self.assertEqual(crypto_detail.all_time_high, '200.00')
        self.assertEqual(crypto_detail.ath_time_stamp, '1678845600.00')
        self.assertEqual(crypto_detail.change_1h, '5.00')
        self.assertEqual(crypto_detail.change_24h, '-2.50')
        self.assertEqual(crypto_detail.change_7d, '10.00')
        self.assertEqual(crypto_detail.ath_change, '50.00')
        self.assertEqual(crypto_detail.about, 'This is a test coin.')
        self.assertTrue(crypto_detail.weekly_incline)
        self.assertTrue(crypto_detail.dayly_incline)
        self.assertFalse(crypto_detail.hourly_incline)

    def test_new_asset(self):
        asset = Asset.objects.create(
            user=self.user,
            name='Test Asset',
            symbol='TST',
            iconUrl='https://example.com/test_icon.png',
            total_amount='100.00',
            current_price='50.00',
            current_change='10.00',
            current_balance='5000.00',
            amount_history='[50.00, 100.00, 150.00]'
        )

        self.assertEqual(asset.user, self.user)
        self.assertEqual(asset.name, 'Test Asset')
        self.assertEqual(asset.symbol, 'TST')
        self.assertEqual(asset.iconUrl, 'https://example.com/test_icon.png')
        self.assertEqual(asset.total_amount, '100.00')
        self.assertEqual(asset.current_price, '50.00')
        self.assertEqual(asset.current_change, '10.00')
        self.assertEqual(asset.current_balance, '5000.00')
        self.assertEqual(asset.amount_history, '[50.00, 100.00, 150.00]')
    
    def test_new_transaction(self):
        transaction = Transaction.objects.create(
            user=self.user,
            time='1678845600',
            symbol='TST',
            type='Buy',
            price='50.00',
            amount='10.00',
            total='500.00',
            status='Completed',
            transaction_uuid=uuid.uuid4()
        )

        self.assertEqual(transaction.user, self.user)
        self.assertEqual(transaction.time, '1678845600')
        self.assertEqual(transaction.symbol, 'TST')
        self.assertEqual(transaction.type, 'Buy')
        self.assertEqual(transaction.price, '50.00')
        self.assertEqual(transaction.amount, '10.00')
        self.assertEqual(transaction.total, '500.00')
        self.assertEqual(transaction.status, 'Completed')