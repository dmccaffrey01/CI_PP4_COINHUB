# Generated by Django 2.2.24 on 2023-06-24 12:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('coinhub', '0029_auto_20230624_1205'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='user_id',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='balance_history',
            field=models.TextField(default='[]'),
        ),
    ]