# Generated by Django 2.2.24 on 2023-07-07 12:50

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('coinhub', '0032_asset_price_change'),
    ]

    operations = [
        migrations.AlterField(
            model_name='asset',
            name='total_amount',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=20),
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.CharField(max_length=200)),
                ('symbol', models.CharField(max_length=10)),
                ('type', models.CharField(max_length=100)),
                ('price', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('amount', models.DecimalField(decimal_places=8, default=0, max_digits=20)),
                ('total', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('status', models.CharField(max_length=20)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transactions', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]