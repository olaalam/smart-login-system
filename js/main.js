const form = document.getElementById('form');
const inputs = document.querySelectorAll('#username, #email, #password');
const nameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const alertBox = document.getElementById('alert');
const exists = document.getElementById('exists');
const success = document.getElementById('success');
const loginForm = document.getElementById('loginForm');
const loginAlert = document.getElementById('validate');
const welcomeMessage = document.getElementById('welcomeMessage');
const userList = JSON.parse(localStorage.getItem('users')) || [];

//function displayAlert()
function displayAlert(element, isVisible) {
    if (element) {
        element.classList.toggle('d-none', !isVisible);
        element.classList.toggle('d-block', isVisible);
    }
}

// Get user input 
function getUserData() {
    return {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value.trim()
    };
}

// Check email already exists 
function emailExists(email) {
    return userList.some(user => user.email === email);
}

// Validate login 
function validateCredentials(loginEmail, loginPassword) {
    for (const user of userList) {
        if (user.email === loginEmail && user.password === loginPassword) {
            return user;
        }
    }
    return null;
}

// Regex rules for validation
const regexRules = {
    username: /^[a-zA-Z0-9]{3,20}$/, 
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ 
};

// Function to validate inputs and toggle helper visibility
function validateAndToggleHelper() {
    const field = this.getAttribute('id'); 
    const value = this.value.trim(); 
    const helperText = document.getElementById(`${field}Helper`); 
    const isValid = regexRules[field].test(value); 
    if (isValid) {
        helperText.classList.replace('d-flex','d-none');
        this.classList.replace('is-valid','is-invalid');
    } else {
        helperText.classList.replace('d-none','d-flex');
        this.classList.replace('is-invalid','is-valid');
    }
}

//call function on input change
inputs.forEach(input => {
    input.addEventListener('input', validateAndToggleHelper);
});

// Save a new user
function saveUser(user) {
    userList.push(user);
    localStorage.setItem('users', JSON.stringify(userList));
}

// Handle user sign-up
function handleSignUp(e) {
    e.preventDefault();
    const userData = getUserData();

    if (!userData.name || !userData.password || !userData.email) {
        displayAlert(alertBox, true);
        return;
    } else {
        displayAlert(alertBox, false);
    }

    if (emailExists(userData.email)) {
        displayAlert(exists, true);
        displayAlert(success, false);
        return;
    } else {
        displayAlert(exists, false);
        saveUser(userData);
        displayAlert(success, true);
    }
}
// Handle user login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    const user = validateCredentials(email, password);
    if (!user) {
        displayAlert(loginAlert, true); 
    } else {
        displayAlert(loginAlert, false); 
        localStorage.setItem('currentUser', user.name); 
        window.location.href = 'index.html';
    }
}


// Display the welcome message
function displayWelcomeMessage() {
    const welcomeMessage = document.getElementById("welcomeMessage");

    if (welcomeMessage) {
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) {
            welcomeMessage.textContent = `Welcome ${currentUser}`;
        } else {
            console.error("No current user found in localStorage.");
        }
    } else {
        console.error("The welcomeMessage element is not found in the DOM.");
    }
}


// Logout function
function setupLogout(event) {
    event.preventDefault();
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

// Add event listeners
document.addEventListener("DOMContentLoaded", function () {
    if (form) {
        form.addEventListener('submit', handleSignUp);
    } else {
        console.error('Sign-up form not found.');
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    } else {
        console.error('Login form not found.');
    }

    // Set up logout button if it exists
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', setupLogout);
    } else {
        console.warn('Logout button not found.');
    }
    displayWelcomeMessage();
});
