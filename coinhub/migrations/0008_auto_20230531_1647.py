# Generated by Django 2.2.24 on 2023-05-31 15:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('coinhub', '0007_auto_20230522_1753'),
    ]

    operations = [
        migrations.AddField(
            model_name='cryptocurrency',
            name='market_cap',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AddField(
            model_name='cryptocurrency',
            name='yesterday_price',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AlterField(
            model_name='cryptocurrency',
            name='change',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AlterField(
            model_name='cryptocurrency',
            name='price',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]