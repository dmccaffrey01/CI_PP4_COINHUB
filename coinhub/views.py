import os
import requests
from django.shortcuts import render
from .models import CryptoCurrency, PopularCryptoCurrency, TopGainerCrypto, TopLoserCrypto, CryptoDetail
import json
from django.http import JsonResponse
from django.core.paginator import Paginator


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
    reference_currency_uuid = "2h7cAWbz0k1c"

    headers = {
        # 'x-access-token': os.environ.get('COINRANKING_API')
    }

    url_1 = f"https://api.coinranking.com/v2/coin/{cryptocurrency.uuid}"

    response_1 = requests.request("GET", url_1, headers=headers)

    if response_1.status_code == 200:
        print('API request successful')
    else:
        print('API request failed')

    data_1 = response_1.json()
    
    if 'data' in data_1:
        crypto_data = data_1['data']['coin']
        CryptoDetail.objects.create(
            uuid=crypto_data['uuid'],
            name=crypto_data['name'],
            symbol=crypto_data['symbol'],
            color=crypto_data['color'],
            icon=crypto_data['iconUrl'],
            website_url=crypto_data['websiteUrl'],
            links=json.dumps(crypto_data['links']),
            price=crypto_data['price'],
            chart_1d=json.dumps(crypto_data['sparkline']),
            market_cap=crypto_data['marketCap'],
            fully_diluted_market_cap=crypto_data['fullyDilutedMarketCap'],
            volume=crypto_data['24hVolume'],
            max_supply=crypto_data['supply']['max'],
            total_supply=crypto_data['supply']['total'],
            circulating_supply=crypto_data['supply']['circulating'],
            rank=crypto_data['rank'],
            all_time_high=crypto_data['allTimeHigh']['price'],
            ath_time_stamp=crypto_data['allTimeHight']['timestamp'],
            change_24h=crypto_data['change'],
            about=crypto_data['description'],
        )
    else:
        print('Invalid data format')

    url_2 = f"https://api.coinranking.com/v2/coin/{cryptocurrency.uuid}?timePeriod=1h"

    response_2 = requests.request("GET", url_2, headers=headers)

    if response_2.status_code == 200:
        print('API request successful')
    else:
        print('API request failed')

    data_2 = response_2.json()
    
    if 'data' in data_2:
        crypto_data = data_2['data']['coin']
        CryptoDetail.objects.create(
            chart_1h=json.dumps(crypto_data['sparkline']),
            change_1h=crypto_data['change'],

        )
    else:
        print('Invalid data format')
        
    url_3 = f"https://api.coinranking.com/v2/coin/{cryptocurrency.uuid}?timePeriod=7d"

    response_3 = requests.request("GET", url_3, headers=headers)

    if response_3.status_code == 200:
        print('API request successful')
    else:
        print('API request failed')

    data_3 = response_3.json()
    
    if 'data' in data_3:
        crypto_data = data_3['data']['coin']
        CryptoDetail.objects.create(
            chart_1w=json.dumps(crypto_data['sparkline']),
            change_7d=crypto_data['change'],
            
        )
    else:
        print('Invalid data format')

    url_4 = f"https://api.coinranking.com/v2/coin/{cryptocurrency.uuid}?timePeriod=30d"

    response_4 = requests.request("GET", url_4, headers=headers)

    if response_4.status_code == 200:
        print('API request successful')
    else:
        print('API request failed')

    data_4 = response_4.json()
    
    if 'data' in data_4:
        crypto_data = data_4['data']['coin']
        CryptoDetail.objects.create(
            chart_1m=json.dumps(crypto_data['sparkline']),
        )
    else:
        print('Invalid data format')

    url_5 = f"https://api.coinranking.com/v2/coin/{cryptocurrency.uuid}?timePeriod=1y"

    response_5 = requests.request("GET", url_5, headers=headers)

    if response_5.status_code == 200:
        print('API request successful')
    else:
        print('API request failed')

    data_5 = response_5.json()
    
    if 'data' in data_5:
        crypto_data = data_5['data']['coin']
        CryptoDetail.objects.create(
            chart_1y=json.dumps(crypto_data['sparkline']),
        )
    else:
        print('Invalid data format')

    url_6 = f"https://api.coinranking.com/v2/coin/{cryptocurrency.uuid}?timePeriod=5y"

    response_6 = requests.request("GET", url_6, headers=headers)

    if response_6.status_code == 200:
        print('API request successful')
    else:
        print('API request failed')

    data_6 = response_6.json()
    
    if 'data' in data_6:
        crypto_data = data_6['data']['coin']
        CryptoDetail.objects.create(
            chart_all=json.dumps(crypto_data['sparkline']),
        )
    else:
        print('Invalid data format')

    crypto_detail = CryptoDetail.objects.all()

    if crypto_detail.exists():
        selected_crypto = crypto_detail.first()
    else:
        selected_crypto = None

    context = {
        'cryptocurrency': cryptocurrency,
        'selected_crypto': selected_crypto,
    }

    return render(request, 'crypto_details.html', context)


def create_crypto_list(request):
    headers = {
        # 'x-access-token': os.environ.get('COINRANKING_API')
    }

    params = {
        'limit': 100,
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
