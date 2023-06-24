# Generated by Django 2.2.24 on 2023-06-24 11:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('coinhub', '0028_auto_20230624_1102'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='assets',
        ),
        migrations.RemoveField(
            model_name='customuser',
            name='assets_balance',
        ),
        migrations.RemoveField(
            model_name='customuser',
            name='assets_balance_history',
        ),
        migrations.CreateModel(
            name='Asset',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('symbol', models.CharField(max_length=10)),
                ('iconUrl', models.URLField()),
                ('total_amount', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('price', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('total_balance', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('asset_balance_history', models.TextField(default='[]')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assets', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
