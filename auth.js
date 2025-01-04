function loadUsers() {
    const data = localStorage.getItem('users');
    return data ? JSON.parse(data) : { users: [] };
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function register(username, password) {
    const users = loadUsers();
    if (users.users.some(user => user.username === username)) {
        return false;
    }
    users.users.push({ username, password });
    saveUsers(users);
    return true;
}

function login(username, password) {
    const users = loadUsers();
    return users.users.some(user => user.username === username && user.password === password);
}

function logout() {
    sessionStorage.removeItem('currentUser');
    document.body.classList.remove('logged-in');
    showLoginForm();
}

function checkAuth() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        showLoginForm();
        return false;
    }
    return true;
}

function showLoginForm() {
    const mainContent = document.getElementById('page-container');
    mainContent.style.display = 'none';
    document.getElementById('auth-container').style.display = 'flex';
}

function hideLoginForm() {
    const mainContent = document.getElementById('page-container');
    mainContent.style.display = 'flex';
    document.getElementById('auth-container').style.display = 'none';
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    if (login(username, password)) {
        sessionStorage.setItem('currentUser', username);
        document.body.classList.add('logged-in');
        hideLoginForm();
        showNotification('Successfully logged in!', 'success');
    } else {
        showNotification('Invalid username or password!', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    if (register(username, password)) {
        showNotification('Registration successful! Please login.', 'success');
        toggleAuthForm();
    } else {
        showNotification('Username already exists!', 'error');
    }
}

function toggleAuthForm() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) {
        showLoginForm();
    }
});