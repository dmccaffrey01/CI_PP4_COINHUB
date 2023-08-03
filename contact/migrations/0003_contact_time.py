# Generated by Django 2.2.24 on 2023-08-03 15:33

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('contact', '0002_contact_issue'),
    ]

    operations = [
        migrations.AddField(
            model_name='contact',
            name='time',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
