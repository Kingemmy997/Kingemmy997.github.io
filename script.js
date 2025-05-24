// Price Fetching and Charting Function (for coins.html and dashboard.html)
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

// News Ticker Function (for coins.html)
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

// Login Form Handler (for login.html)
function setupLoginForm() {
    const form = document.getElementById('login-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            if (email === 'user@crypto.com' && password === 'password123') {
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid email or password. Try user@crypto.com / password123');
            }
        });
    }
}

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.coin-grid')) {
        startPriceUpdates('coins', 'coin-grid');
        setInterval(fetchNews, 60000); // Update news every minute
    }
    if (document.getElementById('dashboard-grid')) {
        startPriceUpdates('dashboard', 'dashboard-grid');
    }
    setupLoginForm();
});
