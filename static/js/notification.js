let notificationContainer = document.querySelector(".notification-container");
let notificationMessage = document.querySelector(".notification-message");
let notificationClose = document.querySelector(".notification-close");

const fadeInFadeOut = (inOrOut) => {
    let startingOpacity;
    let endingOpacity;
    let opacityPosNeg;
    
    if (inOrOut === 'in') {
        startingOpacity = 0;
        endingOpacity = 1;
        opacityPosNeg = 1;
        notificationContainer.style.display = 'flex';
    } else {
        startingOpacity = 1;
        endingOpacity = 0;
        opacityPosNeg = -1;
    }

    let duration = 2000;
    let counter = 0;
    let currentOpacity = startingOpacity;
    let step = duration / 10;

    let fadeInterval = window.setInterval(() => {
        if (counter >= (duration - 10)) {
            if (inOrOut === 'out') {
                notificationContainer.style.display = 'none';
            }
            notificationContainer.style.opacity = endingOpacity;
            clearInterval(fadeInterval);
        } else {
            currentOpacity += (1 / step) * opacityPosNeg;
            notificationContainer.style.opacity = currentOpacity;
            counter += 10;
        }
    }, 10);

}

const closeNotification = () => {
    fadeInFadeOut("out");
}

const displayNotification = (message, type) => {
    notificationMessage.innerHTML = message;

    if (type === "positive") {
        notificationContainer.style.backgroundColor = '#4ec437';
    } else if (type === "negative") {
        notificationContainer.style.backgroundColor = '#d31d1d';
    }

    fadeInFadeOut("in");

    window.setTimeout(() => {
        closeNotification();
    }, 4000);
}

const messages = document.querySelector('.messages');

if (messages) {
    let successMessage = messages.querySelector('.notification');
    displayNotification(successMessage.innerHTML, 'positive');
}