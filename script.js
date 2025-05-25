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

    if (hamburger && mobileNavMenu) {
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
    }

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
            const ids = cryptoCoinsToFetch.join('%2C');
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h_in_currency`);

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
                // Assuming you have arrow-up.png and arrow-down.png in your images folder
                const arrowIcon = isPositive ? 'images/arrow-up.png' : 'images/arrow-down.png';

                const cryptoCard = `
                    <div class="crypto-card">
                        <div class="coin-header">
                            <img src="${coin.image}" alt="${coin.name} icon" class="coin-icon">
                            <span class="coin-name">${coin.name}</span>
                            <span class="coin-symbol">${coin.symbol.toUpperCase()}</span>
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

    // Call fetchCryptoPrices only if on index.html (or a page with the carousel)
    if (cryptoCarousel) {
        fetchCryptoPrices();
        setInterval(fetchCryptoPrices, 60000); // Update every minute
    }


    // --- Simple Smooth Scrolling for Nav Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Handle mobile menu close if applicable
            if (mobileNavMenu && mobileNavMenu.classList.contains('open')) {
                hamburger.classList.remove('open');
                mobileNavMenu.classList.remove('open');
                document.body.classList.remove('no-scroll');
            }

            // Get target element
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = document.querySelector('.header') ? document.querySelector('.header').offsetHeight : 0; // Check if header exists
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20; // -20 for extra space

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- Demo Login Logic ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission

            const email = loginForm.email.value;
            const password = loginForm.password.value;
            const errorMessage = document.getElementById('loginErrorMessage');

            // Demo Credentials
            const demoEmail = 'demo@cryptowealth.com';
            const demoPassword = 'password123';

            if (email === demoEmail && password === demoPassword) {
                // Successful login
                localStorage.setItem('loggedInUser', 'Demo User'); // Store a simple flag
                window.location.href = 'dashboard.html'; // Redirect to dashboard
            } else {
                // Failed login
                errorMessage.textContent = 'Invalid email or password. Please try again.';
            }
        });
    }

    // --- Dashboard Specific Logic (for dashboard.html) ---
    const dashboardSection = document.getElementById('dashboardSection');
    if (dashboardSection) {
        const userNameElement = document.getElementById('userName');
        const logoutButton = document.getElementById('logoutButton');
        const portfolioValue = document.getElementById('portfolioValue');
        const assetList = document.getElementById('assetList');

        const loggedInUser = localStorage.getItem('loggedInUser');

        if (!loggedInUser) {
            // If not logged in, redirect to login page
            window.location.href = 'login.html';
            return;
        }

        userNameElement.textContent = loggedInUser;

        // Dummy Portfolio Data
        const dummyPortfolio = {
            totalValue: 50000.75, // USD
            assets: [
                { name: 'Bitcoin', symbol: 'BTC', amount: 0.5, value: 35000 },
                { name: 'Ethereum', symbol: 'ETH', amount: 5, value: 15000 },
                { name: 'Cardano', symbol: 'ADA', amount: 1000, value: 300 },
                { name: 'Dogecoin', symbol: 'DOGE', amount: 2000, value: 150 }
            ]
        };

        portfolioValue.textContent = `$${dummyPortfolio.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        dummyPortfolio.assets.forEach(asset => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="asset-name">${asset.name} (${asset.symbol.toUpperCase()})</span>
                <span class="asset-value">$${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            `;
            assetList.appendChild(listItem);
        });

        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser'); // Clear login flag
            window.location.href = 'login.html'; // Redirect to login
        });
    }
});
