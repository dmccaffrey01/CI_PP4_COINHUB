const emailInput = document.getElementById('id_email');
const form = document.querySelector('form');

const addIcons = (inputs) => {
    
    for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i];
        let iconContainer = document.createElement('div');
        iconContainer.classList.add('account-input-icon-container');

        input.classList.add('form-input');

        let inputContainer = input.parentNode;
        inputContainer.classList.add('account-input-container');

        let icon;
        if (input.getAttribute('id') == 'id_username') {
            icon = `<i class="fa-solid fa-user form-input-icon"></i>`;
        } else if (input.getAttribute('id') == 'id_email') {
            icon = `<i class="fa-solid fa-envelope form-input-icon"></i>`;
        } else if (input.getAttribute('id') == 'id_password1') {
            icon = `<i class="fa-solid fa-lock form-input-icon"></i>`;
        } else if (input.getAttribute('id') == 'id_password2') {
            icon = `<i class="fa-solid fa-user-lock form-input-icon"></i>`;
        }
        iconContainer.innerHTML = icon;
        inputContainer.appendChild(iconContainer);
        inputContainer.appendChild(input);
    }
}

const getIconArray = () => {
    return [emailInput];
}

window.onload = () => {
    let inputs = getIconArray();
    addIcons(inputs);
}