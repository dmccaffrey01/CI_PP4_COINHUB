# Generated by Django 2.2.24 on 2023-06-24 10:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('coinhub', '0027_auto_20230623_1220'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='assets',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='customuser',
            name='assets_balance',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=20),
        ),
        migrations.AddField(
            model_name='customuser',
            name='assets_balance_history',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='balance',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=20),
        ),
    ]