import os
import requests
from django.shortcuts import render
from .models import CryptoCurrency
import json


def crypto_list(request):
    headers = {
        # 'x-access-token': os.environ.get('COINRANKING_API')
    }

    params = {
        'limit': 50,
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
            )
    else:
        print('Invalid data format')

    cryptocurrencies = CryptoCurrency.objects.all()

    context = {
        'cryptocurrencies': cryptocurrencies,
    }

    return render(request, 'crypto_list.html', context)


def index(request):
    crypto_list(request)
    
    cryptocurrencies = CryptoCurrency.objects.all()

    popular_crypto = ['Bitcoin', 'Ethereum', 'Polkadot', 'Solana', 'Dogecoin']

    filtered_cryptocurrencies = [crypto for crypto in cryptocurrencies if crypto.name in popular_crypto]

    sparkline_data = [json.loads(crypto.sparkline) for crypto in filtered_cryptocurrencies]

    context = {
        'cryptocurrencies': filtered_cryptocurrencies,
        'sparkline_data': json.dumps(sparkline_data),
    }

    return render(request, 'index.html', context)


def markets(request):
    crypto_list(request)

    crytpocurrencies = CryptoCurrency.objects.all()

    context = {
        'cryptocurrencies': crytpocurrencies,
    }

    return render(request, 'markets.html', context)


def crypto_search_results(request):
    query = request.GET.get('query')
    results = CryptoCurrency.objects.filter(name__icontains=query)
    return render(request, 'crypto_search_results.html', {'results': results})