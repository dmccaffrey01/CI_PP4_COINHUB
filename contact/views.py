from django.shortcuts import render, redirect
from .forms import ContactForm
import os
from django.core.mail import send_mail


def contact_view(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            send_contact_email(form.cleaned_data)  # Send the email
            return redirect('contact')

    else:
        form = ContactForm()
    
    return render(request, 'contact.html', {'form': form})


def send_contact_email(data):
    subject = f'CoinHub Message - Issue: {data["issue"]}'
    message = f"Name: {data['name']}\nEmail: {data['email']}\n\n{data['message']}"
    from_email = os.environ.get('HOST_EMAIL')  # Update with your email address
    to_email = [os.environ.get('CONTACT_TO_EMAIL')]  # Update with the recipient's email address
    send_mail(subject, message, from_email, to_email)