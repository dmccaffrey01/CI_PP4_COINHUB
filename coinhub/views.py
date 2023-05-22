from django.shortcuts import render
from cloudinary.utils import cloudinary_url
from .models import CryptoCurrency
import requests


def crypto_list(request):
    response = requests.get('https://api.coincap.io/v2/assets')

    if response.status_code == 200:
        print('API request successful')
    else:
        print('API request failed')

    data = response.json()

    CryptoCurrency.objects.all().delete()

    if 'data' in data:
        crypto_data = data['data']
        for crypto in crypto_data:
            CryptoCurrency.objects.create(
                rank=crypto['rank'],
                name=crypto['name'],
                symbol=crypto['symbol'],
                price=crypto['priceUsd'],
                change=crypto['changePercent24Hr'],
            )
    else:
        print('Invalid data format')

    cryptocurrencies = CryptoCurrency.objects.all()

    context = {
        'cryptocurrencies': cryptocurrencies,
    }


    return render(request, 'crypto_list.html', context)


def index(request):
    cryptocurrencies = CryptoCurrency.objects.all()

    popular_crypto = ['Bitcoin', 'Ethereum', 'Polkadot', 'Solana', 'Dogecoin']

    filtered_cryptocurrencies = [crypto for crypto in cryptocurrencies if crypto.name in popular_crypto]

    context = {
        'cryptocurrencies': filtered_cryptocurrencies,
    }

    return render(request, 'index.html', context)

