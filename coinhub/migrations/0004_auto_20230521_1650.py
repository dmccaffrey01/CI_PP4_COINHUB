# Generated by Django 2.2.24 on 2023-05-21 15:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('coinhub', '0003_remove_cryptocurrency_chart'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cryptocurrency',
            name='rank',
            field=models.CharField(max_length=100),
        ),
    ]
