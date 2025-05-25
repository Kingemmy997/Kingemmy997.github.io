document.addEventListener('DOMContentLoaded', () => {
    // --- FAQ Accordion Logic ---
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');

            // Toggle active class
            faqItem.classList.toggle('active');

            // Set max-height for smooth transition
            if (faqItem.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.paddingTop = '15px'; // Restore padding
                answer.style.paddingBottom = '25px'; // Restore padding
            } else {
                answer.style.maxHeight = '0';
                answer.style.paddingTop = '0';
                answer.style.paddingBottom = '0';
            }
        });
    });

    // --- Hamburger Menu Logic ---
    const hamburger = document.querySelector('.hamburger');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileNavMenu.classList.toggle('open');
        // Prevent body scrolling when mobile menu is open
        document.body.classList.toggle('no-scroll');
    });

    // Close mobile menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileNavMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
        });
    });

    // --- Real-Time Crypto Coin Carousel ---
    const cryptoCarousel = document.getElementById('cryptoCarousel');
    const carouselStatus = document.getElementById('carouselStatus');
    const cryptoCoinsToFetch = [
        'bitcoin', 'ethereum', 'ripple', 'litecoin', 'cardano',
        'solana', 'dogecoin', 'polkadot', 'shiba-inu', 'avalanche'
    ]; // Top coins to display

    async function fetchCryptoPrices() {
        if (!cryptoCarousel) return; // Exit if carousel element doesn't exist

        carouselStatus.textContent = 'Loading crypto prices...';
        carouselStatus.style.display = 'block';
        cryptoCarousel.innerHTML = ''; // Clear previous cards

        try {
            // Fetch multiple coins data in one API call for efficiency
            const ids = cryptoCoinsToFetch.join('%2C'); // Join with URL-encoded comma
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (!data || data.length === 0) {
                throw new Error('No crypto data received.');
            }

            carouselStatus.style.display = 'none'; // Hide status
            data.forEach(coin => {
                const change24h = coin.price_change_percentage_24h_in_currency ? coin.price_change_percentage_24h_in_currency.toFixed(2) : 'N/A';
                const isPositive = change24h !== 'N/A' && parseFloat(change24h) >= 0;
                const changeClass = isPositive ? 'positive' : 'negative';
                const arrowIcon = isPositive ? 'images/arrow-up.png' : 'images/arrow-down.png'; // Assuming you have these icons

                const cryptoCard = `
                    <div class="crypto-card">
                        <div class="coin-header">
                            <img src="${coin.image}" alt="${coin.name} icon" class="coin-icon">
                            <span class="coin-name">${coin.name}</span>
                            <span class="coin-symbol">${coin.symbol}</span>
                        </div>
                        <div class="current-price">$${coin.current_price.toLocaleString()}</div>
                        <div class="price-change ${changeClass}">
                            ${change24h}%
                            ${change24h !== 'N/A' ? `<img src="${arrowIcon}" alt="${isPositive ? 'Up' : 'Down'} arrow">` : ''}
                        </div>
                    </div>
                `;
                cryptoCarousel.innerHTML += cryptoCard;
            });

        } catch (error) {
            console.error('Error fetching crypto data:', error);
            carouselStatus.textContent = `Error loading data: ${error.message}. Please try again later.`;
            carouselStatus.style.display = 'block';
            cryptoCarousel.innerHTML = ''; // Clear any partial cards
        }
    }

    // Initial fetch and render
    fetchCryptoPrices();

    // Update prices every 60 seconds (CoinGecko rate limit is 50-100 calls/minute)
    setInterval(fetchCryptoPrices, 60000); // 60,000 ms = 1 minute

    // --- Simple Smooth Scrolling for Nav Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Handle mobile menu close if applicable
            if (mobileNavMenu.classList.contains('open')) {
                hamburger.classList.remove('open');
                mobileNavMenu.classList.remove('open');
                document.body.classList.remove('no-scroll');
            }

            // Get target element
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = document.querySelector('.header').offsetHeight; // Height of fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20; // -20 for extra space

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
