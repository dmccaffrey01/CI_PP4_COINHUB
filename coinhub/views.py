import os
import requests
from django.shortcuts import render
from .models import CryptoCurrency, PopularCryptoCurrency, TopGainerCrypto, TopLoserCrypto, CryptoDetail
import json
from django.http import JsonResponse
from django.core.paginator import Paginator
from datetime import datetime


def index(request):
    create_crypto_list(request)

    get_popular_crypto(request)
    
    popular_crypto = PopularCryptoCurrency.objects.all()

    context = {
        'cryptocurrencies': popular_crypto,
    }

    return render(request, 'index.html', context)


def markets(request):
    create_crypto_list(request)
    cryptocurrencies = CryptoCurrency.objects.all()

    get_popular_crypto(request)
    popular_crypto = PopularCryptoCurrency.objects.all()[:3]

    get_top_gainers(request)
    top_gainers = TopGainerCrypto.objects.all()[:3]

    get_top_losers(request)
    top_losers = TopLoserCrypto.objects.all()[:3]

    context = {
        'cryptocurrencies': cryptocurrencies,
        'popular_crypto': popular_crypto,
        'top_gainers': top_gainers,
        'top_losers': top_losers,
    }

    return render(request, 'markets.html', context)


def crypto_details(request, symbol):
    cryptocurrency = CryptoCurrency.objects.get(symbol=symbol)

    CryptoDetail.objects.all().delete()

    get_crypto_detail_data(request, cryptocurrency)

    crypto_detail = CryptoDetail.objects.first()

    context = {
        'cryptocurrency': cryptocurrency,
        'selected_crypto': crypto_detail,
    }

    return render(request, 'crypto_details.html', context)


def get_crypto_detail_data(request, cryptocurrency):
    get_crypto_detail_main_data(request, cryptocurrency)
    get_crypto_detail_price_data(request, cryptocurrency)

    crypto_detail = CryptoDetail.objects.first()

    return crypto_detail


def get_crypto_detail_price_data(request, cryptocurrency):
    symbol = cryptocurrency.symbol
    crypto_detail_price_data_from_api(request, 'day', symbol, 1217, 3)
    crypto_detail_price_data_from_api(request, 'hour', symbol, 720, 1)
    crypto_detail_price_data_from_api(request, 'day', symbol, 365, 1)

    crypto_detail = CryptoDetail.objects.first()

    return crypto_detail
    

def crypto_detail_price_data_from_api(request, time, symbol, lim, count_lim):
    url = f'https://min-api.cryptocompare.com/data/v2/histo{time}'
    fsym = symbol
    tsym = 'EUR'
    limit = lim
    counter_limit = count_lim
    all_data = []

    params = {
        'fsym': fsym,
        'tsym': tsym,
        'limit': limit,
    }

    response = requests.get(url, params=params)
    data = response.json()
    data_list = data['Data']['Data']
    for d in data_list:
        del d['conversionType']
        if 'conversionSymbol' in d:
            del d['conversionSymbol']
        d['datetime'] = datetime.fromtimestamp(d['time'])
        d['last_price'] = (d['open'] + d['high'] + d['low'] + d['close'])/4
    all_data = data_list + all_data

    counter = 1

    while counter < counter_limit:
        last_timestamp = data['Data']['TimeFrom']
        params['limit'] = limit
        params['toTs'] = last_timestamp

        response = requests.get(url, params=params)
        data = response.json()
        data_list = data['Data']['Data']
        for d in data_list:
            del d['conversionType']
            if 'conversionSymbol' in d:
                del d['conversionSymbol']
            d['datetime'] = datetime.fromtimestamp(d['time'])
            d['last_price'] = (d['open'] + d['high'] + d['low'] + d['close'])/4
        all_data = data_list + all_data

        counter += 1

    time_period = '1d'
    crypto_detail, _ = CryptoDetail.objects.get_or_create(symbol=symbol)
    if lim == 1217 and count_lim == 3:
        crypto_detail.chart_all = all_data
        time_period = 'all_time'
    elif lim == 720 and count_lim == 1:
        crypto_detail.chart_1m = all_data
        time_period = '1m'
    elif lim == 365 and count_lim == 1:
        crypto_detail.chart_1y = all_data
        time_period = '1y' 
    crypto_detail.save()
    
    return JsonResponse(all_data, safe=False)


def get_crypto_detail_main_data(request, cryptocurrency):
    headers = {
        # 'x-access-token': os.environ.get('COINRANKING_API')
    }

    time_periods = ['1h', '24h', '7d']
    
    url = f"https://api.coinranking.com/v2/coin/{cryptocurrency.uuid}"

    for time_period in time_periods:
        params = {
            'referenceCurrencyUuid': '5k-_VTxqtCEI',
            'timePeriod': time_period,
        }
        
        response = requests.request("GET", url, headers=headers, params=params)

        if response.status_code == 200:
            print('API request successful')
        else:
            print('API request failed')

        data = response.json()
        
        if 'data' in data:
            crypto_data = data['data']['coin']
            crypto_detail, _ = CryptoDetail.objects.get_or_create(
                uuid=crypto_data['uuid'],
                defaults={
                    'name': crypto_data['name'],
                    'symbol': crypto_data['symbol'],
                    'color': crypto_data['color'],
                    'icon': crypto_data['iconUrl'],
                    'website_url': crypto_data['websiteUrl'],
                    'links': json.dumps(crypto_data['links']),
                    'price': crypto_data['price'],
                    'chart_1d': json.dumps(crypto_data['sparkline']),
                    'market_cap': crypto_data['marketCap'],
                    'fully_diluted_market_cap': crypto_data['fullyDilutedMarketCap'],
                    'volume': crypto_data['24hVolume'],
                    'max_supply': crypto_data['supply']['max'],
                    'total_supply': crypto_data['supply']['total'],
                    'circulating_supply': crypto_data['supply']['circulating'],
                    'rank': crypto_data['rank'],
                    'all_time_high': crypto_data['allTimeHigh']['price'],
                    'ath_time_stamp': crypto_data['allTimeHigh']['timestamp'],
                    'change_24h': crypto_data['change'],
                    'about': crypto_data['description'],
                    'ath_change': ((float(crypto_data['price']) - float(crypto_data['allTimeHigh']['price'])) / float(crypto_data['allTimeHigh']['price'])) * 100,
                }
            )
            crypto_detail.chart_1h = json.dumps(crypto_data['sparkline'])
            crypto_detail.change_1h = crypto_data['change']
            crypto_detail.chart_1w = json.dumps(crypto_data['sparkline'])
            crypto_detail.change_7d = crypto_data['change']
            crypto_detail.save()
        else:
            print('Invalid data format')

        crypto_detail = CryptoDetail.objects.first()

        return crypto_detail


def create_crypto_list(request):
    headers = {
        # 'x-access-token': os.environ.get('COINRANKING_API')
    }

    params = {
        'referenceCurrencyUuid': '5k-_VTxqtCEI'
    }

    response = requests.request("GET", "https://api.coinranking.com/v2/coins", headers=headers, params=params)

    if response.status_code == 200:
        print('API request successful')
    else:
        print('API request failed')

    data = response.json()
    CryptoCurrency.objects.all().delete()

    if 'data' in data:
        crypto_data = data['data']['coins']
        for crypto in crypto_data:
            CryptoCurrency.objects.create(
                rank=crypto['rank'],
                name=crypto['name'],
                symbol=crypto['symbol'],
                price=crypto['price'],
                change=crypto['change'],
                icon=crypto['iconUrl'],
                sparkline=json.dumps(crypto['sparkline']),
                market_cap=crypto['marketCap'],
                volume=crypto['24hVolume'],
                uuid=crypto['uuid'],
            )
    else:
        print('Invalid data format')

    cryptocurrencies = CryptoCurrency.objects.all().values()

    return JsonResponse(list(cryptocurrencies), safe=False)


def get_popular_crypto(request):
    popular_crypto_list = ['Bitcoin', 'Ethereum', 'Polkadot', 'Solana', 'Dogecoin']
    filtered_cryptocurrencies = CryptoCurrency.objects.filter(name__in=popular_crypto_list)
    PopularCryptoCurrency.objects.all().delete()

    for crypto in filtered_cryptocurrencies:
        PopularCryptoCurrency.objects.create(
            rank=crypto.rank,
            name=crypto.name,
            symbol=crypto.symbol,
            price=crypto.price,
            change=crypto.change,
            icon=crypto.icon,
            sparkline=crypto.sparkline,
            market_cap=crypto.market_cap,
        )

    json_filtered_crypto = filtered_cryptocurrencies.values()

    return JsonResponse(list(json_filtered_crypto), safe=False)


def get_top_gainers(request):
    top_gainers = CryptoCurrency.objects.order_by('-change')[:5]
    TopGainerCrypto.objects.all().delete()

    for crypto in top_gainers:
        TopGainerCrypto.objects.create(
            rank=crypto.rank,
            name=crypto.name,
            symbol=crypto.symbol,
            price=crypto.price,
            change=crypto.change,
            icon=crypto.icon,
            sparkline=crypto.sparkline,
            market_cap=crypto.market_cap,
        )

    top_gainer_data = TopGainerCrypto.objects.all().values()
    return JsonResponse(list(top_gainer_data), safe=False)


def get_top_losers(request):
    top_losers = CryptoCurrency.objects.order_by('change')[:5]
    TopLoserCrypto.objects.all().delete()

    for crypto in top_losers:
        TopLoserCrypto.objects.create(
            rank=crypto.rank,
            name=crypto.name,
            symbol=crypto.symbol,
            price=crypto.price,
            change=crypto.change,
            icon=crypto.icon,
            sparkline=crypto.sparkline,
            market_cap=crypto.market_cap,
        )

    top_loser_data = TopLoserCrypto.objects.all().values()
    return JsonResponse(list(top_loser_data), safe=False)


def crypto_search_results(request):
    query = request.GET.get('query')
    results = CryptoCurrency.objects.filter(name__icontains=query)
    results_data = [{
        'name': result.name, 
        'icon': result.icon, 
        'symbol': result.symbol
        } for result in results]
    return JsonResponse(results_data, safe=False)


def get_market_data(request):
    coins = CryptoCurrency.objects.all()
    coins_data = [{
        'name': coin.name, 
        'currentPrice': coin.price, 
        'change': coin.change,
        'price24hrAgo': coin.price + (coin.price * coin.change), 
        'marketCap': coin.market_cap,
        } for coin in coins]
    
    totalMarketCap = sum(coin['marketCap'] for coin in coins_data)
    weights = sum(coin['marketCap'] + (coin['change'] * coin['marketCap']) for coin in coins_data)
    totalChange = round(weights / totalMarketCap, 2)

    market_data = {
        'marketCap': totalMarketCap,
        'totalChange': totalChange,
    }

    return JsonResponse(market_data, safe=False)
