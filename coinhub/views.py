import os
import requests
from django.shortcuts import render
from .models import CryptoCurrency, PopularCryptoCurrency, TopGainerCrypto, TopLoserCrypto
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
                volume=crypto['24hVolume'],
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
