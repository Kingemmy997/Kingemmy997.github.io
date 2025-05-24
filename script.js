// User Database (Hardcoded for Demo)
const users = {
    'user@crypto.com': { password: 'password123', name: 'John Doe', holdings: { 'bitcoin': 0.5, 'ethereum': 1.2, 'solana': 10 }, balance: 1000, transactions: [] },
    'emma@crypto.com': { password: 'emma123', name: 'Emma Paul', holdings: { 'bitcoin': 1.0, 'ethereum': 0.5, 'solana': 5 }, balance: 500, transactions: [] }
};

// Price Fetching and Charting
const coins = {
    'coins': ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 'cardano', 'dogecoin', 'shiba-inu', 'polkadot', 'avalanche-2'],
    'dashboard': ['bitcoin', 'ethereum', 'solana']
};

const priceData = {};
const chartInstances = {};

function initializePriceData(page) {
    coins[page].forEach(coin => priceData[coin] = []);
}

function fetchPrices(page, gridId) {
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coins[page].join(',')}`)
        .then(response => response.json())
        .then(data => {
            const grid = document.getElementById(gridId);
            grid.innerHTML = '';
            data.forEach(coin => {
                if (priceData[coin.id].length >= 10) priceData[coin.id].shift();
                priceData[coin.id].push({ price: coin.current_price, time: new Date().toLocaleTimeString() });

                const div = document.createElement('div');
                div.className = 'coin-card';
                div.innerHTML = `
                    <div class="coin-header">
                        <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3>
                    </div>
                    <p class="price">$${coin.current_price.toFixed(2)}</p>
                    <p class="change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                        24h: ${coin.price_change_percentage_24h.toFixed(2)}%
                    </p>
                    <canvas id="chart-${coin.id}" height="120"></canvas>
                `;
                grid.appendChild(div);

                const ctx = document.getElementById(`chart-${coin.id}`).getContext('2d');
                const gradient = ctx.createLinearGradient(0, 0, 0, 120);
                gradient.addColorStop(0, 'rgba(0, 204, 153, 0.4)');
                gradient.addColorStop(1, 'rgba(0, 204, 153, 0)');

                if (chartInstances[coin.id]) {
                    chartInstances[coin.id].data.labels = priceData[coin.id].map(d => d.time);
                    chartInstances[coin.id].data.datasets[0].data = priceData[coin.id].map(d => d.price);
                    chartInstances[coin.id].update();
                } else {
                    chartInstances[coin.id] = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: priceData[coin.id].map(d => d.time),
                            datasets: [{
                                label: '',
                                data: priceData[coin.id].map(d => d.price),
                                borderColor: '#00cc99',
                                backgroundColor: gradient,
                                borderWidth: 2,
                                fill: true,
                                tension: 0.4,
                                pointRadius: 0,
                                pointHoverRadius: 5
                            }]
                        },
                        options: {
                            plugins: {
                                legend: { display: false },
                                tooltip: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    titleFont: { size: 12 },
                                    bodyFont: { size: 12 },
                                    callbacks: { label: (context) => `$${context.parsed.y.toFixed(2)}` }
                                }
                            },
                            scales: {
                                x: { ticks: { color: '#d0d0d0', font: { size: 10 }, maxRotation: 0 }, grid: { display: false } },
                                y: { ticks: { color: '#d0d0d0', font: { size: 10 } }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
                            },
                            animation: { duration: 1000, easing: 'easeInOutQuad' }
                        }
                    });
                }
            });
            updateDashboard(); // Update dashboard after price fetch
        })
        .catch(error => {
            console.error(`Error fetching prices for ${page}:`, error);
            document.getElementById(gridId).innerHTML = '<p class="error">Unable to load prices. Please try again later.</p>';
        });
}

function startPriceUpdates(page, gridId) {
    initializePriceData(page);
    fetchPrices(page, gridId);
    setInterval(() => fetchPrices(page, gridId), 30000);
}

// News Ticker
function fetchNews() {
    fetch('https://api.coingecko.com/api/v3/news')
        .then(response => response.json())
        .then(data => {
            const ticker = document.getElementById('news-ticker');
            ticker.innerHTML = data.slice(0, 5).map(item => `<span>${item.title}</span>`).join(' | ');
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            document.getElementById('news-ticker').innerHTML = '<span>News unavailable. Try again later.</span>';
        });
}

// Login Form Handler
function setupLoginForm() {
    const form = document.getElementById('login-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            if (users[email] && users[email].password === password) {
                localStorage.setItem('currentUser', JSON.stringify({ email, name: users[email].name, holdings: users[email].holdings, balance: users[email].balance, transactions: users[email].transactions }));
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid email or password.');
            }
        });
    }
}

// Dashboard Updates
function updateDashboard() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && document.getElementById('user-portfolio')) {
        const holdings = user.holdings;
        let holdingsText = '';
        let totalValue = 0;
        for (const [coin, amount] of Object.entries(holdings)) {
            const price = priceData[coin]?.[priceData[coin].length - 1]?.price || 0;
            const value = amount * price;
            totalValue += value;
            holdingsText += `${amount} ${coin.toUpperCase()} ($${value.toFixed(2)}) | `;
        }
        document.getElementById('holdings').textContent = holdingsText.slice(0, -3);
        document.getElementById('total-value').textContent = `Total Value: $${totalValue.toFixed(2)}`;
        document.getElementById('balance').textContent = `Balance: $${user.balance.toFixed(2)}`;

        // Update Transaction History
        const historyDiv = document.getElementById('transaction-history');
        historyDiv.innerHTML = user.transactions.length ? user.transactions.map(tx => `<p>${tx}</p>`).join('') : '<p>No transactions yet.</p>';
    }
}

// Buy Investment
function setupBuyForm() {
    const form = document.getElementById('buy-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem('currentUser'));
            const coin = document.getElementById('buy-coin').value;
            const amountUSD = parseFloat(document.getElementById('buy-amount').value);
            const price = priceData[coin]?.[priceData[coin].length - 1]?.price || 0;
            const coinAmount = amountUSD / price;

            if (user.balance >= amountUSD) {
                user.balance -= amountUSD;
                user.holdings[coin] = (user.holdings[coin] || 0) + coinAmount;
                user.transactions.push(`Bought ${coinAmount.toFixed(4)} ${coin.toUpperCase()} for $${amountUSD.toFixed(2)} at ${new Date().toLocaleString()}`);
                localStorage.setItem('currentUser', JSON.stringify(user));
                updateDashboard();
                alert('Purchase successful!');
            } else {
                alert('Insufficient balance.');
            }
        });
    }
}

// Transfer
function setupTransferForm() {
    const form = document.getElementById('transfer-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem('currentUser'));
            const coin = document.getElementById('transfer-coin').value;
            const address = document.getElementById('transfer-address').value;
            const amount = parseFloat(document.getElementById('transfer-amount').value);

            if (user.holdings[coin] >= amount) {
                user.holdings[coin] -= amount;
                user.transactions.push(`Transferred ${amount.toFixed(4)} ${coin.toUpperCase()} to ${address} at ${new Date().toLocaleString()}`);
                localStorage.setItem('currentUser', JSON.stringify(user));
                updateDashboard();
                alert('Transfer successful!');
            } else {
                alert('Insufficient holdings.');
            }
        });
    }
}

// Contact Form Handler
function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            console.log(`Contact Form Submission: Name: ${name}, Email: ${email}, Message: ${message}`);
            alert('Message sent! We’ll get back to you soon.');
            form.reset();
        });
    }
}

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.coin-grid')) {
        startPriceUpdates('coins', 'coin-grid');
        setInterval(fetchNews, 60000);
    }
    if (document.getElementById('dashboard-grid')) {
        startPriceUpdates('dashboard', 'dashboard-grid');
        updateDashboard();
        setupBuyForm();
        setupTransferForm();
    }
    setupLoginForm();
    setupContactForm();

    // Logout Button
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
});
