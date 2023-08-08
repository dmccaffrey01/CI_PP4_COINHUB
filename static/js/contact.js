const successMessage = document.querySelector('.messages').querySelector('.notification');

if (successMessage) {
    displayNotification(successMessage.innerHTML, 'positive');
}