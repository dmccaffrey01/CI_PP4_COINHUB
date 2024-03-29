import os
import requests
from django.shortcuts import render, redirect
from .models import CryptoCurrency, PopularCryptoCurrency
from .models import TopGainerCrypto, TopLoserCrypto
from .models import CryptoDetail, Asset, Transaction
from django.contrib.auth.decorators import login_required
import json
from django.http import JsonResponse
from django.core.paginator import Paginator
from datetime import datetime
from django.core import serializers
from django.db.models import Q
from decimal import Decimal
from django.utils import timezone
import time
from django.contrib import messages
import math


def index(request):
    """
    Creates crypto list and popular crypto and creates models for them
    """
    create_crypto_list(request)

    get_popular_crypto(request)

    popular_crypto = PopularCryptoCurrency.objects.all()

    context = {
        'cryptocurrencies': popular_crypto,
    }

    return render(request, 'index.html', context)


def markets(request):
    """
    Gets crypto list and renders market template
    """
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
    """
    Gets crypot currency from input and renders crypto details template
    """
    cryptocurrency = CryptoCurrency.objects.get(symbol=symbol)

    CryptoDetail.objects.all().delete()

    get_crypto_detail_data(request, cryptocurrency)

    crypto_detail = CryptoDetail.objects.first()

    context = {
        'cryptocurrency': cryptocurrency,
        'selected_crypto': crypto_detail,
    }

    return render(request, 'crypto_details.html', context)


def trade_page(request):
    """
    Gets cryto list and renders trade page template
    """
    create_crypto_list(request)
    cryptocurrencies = CryptoCurrency.objects.all()

    context = {
        'cryptocurrencies': cryptocurrencies,
    }

    return render(request, 'trade.html', context)


def deposit_page(request):
    """
    Gets euro asset or creates it and renders depoist template
    """
    user = request.user

    euro_symbol = "EUR"
    euro_asset = Asset.objects.filter(user=user, symbol=euro_symbol).first()
    if euro_asset:
        euro_available = round(euro_asset.total_amount, 2)
    else:
        euro_available = 0

    return render(request, 'deposit.html', {'euro': euro_available})


def portfolio(request):
    """
    Gets all user assets and renders portfolio template
    """
    user = request.user

    assets = Asset.objects.filter(user=user)
    asset_symbols = []
    for asset in assets:
        asset_symbol = asset.symbol
        asset_symbols.append(asset_symbol)
        asset_data = CryptoCurrency.objects.filter(symbol=asset_symbol).first()
        if asset_symbol != 'EUR':
            asset.current_price = asset_data.price
            asset.current_change = asset_data.change

        asset.current_balance = round(
            asset.current_price * asset.total_amount, 2
        )
        asset.save()

    euro = Asset.objects.filter(user=user, symbol='EUR').first()
    euro_amount = round(euro.total_amount, 2)

    context = {
        'user': user,
        'assets': assets,
        'euro': euro_amount,
    }

    return render(request, 'portfolio.html', context)


def trading_pair(request, symbol):
    """
    Gets crypto from input symbol and renders a trade pair template
    """
    user = request.user
    crypto = CryptoCurrency.objects.filter(symbol=symbol).first()
    asset, asset_created = Asset.objects.get_or_create(
        user=user, symbol=symbol
    )
    euro_symbol = 'EUR'
    euro, euro_created = Asset.objects.get_or_create(
        user=user, symbol=euro_symbol
    )

    if asset_created:
        asset.name = crypto.name
        asset.iconUrl = crypto.icon
        asset.save()

    if euro_created:
        euro.name = 'Euro'
        euro.iconUrl = 'https://res.cloudinary.com/dzwyiggcp/image/'\
                       'upload/v1687604163/CI_PP4_COINHUB/'\
                       'icons/vskcbpae6osco4zr3btg.png'
        euro.save()

    create_crypto_list(request)

    cryptocurrencies = CryptoCurrency.objects.all()

    sparkline_data = json.loads(crypto.sparkline)
    sparkline_numbers = [
        float(num) for num in sparkline_data
    ] if sparkline_data else []
    lowest_number = format(
        min(sparkline_numbers), '.2f'
    ) if sparkline_numbers else None
    highest_number = format(
        max(sparkline_numbers), '.2f'
    ) if sparkline_numbers else None

    check_transactions(request)

    pending_status = "Pending"
    hour_time = int(time.time()) - 3660
    transactions = Transaction.objects.filter(
        Q(user=user) & (Q(status=pending_status) | Q(time__gt=hour_time))
    )
    is_transactions = True if len(transactions.values()) > 0 else False

    context = {
        'user': user,
        'asset': asset,
        'euro': euro,
        'euro_amount': round(euro.total_amount, 2),
        'crypto': crypto,
        'cryptocurrencies': cryptocurrencies,
        'low_24h': lowest_number,
        'high_24h': highest_number,
        'transactions': transactions,
        'is_transactions': is_transactions,
    }

    return render(request, 'trading-pair.html', context)


def get_transaction_data(request):
    """
    Gets all the transactions for user
    """
    user = request.user

    pending_status = "Pending"
    hour_time = int(time.time()) - 3660
    transactions = Transaction.objects.filter(
        Q(user=user) & (Q(status=pending_status) | Q(time__gt=hour_time))
    ).values()
    is_transactions = True if len(transactions) > 0 else False
    transactions_data = []
    for transaction in transactions:
        transactions_data.append(transaction)
    data = {
        'transactions': transactions_data,
        'is_transactions': is_transactions,
    }
    return JsonResponse(data, safe=False)


def buy_sell_order(
    request, time_placed, symbol, orderType, bsType, price, amount, total
):
    """
    Validates buy or sell order by getting transaction info and user assets and euro info
    """
    user = request.user

    time_placed = float(time_placed)
    price = float(price)
    amount = float(amount)
    total = float(total)

    euro_symbol = "EUR"
    euro_asset = Asset.objects.filter(user=user, symbol=euro_symbol).first()
    if euro_asset:
        euro_available = euro_asset.total_amount
    else:
        euro_available = 0

    crypto = CryptoCurrency.objects.filter(symbol=symbol).first()

    asset_symbol = symbol
    asset, created = Asset.objects.get_or_create(
        user=user, symbol=asset_symbol
    )

    if not created:
        asset_available = asset.total_amount
    else:
        asset.name = crypto.name
        asset.iconUrl = crypto.icon
        asset.total_amount = 0
        asset_available = 0

    asset_name = asset.name

    if total > euro_available and bsType == "Buy":
        response = {
            "success": "false",
            "message": "Total Exceeds Euro Available",
        }
    elif amount > asset_available and bsType == "Sell":
        response = {
            "success": "false",
            "message": f"Amount Exceeds {asset_name} Available",
        }
    elif total == 0:
        response = {
            "success": "false",
            "message": f"Minimum Total is 0",
        }
    else:

        if bsType == "Buy":
            old_amount = float(euro_asset.total_amount)
            new_amount = old_amount - total
            euro_asset.total_amount = new_amount

            timestamp = int(time.time())

            amount_entry = {
                'amount': float(total),
                'timestamp': timestamp,
                'old_amount': float(old_amount),
                'new_amount': float(new_amount),
            }

            amount_history = euro_asset.amount_history
            new_amount_history = amount_history.replace("'", "\"")
            new_amount_history = json.loads(new_amount_history)
            new_amount_history.append(amount_entry)
            euro_asset.amount_history = new_amount_history

            euro_asset.save()
        else:
            old_amount = float(asset.total_amount)
            new_amount = old_amount - amount
            asset.total_amount = new_amount

            timestamp = int(time.time())

            amount_entry = {
                'amount': float(amount),
                'timestamp': timestamp,
                'old_amount': float(old_amount),
                'new_amount': float(new_amount),
            }

            amount_history = asset.amount_history
            new_amount_history = amount_history.replace("'", "\"")
            new_amount_history = json.loads(new_amount_history)
            new_amount_history.append(amount_entry)
            asset.amount_history = new_amount_history

            asset.save()

        transaction = Transaction.objects.create(
            user=user,
            time=time_placed,
            symbol=symbol,
            price=price,
            amount=amount,
            total=total
        )

        transaction.type = f"{bsType} - {orderType}"
        transaction.status = "Pending"

        transaction.save()

        check_transactions(request)

        response = {
            "success": "true",
            "message": f"Successfully Created a {transaction.type} Order",
        }

    return JsonResponse(response, safe=False)


def check_transactions(request):
    """
    Validates the transaction then fulfills it
    """
    user = request.user

    pending_text = "Pending"

    transactions = Transaction.objects.filter(user=user, status=pending_text)

    UNIX_MIN = 60

    current_time = int(time.time())

    current_time = math.floor(current_time / UNIX_MIN) * UNIX_MIN

    UNIX_HOUR = 3600

    for transaction in transactions:

        if (transaction.type == "Buy - Market" or
                transaction.type == "Sell - Market"):
            fulfill_transaction(request, transaction)

        t_time = transaction.time
        symbol = transaction.symbol

        time_diff = current_time - t_time

        highs = []
        lows = []

        if time_diff > (UNIX_HOUR * 5):
            rounded_current_time = math.floor(
                current_time / UNIX_HOUR
            ) * UNIX_HOUR
            rounded_time = math.ceil(t_time / UNIX_HOUR) * UNIX_HOUR
            rounded_time_diff = rounded_current_time - rounded_time

            hour_limit_counter = int(rounded_time_diff / UNIX_HOUR)
            t_time_limit_counter = (rounded_time - t_time) / UNIX_MIN
            current_time_limit_counter = (
                current_time - rounded_current_time
            ) / UNIX_MIN

            params_data = [
                {
                    "time_period": "minute",
                    "limit_counter": t_time_limit_counter,
                    "toTs": rounded_time,
                },
                {
                    "time_period": "hour",
                    "limit_counter": hour_limit_counter,
                    "toTs": rounded_current_time,
                },
                {
                    "time_period": "minute",
                    "limit_counter": current_time_limit_counter,
                    "toTs": current_time
                },
            ]
        else:
            limit_counter = time_diff / UNIX_MIN

            params_data = [
                {
                    "time_period": "minute",
                    "limit_counter": limit_counter,
                    "toTs": current_time,
                },
            ]

        for pd in params_data:
            url = f'https://min-api.cryptocompare.com/data/'\
                   f'v2/histo{pd["time_period"]}'
            fsym = symbol
            tsym = 'EUR'
            api_key = os.environ.get('CRYPTOCOMPARE_API')

            params = {
                'fsym': fsym,
                'tsym': tsym,
                'limit': pd["limit_counter"],
                'toTs': pd["toTs"],
                'api_key': api_key,
            }

            response = requests.get(url, params=params)
            data = response.json()
            data_list = data['Data']['Data']

            for i, d in enumerate(data_list):
                highs.append(d["high"])
                lows.append(d["low"])
                if (i == (len(data_list) - 1)):
                    current_price = d["close"]

        max_high = max(highs)
        min_low = min(lows)

        if transaction.price < max_high and transaction.price > min_low:
            fulfill_transaction(request, transaction)

    return True


def fulfill_transaction(request, transaction):
    """
    Fulfills transaction and updates models
    """
    user = request.user

    if transaction.status == 'Fulfilled':
        return 'Fulfilled'

    symbol = transaction.symbol

    total = transaction.total

    euro = Asset.objects.get(symbol='EUR', user=user)

    if (transaction.type == 'Sell - Limit' or
            transaction.type == 'Sell - Market'):
        transaction_type = 'Sell'
    else:
        transaction_type = 'Buy'

    crypto = CryptoCurrency.objects.get(symbol=symbol)

    asset, created = Asset.objects.get_or_create(user=user, symbol=symbol)

    if created:
        asset.iconUrl = crypto.icon
        asset.name = crypto.name

    if transaction_type == 'Buy':
        old_amount = asset.total_amount
        new_amount = old_amount + transaction.amount
        asset.total_amount = new_amount

        amount_entry = {
            'amount': float(transaction.amount),
            'timestamp': int(time.time()),
            'old_amount': float(old_amount),
            'new_amount': float(new_amount),
        }

        amount_history = asset.amount_history
        new_amount_history = amount_history.replace("'", "\"")
        new_amount_history = json.loads(new_amount_history)
        new_amount_history.append(amount_entry)
        asset.amount_history = new_amount_history

        asset.save()

    if transaction_type == 'Sell':
        old_amount = euro.total_amount
        new_amount = old_amount + total
        euro.total_amount = new_amount

        amount_entry = {
            'amount': float(total),
            'timestamp': int(time.time()),
            'old_amount': float(old_amount),
            'new_amount': float(new_amount),
        }

        amount_history = euro.amount_history
        new_amount_history = amount_history.replace("'", "\"")
        new_amount_history = json.loads(new_amount_history)
        new_amount_history.append(amount_entry)
        euro.amount_history = new_amount_history

        euro.save()

    transaction.status = "Fulfilled"

    transaction.save()

    return 'Fulfilled'


def delete_transaction(request, transaction_uuid, symbol):
    """
    Delete a transaction
    """
    user = request.user

    transaction = Transaction.objects.get(
        transaction_uuid=transaction_uuid, user=user
    )

    euro_asset = Asset.objects.get(user=user, symbol='EUR')
    asset = Asset.objects.get(user=user, symbol=symbol)

    if (transaction.type == 'Buy - Market' or
            transaction.type == 'Buy - Limit'):
        transaction_type = 'Buy'
    else:
        transaction_type = 'Sell'

    if transaction_type == 'Buy':
        old_amount = euro_asset.total_amount
        new_amount = old_amount + transaction.total
        euro_asset.total_amount = new_amount

        amount_entry = {
            'amount': float(transaction.total),
            'timestamp': int(time.time()),
            'old_amount': float(old_amount),
            'new_amount': float(new_amount),
        }

        amount_history = euro_asset.amount_history
        new_amount_history = amount_history.replace("'", "\"")
        new_amount_history = json.loads(new_amount_history)
        new_amount_history.append(amount_entry)
        euro_asset.amount_history = new_amount_history
        euro_asset.save()
    else:
        old_amount = asset.total_amount
        new_amount = old_amount + transaction.amount
        asset.total_amount = new_amount

        amount_entry = {
            'amount': float(transaction.amount),
            'timestamp': int(time.time()),
            'old_amount': float(old_amount),
            'new_amount': float(new_amount),
        }

        amount_history = asset.amount_history
        new_amount_history = amount_history.replace("'", "\"")
        new_amount_history = json.loads(new_amount_history)
        new_amount_history.append(amount_entry)
        asset.amount_history = new_amount_history
        asset.save()

    transaction.delete()
    messages.success(request, 'You successfully deleted transaction.', extra_tags='notification')
    return redirect('trading_pair', symbol)


def get_trading_pair_data(request, symbol):
    """
    Gets data from api for requested inputted symbol
    """
    url = f'https://min-api.cryptocompare.com/data/v2/histominute'
    fsym = symbol
    tsym = 'EUR'
    limit = 60
    api_key = os.environ.get('CRYPTOCOMPARE_API')
    all_data = []

    params = {
        'fsym': fsym,
        'tsym': tsym,
        'limit': limit,
        'api_key': api_key,
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
    all_data = data_list
    return JsonResponse(all_data, safe=False)


@login_required
def get_user_data(request):
    """
    Gets user assets and euro
    """
    user = request.user
    assets = Asset.objects.filter(user=user).values()
    euro_symbol = 'EUR'
    euro = Asset.objects.filter(user=user, symbol=euro_symbol).values()
    data = {
        'assets': list(assets),
        'euro': list(euro),
    }

    return JsonResponse(data, safe=False)


@login_required
def deposit(request, amount):
    """
    Validates deposit request and fulfills by updating euro
    """
    try:
        deposit_amount = Decimal(amount)
        if deposit_amount <= 0:
            response = {
                'success': False,
                'message': 'Amount must be a positive number.',
            }
            return JsonResponse(response)

        user = request.user
        symbol = 'EUR'
        asset, created = Asset.objects.get_or_create(user=user, symbol=symbol)

        if created:
            asset.symbol = symbol
            asset.iconUrl = 'https://res.cloudinary.com/dzwyiggcp/image/'\
                            'upload/v1687604163/CI_PP4_COINHUB/'\
                            'icons/vskcbpae6osco4zr3btg.png'
            asset.total_amount = 0

        old_amount = asset.total_amount
        new_amount = old_amount + deposit_amount
        asset.total_amount = new_amount

        asset.save()

        amount_entry = {
            'amount': float(deposit_amount),
            'timestamp': int(time.time()),
            'old_amount': float(old_amount),
            'new_amount': float(new_amount),
        }

        amount_history = asset.amount_history
        new_amount_history = amount_history.replace("'", "\"")
        new_amount_history = json.loads(new_amount_history)
        new_amount_history.append(amount_entry)
        asset.amount_history = new_amount_history
        asset.save()

        response = {
            'success': True,
            'total_amount': new_amount,
        }

    except ValueError:
        response = {
            'success': False,
            'message': 'Invalid amount provided.',
        }
        return JsonResponse(response)

    return JsonResponse(response)


def get_crypto_detail_data(request, cryptocurrency):
    """
    Gets the data for the crypto detail
    """
    get_crypto_detail_main_data(request, cryptocurrency)
    get_crypto_detail_price_data(request, cryptocurrency)

    crypto_detail = CryptoDetail.objects.first()

    return crypto_detail


def get_crypto_detail_price_data(request, cryptocurrency):
    """
    Calls request from api to get price data
    """
    symbol = cryptocurrency.symbol
    crypto_detail_price_data_from_api(request, '1m', symbol)

    crypto_detail = CryptoDetail.objects.first()

    return crypto_detail


def crypto_detail_price_data_from_api(request, time_period, symbol):
    """
    Gets the price data from the api
    """
    time_period_data = get_time_period_data(request, time_period)

    url = f'https://min-api.cryptocompare.com/data/'\
          f'v2/histo{time_period_data["time"]}'
    fsym = symbol
    tsym = 'EUR'
    limit = time_period_data['lim']
    counter_limit = time_period_data['count_lim']
    api_key = os.environ.get('CRYPTOCOMPARE_API')
    all_data = []

    params = {
        'fsym': fsym,
        'tsym': tsym,
        'limit': limit,
        'api_key': api_key,
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

    crypto_detail, _ = CryptoDetail.objects.get_or_create(symbol=symbol)
    if limit == 1217 and counter_limit == 3:
        crypto_detail.chart_all = all_data
    elif limit == 720 and counter_limit == 1:
        crypto_detail.chart_1m = all_data
    elif limit == 365 and counter_limit == 1:
        crypto_detail.chart_1y = all_data
    crypto_detail.save()
    
    return JsonResponse(all_data, safe=False)


def get_time_period_data(request, time_period):
    """
    Returns the time period data necessary for calling api
    """
    data = {
        'time': 'hour',
        'lim': 720,
        'count_lim': 1,
    }

    if time_period == '1h':
        data['time'] = 'minute'
        data['lim'] = 60
        data['count_lim'] = 1
    elif time_period == '1d':
        data['time'] = 'minute'
        data['lim'] = 1440
        data['count_lim'] = 1
    elif time_period == '1w':
        data['time'] = 'hour'
        data['lim'] = 168
        data['count_lim'] = 1
    elif time_period == '1m':
        data['time'] = 'hour'
        data['lim'] = 720
        data['count_lim'] = 1
    elif time_period == '1y':
        data['time'] = 'day'
        data['lim'] = 365
        data['count_lim'] = 1
    elif time_period == 'all':
        data['time'] = 'day'
        data['lim'] = 1217
        data['count_lim'] = 3

    return data


def get_crypto_detail_main_data(request, cryptocurrency):
    """
    Gets the other data apart from price
    """
    headers = {
        'x-access-token': os.environ.get('COINRANKING_API')
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

            if crypto_data['supply']['max'] is not None:
                max_supply = crypto_data['supply']['max']
            else:
                max_supply = 0

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
                    'market_cap': crypto_data['marketCap'],
                    'fully_diluted_market_cap': crypto_data[
                        'fullyDilutedMarketCap'
                        ],
                    'volume': crypto_data['24hVolume'],
                    'max_supply': max_supply,
                    'total_supply': crypto_data['supply']['total'],
                    'circulating_supply': crypto_data['supply']['circulating'],
                    'rank': crypto_data['rank'],
                    'all_time_high': crypto_data['allTimeHigh']['price'],
                    'ath_time_stamp': crypto_data['allTimeHigh']['timestamp'],
                    'about': crypto_data['description'],
                    'ath_change': (
                        (
                            float(
                                crypto_data['price']
                            ) - float(
                                crypto_data['allTimeHigh']['price']
                            )

                        ) / float(
                            crypto_data['allTimeHigh']['price']
                        )
                    ) * 100,
                }
            )
            if time_period == '1h':
                crypto_detail.chart_1h = json.dumps(crypto_data['sparkline'])
                crypto_detail.change_1h = crypto_data['change']
                if float(crypto_data['change']) >= 0:
                    crypto_detail.hourly_incline = True
                else:
                    crypto_detail.hourly_incline = False
            elif time_period == '24h':
                crypto_detail.chart_1d = json.dumps(crypto_data['sparkline'])
                crypto_detail.change_24h = crypto_data['change']
                if float(crypto_data['change']) >= 0:
                    crypto_detail.dayly_incline = True
                else:
                    crypto_detail.dayly_incline = False
            elif time_period == '7d':
                crypto_detail.chart_1w = json.dumps(crypto_data['sparkline'])
                crypto_detail.change_7d = crypto_data['change']
                if float(crypto_data['change']) >= 0:
                    crypto_detail.weekly_incline = True
                else:
                    crypto_detail.weekly_incline = False
            crypto_detail.save()
        else:
            print('Invalid data format')

    crypto_detail = CryptoDetail.objects.first()

    return crypto_detail


def get_crypto_detail_json(request):
    """
    Returns the crypto detail data
    """
    crypto = CryptoDetail.objects.values('name', 'symbol', 'links').first()
    return JsonResponse(crypto, safe=False)


def create_crypto_list(request):
    """
    Gets crypto data from api and creates models
    """
    headers = {
        'x-access-token': os.environ.get('COINRANKING_API')
    }

    params = {
        'referenceCurrencyUuid': '5k-_VTxqtCEI'
    }

    response = requests.request(
        "GET",
        "https://api.coinranking.com/v2/coins",
        headers=headers,
        params=params
    )

    if response.status_code == 200:
        print('API request successful')
    else:
        print('API request failed with status code:', response.status_code)
        print('Response content:', response.content)

    data = response.json()
    CryptoCurrency.objects.all().delete()

    if 'data' in data:
        crypto_data = data['data']['coins']
        for crypto in crypto_data:
            symbol = crypto['symbol']
            euro_sybmol = 'EUR'
            euro_trading_pair = f'{symbol}-{euro_sybmol}'

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
                euro_trading_pair=euro_trading_pair,
            )
    else:
        print('Invalid data format')

    cryptocurrencies = CryptoCurrency.objects.all().values()

    return JsonResponse(list(cryptocurrencies), safe=False)


def get_popular_crypto(request):
    """
    Filters popular crypto
    """
    popular_crypto_list = [
        'Bitcoin', 'Ethereum', 'Polkadot', 'Solana', 'Dogecoin'
    ]
    filtered_cryptocurrencies = CryptoCurrency.objects.filter(
        name__in=popular_crypto_list
    )
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
    """
    Filters top gainers crypto
    """
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
    """
    Filters top losers crypto
    """
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
    """
    Gets search results from query
    """
    query = request.GET.get('query')
    results = CryptoCurrency.objects.filter(
        Q(name__icontains=query) | Q(symbol__icontains=query)
    )
    results_data = [{
            'name': result.name,
            'icon': result.icon,
            'symbol': result.symbol,
        } for result in results]
    return JsonResponse(results_data, safe=False)


def get_market_data(request):
    """
    Gets the total market data
    """
    coins = CryptoCurrency.objects.all()
    coins_data = [{
        'name': coin.name,
        'currentPrice': coin.price,
        'change': coin.change,
        'price24hrAgo': coin.price + (coin.price * coin.change),
        'marketCap': coin.market_cap,
        } for coin in coins]

    totalMarketCap = sum(coin['marketCap'] for coin in coins_data)
    weights = sum(
        coin['marketCap'] + (
            coin['change'] * coin['marketCap']
        ) for coin in coins_data
    )
    totalChange = round(weights / totalMarketCap, 2)

    market_data = {
        'marketCap': totalMarketCap,
        'totalChange': totalChange,
    }

    return JsonResponse(market_data, safe=False)
