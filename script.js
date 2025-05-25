// User Database Simulation with localStorage
const usersDB = JSON.parse(localStorage.getItem('users')) || [];
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Sample User Data (for demo purposes, pre-populated if no users exist)
if (usersDB.length === 0) {
  usersDB.push({
    username: "user1",
    password: "pass123",
    balance: 50000, // In EUR
    portfolio: [
      { coin: "Bitcoin", amount: 1.5, value: 0 },
      { coin: "Ethereum", amount: 10, value: 0 }
    ],
    transactions: []
  });
  localStorage.setItem('users', JSON.stringify(usersDB));
}

// Sign-up Function
function signUp(event) {
  event.preventDefault();
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;
  if (usersDB.some(user => user.username === username)) {
    alert('Username already exists!');
    return;
  }
  usersDB.push({
    username,
    password,
    balance: 10000, // Initial balance in EUR
    portfolio: [],
    transactions: []
  });
  localStorage.setItem('users', JSON.stringify(usersDB));
  alert('Sign-up successful! Please log in.');
  window.location.href = 'login.html';
}

// Login Function
function login(event) {
  event.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  const user = usersDB.find(user => user.username === username && user.password === password);
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = 'portfolio.html';
  } else {
    alert('Invalid username or password!');
  }
}

// Logout Function
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// Check if User is Logged In
function checkLogin() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser && window.location.pathname.includes('portfolio.html')) {
    window.location.href = 'login.html';
  }
}

// Display Dashboard Data
function displayDashboard() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) return;
  
  // Update Balance
  document.getElementById('balance').textContent = currentUser.balance.toLocaleString() + ' €';
  
  // Update Portfolio
  const portfolioTable = document.getElementById('portfolio-table');
  portfolioTable.innerHTML = '<tr><th>Coin</th><th>Amount</th><th>Value (€)</th></tr>';
  currentUser.portfolio.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${item.coin}</td><td>${item.amount}</td><td>${item.value.toLocaleString()}</td>`;
    portfolioTable.appendChild(row);
  });
  
  // Update Transactions
  const transactionsTable = document.getElementById('transactions-table');
  transactionsTable.innerHTML = '<tr><th>Type</th><th>Amount</th><th>Coin</th><th>Address</th><th>Date</th></tr>';
  currentUser.transactions.forEach(tx => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${tx.type}</td><td>${tx.amount}</td><td>${tx.coin || '-'}</td><td>${tx.address || '-'}</td><td>${tx.date}</td>`;
    transactionsTable.appendChild(row);
  });
}

// Send Function
function send(event) {
  event.preventDefault();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const amount = parseFloat(document.getElementById('send-amount').value);
  const address = document.getElementById('send-address').value;
  
  if (amount > currentUser.balance) {
    alert('Insufficient balance!');
    return;
  }
  
  currentUser.balance -= amount;
  currentUser.transactions.push({
    type: 'Send',
    amount,
    address,
    date: new Date().toLocaleString()
  });
  
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  const userIndex = usersDB.findIndex(user => user.username === currentUser.username);
  usersDB[userIndex] = currentUser;
  localStorage.setItem('users', JSON.stringify(usersDB));
  alert('Transaction successful!');
  displayDashboard();
}

// Receive Function
function receive(event) {
  event.preventDefault();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const amount = parseFloat(document.getElementById('receive-amount').value);
  
  currentUser.balance += amount;
  currentUser.transactions.push({
    type: 'Receive',
    amount,
    date: new Date().toLocaleString()
  });
  
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  const userIndex = usersDB.findIndex(user => user.username === currentUser.username);
  usersDB[userIndex] = currentUser;
  localStorage.setItem('users', JSON.stringify(usersDB));
  alert('Funds received!');
  displayDashboard();
}

// Trade Function
function trade(event) {
  event.preventDefault();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const action = document.getElementById('trade-action').value;
  const coin = document.getElementById('trade-coin').value;
  const amount = parseFloat(document.getElementById('trade-amount').value);
  const pricePerCoin = parseFloat(document.getElementById(coin.toLowerCase() + '-price').textContent.split(' ')[0].replace(',', ''));
  const totalCost = amount * pricePerCoin;

  if (action === 'buy') {
    if (totalCost > currentUser.balance) {
      alert('Insufficient balance!');
      return;
    }
    currentUser.balance -= totalCost;
    const portfolioItem = currentUser.portfolio.find(item => item.coin === coin);
    if (portfolioItem) {
      portfolioItem.amount += amount;
      portfolioItem.value = portfolioItem.amount * pricePerCoin;
    } else {
      currentUser.portfolio.push({ coin, amount, value: amount * pricePerCoin });
    }
  } else {
    const portfolioItem = currentUser.portfolio.find(item => item.coin === coin);
    if (!portfolioItem || portfolioItem.amount < amount) {
      alert('Insufficient coins to sell!');
      return;
    }
    portfolioItem.amount -= amount;
    portfolioItem.value = portfolioItem.amount * pricePerCoin;
    if (portfolioItem.amount === 0) {
      currentUser.portfolio = currentUser.portfolio.filter(item => item.coin !== coin);
    }
    currentUser.balance += totalCost;
  }

  currentUser.transactions.push({
    type: action.charAt(0).toUpperCase() + action.slice(1),
    amount,
    coin,
    date: new Date().toLocaleString()
  });

  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  const userIndex = usersDB.findIndex(user => user.username === currentUser.username);
  usersDB[userIndex] = currentUser;
  localStorage.setItem('users', JSON.stringify(usersDB));
  alert('Trade successful!');
  displayDashboard();
}

// Wealth Plan Function
function setupWealthPlan(event) {
  event.preventDefault();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const coin = document.getElementById('plan-coin').value;
  const amount = parseFloat(document.getElementById('plan-amount').value);
  const frequency = document.getElementById('plan-frequency').value;

  if (amount > currentUser.balance) {
    alert('Insufficient balance to set up plan!');
    return;
  }

  alert(`Wealth Plan set up: ${amount} € in ${coin} every ${frequency}`);
}

// Open Menu
function openMenu() {
  document.getElementById('menu').style.display = 'block';
}

// Carousel Navigation
function goToSlide(index) {
  const carousel = document.getElementById('crypto-carousel');
  carousel.scrollTo({ left: index * 300, behavior: 'smooth' });
  document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
  document.querySelectorAll('.dot')[index].classList.add('active');
}

// Fetch Real-Time Crypto Prices
fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,cardano,ripple,dogecoin,polkadot,avalanche-2,chainlink&vs_currencies=eur')
  .then(response => response.json())
  .then(data => {
    document.getElementById('btc-price').innerHTML = 
      `${data.bitcoin.eur.toLocaleString()} € <span class="price-change">+670.79 € (1.98%)</span>`;
    document.getElementById('eth-price').innerHTML = 
      `${data.ethereum.eur.toLocaleString()} € <span class="price-change">+50.00 € (2.00%)</span>`;
    document.getElementById('bnb-price').innerHTML = 
      `${data.binancecoin.eur.toLocaleString()} € <span class="price-change">+20.00 € (1.50%)</span>`;
    document.getElementById('sol-price').innerHTML = 
      `${data.solana.eur.toLocaleString()} € <span class="price-change">+10.00 € (1.20%)</span>`;
    document.getElementById('ada-price').innerHTML = 
      `${data.cardano.eur.toLocaleString()} € <span class="price-change">+0.05 € (0.80%)</span>`;
    document.getElementById('xrp-price').innerHTML = 
      `${data.ripple.eur.toLocaleString()} € <span class="price-change">+0.02 € (0.90%)</span>`;
    document.getElementById('doge-price').innerHTML = 
      `${data.dogecoin.eur.toLocaleString()} € <span class="price-change">+0.01 € (1.00%)</span>`;
    document.getElementById('dot-price').innerHTML = 
      `${data.polkadot.eur.toLocaleString()} € <span class="price-change">+0.50 € (1.30%)</span>`;
    document.getElementById('avax-price').innerHTML = 
      `${data['avalanche-2'].eur.toLocaleString()} € <span class="price-change">+1.00 € (1.40%)</span>`;
    document.getElementById('link-price').innerHTML = 
      `${data.chainlink.eur.toLocaleString()} € <span class="price-change">+0.30 € (1.10%)</span>`;
    
    // Update Portfolio Values
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      currentUser.portfolio.forEach(item => {
        const coinId = item.coin.toLowerCase().replace(' ', '-');
        const price = data[coinId] ? data[coinId].eur : 0;
        item.value = item.amount * price;
      });
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      const userIndex = usersDB.findIndex(user => user.username === currentUser.username);
      usersDB[userIndex] = currentUser;
      localStorage.setItem('users', JSON.stringify(usersDB));
      displayDashboard();
    }
  })
  .catch(error => console.error('Error fetching prices:', error));

// Charts for Carousel
const charts = [
  { id: 'btc-chart', data: [35500, 36000, 35800, 36200, 36255] },
  { id: 'eth-chart', data: [2400, 2450, 2430, 2480, 2500] },
  { id: 'bnb-chart', data: [500, 510, 505, 520, 525] },
  { id: 'sol-chart', data: [150, 155, 152, 158, 160] },
  { id: 'ada-chart', data: [0.40, 0.42, 0.41, 0.43, 0.45] },
  { id: 'xrp-chart', data: [0.50, 0.52, 0.51, 0.53, 0.54] },
  { id: 'doge-chart', data: [0.10, 0.11, 0.10, 0.12, 0.12] },
  { id: 'dot-chart', data: [5.00, 5.10, 5.05, 5.15, 5.20] },
  { id: 'avax-chart', data: [30.00, 31.00, 30.50, 31.50, 32.00] },
  { id: 'link-chart', data: [10.00, 10.20, 10.10, 10.30, 10.40] }
];

charts.forEach(chart => {
  const ctx = document.getElementById(chart.id).getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00'],
      datasets: [{
        data: chart.data,
        borderColor: '#FFD700',
        fill: false
      }]
    },
    options: { scales: { x: { display: false }, y: { display: false } } }
  });
});

// Make Carousel Items Clickable
document.querySelectorAll('.carousel-item').forEach(item => {
  item.addEventListener('click', () => {
    const coin = item.getAttribute('data-coin');
    window.location.href = `coins.html?coin=${coin}`;
  });
});

// Check Login on Page Load
window.onload = checkLogin;
