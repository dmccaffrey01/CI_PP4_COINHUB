const depositForm = document.querySelector(".deposit-form");
const balanceContainer = document.querySelector(".balance-container");
const loadingIconContainer = document.querySelector(".loading-icon-container");
const depositCard = document.querySelector(".deposit-card");
const formWrapper = document.querySelector(".deposit-form-wrapper");
const cardWrapper = document.querySelector(".deposit-card-wrapper");

const nameInput = document.querySelector(".cardholder-input");
const numberInput = document.querySelector(".cardnumber-input");
const expirationInput = document.querySelector(".expiration-input");
const cvvInput = document.querySelector(".cvv-input");
const amountInput = document.querySelector(".amount-input");

const createValidationError = (input) => {
    let parentContainer = input.parentNode;
    
    input.classList.add("validation-error");

    let errorIconContainer = document.createElement("div");
    errorIconContainer.innerHTML = `<i class="fa-solid fa-circle-exclamation validation-error-icon"></i>`;
    errorIconContainer.classList.add("validation-error-icon-container");
    parentContainer.appendChild(errorIconContainer);

    errorIconContainer.addEventListener("mouseenter", () => {
        let wrapper = document.createElement("div");
        wrapper.classList.add("validation-error-icon-wrapper");
        errorIconContainer.appendChild(wrapper);
        
        let errorText = document.createElement("div");
        errorText.innerText = "Must Not Be Empty";
        errorText.classList.add("white-text");
        errorText.classList.add("validation-error-text");
        wrapper.appendChild(errorText);

        errorIconContainer.addEventListener("mouseleave", () => {
            errorText.remove();
        });
    });

    input.addEventListener("focus", () => {
        input.classList.remove("validation-error");
        errorIconContainer.remove();
    });
}

const validateInputValue = (val) => {
    if (val["value"] === "" || val["value"] === undefined || (Number(val["value"]) > 1000000 && val["input"].classList.contains("amount-input"))) {
        createValidationError(val["input"]);
        return false;
    } else {
        return true;
    }
}

const validateInput = () => {
    let name = nameInput.value;
    let number = numberInput.value;
    let expiration = expirationInput.value;
    let cvv = cvvInput.value;
    let amount = amountInput.value;

    let inputValues = [
        {
            "input": nameInput, 
            "value": name,
        }, 
        {
            "input": numberInput, 
            "value": number,
        },
        {
            "input": expirationInput, 
            "value": expiration,
        },
        {
            "input": cvvInput, 
            "value": cvv,
        },
        {
            "input": amountInput, 
            "value": amount,
        }
    ];

    let validation = true;
    inputValues.forEach(val => {
        validation = validateInputValue(val);
        if (!validation) {
            return false;
        }
    })

    return validation;
}

const addLoadingIcon = () => {
    let loadingIcon = document.createElement("div");
    loadingIconContainer.appendChild(loadingIcon);
    loadingIcon.classList.add("loading-icon");
}

const removeLoadingIcon = () => {
    let loadingIcon = document.querySelector(".loading-icon");
    loadingIcon.remove();
}

const toggleForm = () => {
    let cardWidth = formWrapper.offsetWidth;
    let cardHeight = formWrapper.offsetHeight;

    cardWrapper.style.width = cardWidth + "px";
    cardWrapper.style.height = cardHeight + "px";
    
    let display = formWrapper.style.display;
    if (display !== "none") {
        formWrapper.style.display = "none";
    } else {
        formWrapper.style.display = "flex";
    }
}

const getFormData = () => {
    let amountInput = document.querySelector(".amount-input");
    let data = {
        "amount": amountInput.value,
    }

    return data;
}

const depositAmount = async (amount) => {
    try {
        const response = await fetch(`/deposit/${amount}/`);
        const results = await response.json();
        return results;
      } catch (error) {
         console.log(error);
      }
}

const showBalance = (balance, amount) => {
    let amountSpan = document.querySelector(".deposit-amount");
    let balanceSpans = document.querySelectorAll(".euro-balance");

    amountSpan.textContent = amount;
    balanceSpans.forEach(balanceSpan => {
        balanceSpan.textContent = balance;
    })
    

    removeLoadingIcon();

    balanceContainer.style.display = "flex";
    let addMoreBtn = document.querySelector(".add-more-btn");

    addMoreBtn.addEventListener("click", () => {

    });
}

const depositToBalance = async () => {
    let formData = getFormData();
    let amount = formData["amount"];
    let balanceData = await depositAmount(amount);
    let balance = balanceData["balance"];
    window.setTimeout(() => {
        showBalance(balance, amount);
    }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {

    depositForm.addEventListener("submit", (event) => {
        event.preventDefault();

        let validatedInput = validateInput();
        
        if (!validatedInput) {
            return;
        } else {
            toggleForm();
            addLoadingIcon();
            depositToBalance();
        }
    });
});

