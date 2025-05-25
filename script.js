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
