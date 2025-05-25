document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('carousel')) initCarousel();
  if (document.querySelector('.market-section')) fetchCryptoPrices();
  if (document.getElementById('news-container')) fetchCryptoNews();
});

function toggleMenu() {
  const nav = document.querySelector('nav');
  nav.classList.toggle('active');
}

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
