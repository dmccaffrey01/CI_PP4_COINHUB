# Generated by Django 2.2.24 on 2023-06-03 13:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('coinhub', '0015_auto_20230602_1822'),
    ]

    operations = [
        migrations.AddField(
            model_name='cryptocurrency',
            name='uuid',
            field=models.CharField(default='', max_length=100),
        ),
    ]