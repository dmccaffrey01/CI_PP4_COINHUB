# Generated by Django 2.2.24 on 2023-07-07 16:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('coinhub', '0035_auto_20230707_1515'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='time',
            field=models.DecimalField(decimal_places=0, default=0, max_digits=20),
        ),
    ]