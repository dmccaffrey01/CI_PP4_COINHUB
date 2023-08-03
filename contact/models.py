from django.db import models


class Contact(models.Model):
    ISSUE_CHOICES = [
        ('deposit', 'Depositing Money'),
        ('trading', 'Trading Coins'),
        ('assets', 'Assets not showing in my portfolio'),
        ('other', 'Other'),
    ]
    name = models.CharField(max_length=100)
    email = models.EmailField()
    issue = models.CharField(max_length=255, choices=ISSUE_CHOICES, default='other')
    message = models.TextField()
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
