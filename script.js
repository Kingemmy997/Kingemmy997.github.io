const COINS = [
  'bitcoin', 'ethereum', 'solana', 'dogecoin', 'cardano',
  'chainlink', 'avalanche-2', 'polkadot'
];
const NEWS_API = 'https://cryptopanic.com/api/v1/posts/?auth_token=6e0424690214dc9d9e38b563d6bb5af81c04b6c0&public=true';

function $(selector) { return document.querySelector(selector); }
function $all(selector) { return document.querySelectorAll(selector); }

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
  }
}

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
  }
}

function setupFAQ() {
  $all('.faq-question').forEach(q => {
    q.onclick = function() {
      this.classList.toggle('open');
      const answer = this.nextElementSibling;
      answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
    };
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if ($('#crypto-list')) fetchCryptoPrices('#crypto-list');
  if ($('#live-news')) fetchCryptoNews('#live-news');
  if ($('#dashboard-news')) fetchCryptoNews('#dashboard-news', 3);
  if ($('#faq-list')) setupFAQ();
  // Contact form handler
  const contactForm = $('#contact-form');
  if (contactForm) {
    contactForm.onsubmit = function(e) {
      e.preventDefault();
      alert('Thank you for contacting us! We will reply soon.');
      this.reset();
    }
  }
});
