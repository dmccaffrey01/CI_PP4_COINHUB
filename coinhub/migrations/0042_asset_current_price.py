# Generated by Django 2.2.24 on 2023-08-03 15:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('coinhub', '0041_auto_20230803_1551'),
    ]

    operations = [
        migrations.AddField(
            model_name='asset',
            name='current_price',
            field=models.DecimalField(decimal_places=2, default=1, max_digits=50),
        ),
    ]
