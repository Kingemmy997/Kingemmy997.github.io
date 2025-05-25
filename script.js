document.addEventListener('DOMContentLoaded', () => {
  // Initialize features based on the current page
  if (document.getElementById('carousel')) initCarousel();
  if (document.querySelector('.market-section')) fetchCryptoPrices();
  if (document.getElementById('dashboard-card')) displayUserDashboard();
  if (document.getElementById('news-container')) fetchCryptoNews();
  if (document.getElementById('login-form')) handleLogin();
  if (document.getElementById('signup-form')) handleSignup();
  if (document.getElementById('contact-form')) handleContactForm();
});

// Navigation menu toggle
function toggleMenu() {
  const nav = document.querySelector('nav');
  nav.classList.toggle('active');
}

// Carousel functionality
let currentSlide = 0;
function initCarousel() {
  const slides = document.querySelectorAll('.carousel-item');
  showSlide(currentSlide);
  setInterval(() => {
    nextSlide();
  }, 5000);
}

function showSlide(index) {
  const slides = document.querySelectorAll('.carousel-item');
  if (index >= slides.length) currentSlide = 0;
  if (index < 0) currentSlide = slides.length - 1;
  slides.forEach(slide => slide.classList.remove('active'));
  slides[currentSlide].classList.add('active');
}

function nextSlide() {
  currentSlide++;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide--;
  showSlide(currentSlide);
}

// Fetch and display live crypto prices
async function fetchCryptoPrices() {
  const coins = [
    { id: 'bitcoin', element: 'crypto-card-1' },
    { id: 'ethereum', element: 'crypto-card-2' },
    { id: 'binancecoin', element: 'crypto-card-3' }
  ];

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coins.map(c => c.id).join(',')}&order=market_cap_desc&sparkline=false`
    );
    const data = await response.json();

    coins.forEach((coin, index) => {
      const card = document.getElementById(coin.element);
      if (data[index]) {
        const price = data[index].current_price.toFixed(2);
        const change = data[index].price_change_percentage_24h.toFixed(2);
        card.querySelector('.price').textContent = `$${price}`;
        card.querySelector('.change').textContent = `${change >= 0 ? '+' : ''}${change}%`;
        card.querySelector('.change').className = `change ${change >= 0 ? 'change-positive' : 'change-negative'}`;
      }
    });
  } catch (error) {
    coins.forEach(coin => {
      const card = document.getElementById(coin.element);
      card.querySelector('.price').textContent = 'Error';
      card.querySelector('.change').textContent = 'N/A';
    });
    console.error('Error fetching crypto prices:', error);
  }
}

// Display personalized dashboard
function displayUserDashboard() {
  const user = JSON.parse(localStorage.getItem('user')) || { id: 'guest', name: 'Guest', balance: 0 };
  const dashboard = document.getElementById('dashboard-card');
  dashboard.innerHTML = `
    <h3>Welcome, ${user.name}</h3>
    <p>Account Balance: $${user.balance.toFixed(2)}</p>
    <p>Total Investments: $${user.balance.toFixed(2)}</p>
    <p>Recent Transactions: None</p>
  `;
}

// Fetch and display crypto news
async function fetchCryptoNews() {
  const newsContainer = document.getElementById('news-container');
  try {
    const response = await fetch('https://cryptopanic.com/api/v1/posts/?auth_token=6e0424690214dc9d9e38b563d6bb5af81c04b6c0&public=true');
    const data = await response.json();
    newsContainer.innerHTML = '';
    data.results.slice(0, 3).forEach(article => {
      const newsItem = document.createElement('p');
      newsItem.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
      newsContainer.appendChild(newsItem);
    });
  } catch (error) {
    newsContainer.innerHTML = '<p>Unable to load news. Please try again later.</p>';
    console.error('Error fetching news:', error);
  }
}

// Handle login
function handleLogin() {
  const form = document.getElementById('login-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = 'dashboard.html';
    } else {
      alert('Invalid email or password.');
    }
  });
}

// Handle sign-up
function handleSignup() {
  const form = document.getElementById('signup-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.email === email)) {
      alert('Email already registered.');
      return;
    }
    const user = { id: Date.now(), name, email, password, balance: 0 };
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify(user));
    window.location.href = 'dashboard.html';
  });
}

// Handle contact form
function handleContactForm() {
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Message sent successfully!');
    form.reset();
  });
}

// FAQ toggle
function toggleFAQ(element) {
  const faqItem = element.parentElement;
  faqItem.classList.toggle('active');
}
