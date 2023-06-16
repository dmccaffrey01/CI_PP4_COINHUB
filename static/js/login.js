const usernameInput = document.getElementById('id_login');
const passwordInput = document.getElementById('id_password');
const form = document.querySelector('form');

const addIcons = (inputs) => {
    usernameInput.classList.add('form-input');
    passwordInput.classList.add('form-input');
    
    for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i];
        let iconContainer = document.createElement('div');
        iconContainer.classList.add('account-input-icon-container');

        let inputContainer = input.parentNode;
        inputContainer.classList.add('account-input-container');

        let icon;
        if (input.getAttribute('id') == 'id_login') {
            icon = `<i class="fa-solid fa-user form-input-icon"></i>`;
        } else if (input.getAttribute('id') == 'id_password') {
            icon = `<i class="fa-solid fa-lock form-input-icon"></i>`;
        }
        iconContainer.innerHTML = icon;
        inputContainer.appendChild(iconContainer);
        inputContainer.appendChild(input);
    }
}

const getIconArray = () => {
    return [usernameInput, passwordInput];
}

const rememberCheckbox = document.getElementById('id_remember');
const rememberCheckboxContainer = rememberCheckbox.parentNode;
const forgotPassword = document.querySelector('.forgot-password');
const fixRememberAndForget = () => {
    rememberCheckboxContainer.classList.add('remember-checkbox-container');
    rememberCheckboxContainer.classList.add('content-container-rows');
    rememberCheckbox.classList.add('remember-checkbox');

    let label = document.createElement('div');
    label.innerText = 'Rember Me';
    label.classList.add('remember-label');

    let rememberContainer = document.createElement('div');
    rememberContainer.classList.add('remember-container');

    rememberContainer.appendChild(label);
    rememberContainer.appendChild(rememberCheckbox);

    rememberCheckboxContainer.appendChild(rememberContainer);
    rememberCheckboxContainer.appendChild(forgotPassword);

    rememberContainer.addEventListener('click', () => {
        rememberCheckbox.checked = !rememberCheckbox.checked;
    })
}

window.onload = () => {
    let inputs = getIconArray();
    addIcons(inputs);
    fixRememberAndForget();
}