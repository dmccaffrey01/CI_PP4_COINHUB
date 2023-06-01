import os
import requests
from django.shortcuts import render
from .models import CryptoCurrency, PopularCryptoCurrency
import json
from django.http import JsonResponse


def index(request):
    create_crypto_list(request)

    get_popular_crypto(request)
    
    popular_crypto = PopularCryptoCurrency.objects.all()

    context = {
        'cryptocurrencies': popular_crypto,
    }

    return render(request, 'index.html', context)


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


def create_crypto_list(request):
    headers = {
        # 'x-access-token': os.environ.get('COINRANKING_API')
    }

    params = {
        'limit': 100,
        'convert': 'EUR',
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
            )
    else:
        print('Invalid data format')

    cryptocurrencies = CryptoCurrency.objects.all().values()

    return JsonResponse(list(cryptocurrencies), safe=False)


def markets(request):
    create_crypto_list(request)

    crytpocurrencies = CryptoCurrency.objects.all()

    context = {
        'cryptocurrencies': crytpocurrencies,
    }

    return render(request, 'markets.html', context)


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
