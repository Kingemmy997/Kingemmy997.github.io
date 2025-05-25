// ========== CONFIG ==========
const COINS = [
  'bitcoin', 'ethereum', 'solana', 'dogecoin', 'cardano',
  'chainlink', 'avalanche-2', 'polkadot'
];
const NEWS_API = 'https://cryptopanic.com/api/v1/posts/?auth_token=6e0424690214dc9d9e38b563d6bb5af81c04b6c0&public=true';

// ========== UTILITY ==========
function $(selector) { return document.querySelector(selector); }
function $all(selector) { return document.querySelectorAll(selector); }

// ========== LIVE PRICES ==========
async function fetchCryptoPrices(targetId) {
  const target = $(targetId);
  if (!target) return;
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COINS.join(',')}&order=market_cap_desc&sparkline=false`
    );
    const data = await res.json();
    target.innerHTML = data.map(coin => `
      <div class="crypto-item">
        <h3>${coin.name}</h3>
        <p>$${coin.current_price.toFixed(2)}
          <span class="${coin.price_change_percentage_24h>=0?'change-positive':'change-negative'}">
            ${coin.price_change_percentage_24h>=0?'+':''}${coin.price_change_percentage_24h.toFixed(2)}%
          </span>
        </p>
      </div>
    `).join('');
  } catch (err) {
    target.innerHTML = '<p>Unable to load prices. Try again later.</p>';
    console.error('Error fetching crypto prices:', err);
  }
}

// ========== LIVE NEWS ==========
async function fetchCryptoNews(targetId, count=5) {
  const target = $(targetId);
  if (!target) return;
  try {
    const res = await fetch(NEWS_API);
    const data = await res.json();
    target.innerHTML = data.results.slice(0, count).map(article => `
      <div class="news-card">
        <h3>${article.title}</h3>
        <p><a href="${article.url}" target="_blank">Read more</a></p>
      </div>
    `).join('');
  } catch (err) {
    target.innerHTML = '<p>Unable to load news. Try again later.</p>';
    console.error('Error fetching news:', err);
  }
}

// ========== AUTH (localStorage) ==========
// User object: { email, password, name, portfolio: [{coin, amount}], created }
function saveUser(user) {
  localStorage.setItem('cw_user', JSON.stringify(user));
}
function getUser() {
  return JSON.parse(localStorage.getItem('cw_user') || 'null');
}
function clearUser() {
  localStorage.removeItem('cw_user');
}
function isLoggedIn() {
  return !!getUser();
}

// ========== SIGNUP ==========
function handleSignup() {
  const form = $('#signup-form');
  if (!form) return;
  form.onsubmit = function(e) {
    e.preventDefault();
    const name = $('#signup-name').value.trim();
    const email = $('#signup-email').value.trim();
    const password = $('#signup-password').value;
    if (!name || !email || !password) return alert('All fields required!');
    // Fake portfolio for demo
    const portfolio = [
      { coin: "bitcoin", amount: 0.12 },
      { coin: "ethereum", amount: 1.5 },
      { coin: "solana", amount: 10 }
    ];
    const user = { name, email, password, portfolio, created: Date.now() };
    saveUser(user);
    window.location.href = "dashboard.html";
  };
}

// ========== LOGIN ==========
function handleLogin() {
  const form = $('#login-form');
  if (!form) return;
  form.onsubmit = function(e) {
    e.preventDefault();
    const email = $('#login-email').value.trim();
    const password = $('#login-password').value;
    const user = getUser();
    if (!user || user.email !== email || user.password !== password) {
      alert('Invalid credentials!');
      return;
    }
    window.location.href = "dashboard.html";
  };
}

// ========== LOGOUT ==========
function handleLogout() {
  const btn = $('#logout-btn');
  if (!btn) return;
  btn.onclick = function() {
    clearUser();
    window.location.href = "index.html";
  };
}

// ========== DASHBOARD ==========
async function loadDashboard() {
  const user = getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  // Show user info
  $('#dashboard-name').textContent = user.name;
  $('#dashboard-email').textContent = user.email;
  $('#dashboard-joined').textContent = new Date(user.created).toLocaleDateString();

  // Show portfolio
  const pricesRes = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${user.portfolio.map(c=>c.coin).join(',')}`
  );
  const prices = await pricesRes.json();
  const portfolioDiv = $('#dashboard-portfolio');
  let totalValue = 0;
  portfolioDiv.innerHTML = user.portfolio.map(asset => {
    const coin = prices.find(c => c.id === asset.coin);
    const value = coin ? (coin.current_price * asset.amount) : 0;
    totalValue += value;
    return `
      <div class="portfolio-item">
        <div>
          <strong>${coin ? coin.name : asset.coin.toUpperCase()}</strong>
          <span>(${asset.amount} ${coin ? coin.symbol.toUpperCase() : ''})</span>
        </div>
        <div>
          $${value.toFixed(2)}
        </div>
      </div>
    `;
  }).join('');
  $('#dashboard-balance').textContent = "$" + totalValue.toFixed(2);

  // Show recent news
  fetchCryptoNews('#dashboard-news', 3);
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  // Home
  if ($('#crypto-list')) fetchCryptoPrices('#crypto-list');
  if ($('#live-news')) fetchCryptoNews('#live-news');
  // Auth
  handleSignup();
  handleLogin();
  handleLogout();
  // Dashboard
  if ($('#dashboard-name')) loadDashboard();
});
