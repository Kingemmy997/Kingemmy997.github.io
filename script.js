// Initialize the page (expand as needed)
document.addEventListener('DOMContentLoaded', () => {
  // Carousel
  let currentSlide = 0;
  const items = document.querySelector('.carousel-items');
  if (items) {
    const totalSlides = document.querySelectorAll('.carousel-item').length;
    function goToSlide(n) {
      currentSlide = (n + totalSlides) % totalSlides;
      items.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    const prev = document.querySelector('.carousel-control-prev');
    const next = document.querySelector('.carousel-control-next');
    if (prev && next) {
      prev.addEventListener('click', () => goToSlide(currentSlide - 1));
      next.addEventListener('click', () => goToSlide(currentSlide + 1));
    }
  }

  // Live Crypto Prices (CoinGecko)
  const cryptoList = document.getElementById('crypto-list');
  if (cryptoList) {
    const coins = ['bitcoin', 'ethereum', 'binancecoin', 'solana', 'cardano', 'ripple', 'dogecoin', 'polkadot', 'avalanche-2', 'chainlink'];
    async function fetchCryptoPrices() {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coins.join(',')}&order=market_cap_desc&sparkline=false`
        );
        const data = await response.json();
        cryptoList.innerHTML = '';
        data.forEach(coin => {
          const price = coin.current_price.toFixed(2);
          const change = coin.price_change_percentage_24h.toFixed(2);
          const changeClass = change >= 0 ? 'change-positive' : 'change-negative';
          const cryptoItem = document.createElement('div');
          cryptoItem.classList.add('crypto-item');
          cryptoItem.innerHTML = `
            <h3>${coin.name}</h3>
            <p>$${price} <span class="${changeClass}">${change >= 0 ? '+' : ''}${change}%</span></p>
          `;
          cryptoList.appendChild(cryptoItem);
        });
      } catch (error) {
        cryptoList.innerHTML = '<p>Unable to load prices. Please try again later.</p>';
        console.error('Error fetching crypto prices:', error);
      }
    }
    fetchCryptoPrices();
  }

  // Live Crypto News (CryptoPanic) - NOTE: You need an API key!
  // Example: Replace YOUR_API_TOKEN with your CryptoPanic API key
  // Uncomment and use this in news.html or dashboard.html if you want live news
  /*
  async function fetchCryptoNews() {
    try {
      const response = await fetch('https://cryptopanic.com/api/v1/posts/?auth_token=YOUR_API_TOKEN&public=true');
      const data = await response.json();
      const newsSection = document.createElement('div');
      newsSection.classList.add('news-section');
      newsSection.innerHTML = '<h2>Latest Crypto News</h2>';
      data.results.slice(0, 3).forEach(article => {
        newsSection.innerHTML += `<p><a href="${article.url}" target="_blank">${article.title}</a></p>`;
      });
      document.querySelector('.hero').appendChild(newsSection);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }
  fetchCryptoNews();
  */
});

// Example: Menu toggle for mobile
function toggleMenu() {
  const menu = document.querySelector('nav ul');
  menu.classList.toggle('active');
}
