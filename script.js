document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Mock login validation
    if (email === 'user@crypto.com' && password === 'password123') {
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid email or password. Try user@crypto.com / password123');
    }
});