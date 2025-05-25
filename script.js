document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const body = document.body;

    if (hamburger && mobileNavMenu && body) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileNavMenu.classList.toggle('open');
            body.classList.toggle('no-scroll'); // Prevent scrolling when menu is open
        });

        // Close mobile menu when a link is clicked
        mobileNavMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileNavMenu.classList.remove('open');
                body.classList.remove('no-scroll');
            });
        });
    }

    // --- Crypto Carousel Functionality ---
    const cryptoCarousel = document.getElementById('crypto-carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const carouselIndicators = document.getElementById('carousel-indicators');

    if (cryptoCarousel) {
        const cryptoData = [
            { name: 'Bitcoin', symbol: 'BTC', price: '67,500.23', change: '+2.15%', type: 'positive', icon: 'images/crypto/bitcoin.png' },
            { name: 'Ethereum', symbol: 'ETH', price: '3,820.75', change: '+1.89%', type: 'positive', icon: 'images/crypto/ethereum.png' },
            { name: 'Solana', symbol: 'SOL', price: '163.15', change: '-0.87%', type: 'negative', icon: 'images/crypto/solana.png' },
            { name: 'Binance Coin', symbol: 'BNB', price: '580.99', change: '+0.50%', type: 'positive', icon: 'images/crypto/binance.png' },
            { name: 'Ripple', symbol: 'XRP', price: '0.52', change: '-1.20%', type: 'negative', icon: 'images/crypto/ripple.png' },
            { name: 'Cardano', symbol: 'ADA', price: '0.45', change: '+0.90%', type: 'positive', icon: 'images/crypto/cardano.png' },
            { name: 'Dogecoin', symbol: 'DOGE', price: '0.15', change: '+3.50%', type: 'positive', icon: 'images/crypto/dogecoin.png' },
            { name: 'Tether USD', symbol: 'USDT', price: '1.00', change: '+0.01%', type: 'positive', icon: 'images/crypto/tether.png' }
        ];

        let currentCardIndex = 0;
        let cardWidth = 0; // Will be set after first render

        const renderCryptoCards = () => {
            cryptoCarousel.innerHTML = ''; // Clear existing cards
            cryptoData.forEach(coin => {
                const card = document.createElement('div');
                card.classList.add('crypto-card');
                card.innerHTML = `
                    <div class="coin-header">
                        <img src="${coin.icon}" alt="${coin.name}" class="coin-icon">
                        <span class="coin-name">${coin.name} <span class="coin-symbol">${coin.symbol}</span></span>
                    </div>
                    <span class="current-price">$${coin.price}</span>
                    <span class="price-change ${coin.type}">
                        ${coin.change}
                        ${coin.type === 'positive' ? '<img src="images/icons/arrow-up.png" alt="up">' : '<img src="images/icons/arrow-down.png" alt="down">'}
                    </span>
                `;
                cryptoCarousel.appendChild(card);
            });

            // Get width of a card after rendering (assuming all are same width)
            if (cryptoCarousel.firstElementChild) {
                cardWidth = cryptoCarousel.firstElementChild.offsetWidth + parseInt(getComputedStyle(cryptoCarousel).gap);
            }
        };

        const updateCarouselPosition = () => {
            cryptoCarousel.scrollLeft = currentCardIndex * cardWidth;
            updateIndicators();
        };

        const updateIndicators = () => {
            if (!carouselIndicators) return;
            carouselIndicators.innerHTML = '';
            const numPages = Math.ceil(cryptoCarousel.scrollWidth / cryptoCarousel.clientWidth);
            for (let i = 0; i < numPages; i++) {
                const dot = document.createElement('span');
                dot.classList.add('indicator-dot');
                if (i === Math.floor(cryptoCarousel.scrollLeft / cryptoCarousel.clientWidth)) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', () => {
                    cryptoCarousel.scrollLeft = i * cryptoCarousel.clientWidth;
                });
                carouselIndicators.appendChild(dot);
            }
        };

        // Initialize
        renderCryptoCards();
        updateIndicators();

        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const scrollAmount = cryptoCarousel.clientWidth; // Scroll by one screen width
                cryptoCarousel.scrollLeft -= scrollAmount;
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const scrollAmount = cryptoCarousel.clientWidth; // Scroll by one screen width
                cryptoCarousel.scrollLeft += scrollAmount;
            });
        }

        // Update indicators on scroll
        cryptoCarousel.addEventListener('scroll', () => {
            updateIndicators();
        });

        // Auto-scroll (optional)
        let autoScrollInterval;
        const startAutoScroll = () => {
            autoScrollInterval = setInterval(() => {
                if (cryptoCarousel.scrollLeft + cryptoCarousel.clientWidth >= cryptoCarousel.scrollWidth) {
                    // Loop back to start
                    cryptoCarousel.scrollLeft = 0;
                } else {
                    cryptoCarousel.scrollLeft += cryptoCarousel.clientWidth; // Scroll by one screen
                }
            }, 3000); // Scroll every 3 seconds
        };

        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };

        // Pause auto-scroll on hover
        cryptoCarousel.addEventListener('mouseenter', stopAutoScroll);
        cryptoCarousel.addEventListener('mouseleave', startAutoScroll);

        startAutoScroll(); // Start auto-scroll initially

        // Update on window resize
        window.addEventListener('resize', () => {
            renderCryptoCards(); // Re-render to recalculate widths
            updateIndicators();
            // Reset scroll position to avoid empty space if width changes dramatically
            cryptoCarousel.scrollLeft = 0;
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });

    // --- Scroll Reveal Animation ---
    const sections = document.querySelectorAll(
        '.features-section, .insights-section, .pricing-section, .faq-section, .contact-section, .dashboard-section, .learn-section, .wallet-section, .transactions-section, .settings-section, .auth-section, .not-found-section, .learn-page-section'
    );

    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null, // viewport
        threshold: 0.15, // 15% of the section must be visible
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Common Form Handling (for login, signup, contact pages) ---
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            const formId = form.id; // e.g., 'login-form', 'signup-form', 'contact-form'
            const emailInput = form.querySelector('input[type="email"]');
            const passwordInput = form.querySelector('input[type="password"]');
            const generalMessage = form.querySelector('.general-message');
            const loadingSpinner = form.querySelector('.loading-spinner');

            // Reset previous errors/messages
            if (emailInput) {
                emailInput.classList.remove('error-input');
                const emailError = emailInput.nextElementSibling;
                if (emailError && emailError.classList.contains('error-message')) {
                    emailError.classList.remove('active');
                }
            }
            if (passwordInput) {
                passwordInput.classList.remove('error-input');
                const passwordError = passwordInput.nextElementSibling;
                if (passwordError && passwordError.classList.contains('error-message')) {
                    passwordError.classList.remove('active');
                }
            }
            if (generalMessage) {
                generalMessage.classList.remove('general-error-message', 'general-success-message', 'active');
                generalMessage.textContent = '';
            }
            if (loadingSpinner) {
                loadingSpinner.classList.add('active'); // Show spinner
            }


            let isValid = true;

            // Basic validation for email
            if (emailInput && !emailInput.value.includes('@')) {
                isValid = false;
                emailInput.classList.add('error-input');
                const emailError = emailInput.nextElementSibling;
                if (emailError && emailError.classList.contains('error-message')) {
                    emailError.textContent = 'Please enter a valid email address.';
                    emailError.classList.add('active');
                }
            }

            // Basic validation for password (for login/signup)
            if (passwordInput && passwordInput.value.length < 6) {
                isValid = false;
                passwordInput.classList.add('error-input');
                const passwordError = passwordInput.nextElementSibling;
                if (passwordError && passwordError.classList.contains('error-message')) {
                    passwordError.textContent = 'Password must be at least 6 characters.';
                    passwordError.classList.add('active');
                }
            }

            // Specific validation for signup form (e.g., confirm password)
            if (formId === 'signup-form') {
                const confirmPasswordInput = form.querySelector('#confirm-password');
                if (confirmPasswordInput && passwordInput && confirmPasswordInput.value !== passwordInput.value) {
                    isValid = false;
                    confirmPasswordInput.classList.add('error-input');
                    const confirmPasswordError = confirmPasswordInput.nextElementSibling;
                    if (confirmPasswordError && confirmPasswordError.classList.contains('error-message')) {
                        confirmPasswordError.textContent = 'Passwords do not match.';
                        confirmPasswordError.classList.add('active');
                    }
                }
            }

            // Specific validation for contact form (e.g., message content)
            if (formId === 'contact-form') {
                const nameInput = form.querySelector('#contact-name');
                const messageInput = form.querySelector('#contact-message');

                if (nameInput && nameInput.value.trim() === '') {
                    isValid = false;
                    nameInput.classList.add('error-input');
                    const nameError = nameInput.nextElementSibling;
                    if (nameError && nameError.classList.contains('error-message')) {
                        nameError.textContent = 'Name cannot be empty.';
                        nameError.classList.add('active');
                    }
                }
                if (messageInput && messageInput.value.trim().length < 10) {
                    isValid = false;
                    messageInput.classList.add('error-input');
                    const messageError = messageInput.nextElementSibling;
                    if (messageError && messageError.classList.contains('error-message')) {
                        messageError.textContent = 'Message must be at least 10 characters.';
                        messageError.classList.add('active');
                    }
                }
            }


            if (isValid) {
                // Simulate API call
                setTimeout(() => {
                    if (loadingSpinner) {
                        loadingSpinner.classList.remove('active'); // Hide spinner
                    }

                    if (generalMessage) {
                        generalMessage.classList.add('active');
                        if (formId === 'login-form') {
                            // Dummy login logic
                            if (emailInput.value === 'user@example.com' && passwordInput.value === 'password123') {
                                generalMessage.classList.add('general-success-message');
                                generalMessage.textContent = 'Login successful! Redirecting to dashboard...';
                                setTimeout(() => {
                                    window.location.href = 'dashboard.html'; // Redirect to dashboard
                                }, 1500);
                            } else {
                                generalMessage.classList.add('general-error-message');
                                generalMessage.textContent = 'Invalid email or password.';
                            }
                        } else if (formId === 'signup-form') {
                            generalMessage.classList.add('general-success-message');
                            generalMessage.textContent = 'Account created successfully! Redirecting to login...';
                            form.reset(); // Clear form
                            setTimeout(() => {
                                window.location.href = 'login.html'; // Redirect to login
                            }, 1500);
                        } else if (formId === 'contact-form') {
                            generalMessage.classList.add('general-success-message');
                            generalMessage.textContent = 'Message sent successfully! We will get back to you soon.';
                            form.reset(); // Clear form
                        }
                    }
                }, 1000); // Simulate 1 second network delay
            } else {
                if (loadingSpinner) {
                    loadingSpinner.classList.remove('active'); // Hide spinner if validation fails
                }
                if (generalMessage) {
                    generalMessage.classList.add('active', 'general-error-message');
                    generalMessage.textContent = 'Please correct the errors in the form.';
                }
            }
        });
    });

    // --- Logout Functionality (for dashboard, wallet, etc.) ---
    const logoutBtns = document.querySelectorAll('#logout-btn, #logout-btn-mobile');
    logoutBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                // In a real app, you would clear session/token here
                alert('You have been logged out.'); // For demonstration
                window.location.href = 'login.html'; // Redirect to login page
            });
        }
    });

    // --- Wallet Page Specifics (Copy Address) ---
    // This part should be dynamically added to cards generated by JS or Chart.js etc.
    // For now, it's just a placeholder demonstrating the copy function for a general element
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const addressText = event.target.closest('.wallet-address-box').querySelector('.wallet-address').textContent;
            try {
                await navigator.clipboard.writeText(addressText);
                alert('Address copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy address. Please copy manually.');
            }
        });
    });

    // --- Dashboard: Dummy data for charts (will be integrated with Chart.js later) ---
    const portfolioChartCtx = document.getElementById('portfolioChart');
    if (portfolioChartCtx) {
        // This is a placeholder for Chart.js initialization
        // Chart.js library will be added directly in dashboard.html head
        // Example structure for data if using Chart.js
        const portfolioData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Portfolio Value (USD)',
                data: [10000, 10500, 11000, 10800, 11500, 11200, 12000],
                borderColor: '#00FF66',
                tension: 0.4,
                fill: false
            }]
        };

        // new Chart(portfolioChartCtx, { type: 'line', data: portfolioData }); // This line needs Chart.js
    }

    const assetDistributionChartCtx = document.getElementById('assetDistributionChart');
    if (assetDistributionChartCtx) {
        // This is a placeholder for Chart.js initialization
        // Example structure for data if using Chart.js
        const assetDistributionData = {
            labels: ['BTC', 'ETH', 'SOL', 'USDT', 'Other'],
            datasets: [{
                data: [30, 25, 15, 20, 10],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)', // Red
                    'rgba(54, 162, 235, 0.7)', // Blue
                    'rgba(255, 206, 86, 0.7)', // Yellow
                    'rgba(75, 192, 192, 0.7)', // Green
                    'rgba(153, 102, 255, 0.7)' // Purple
                ]
            }]
        };

        // new Chart(assetDistributionChartCtx, { type: 'pie', data: assetDistributionData }); // This line needs Chart.js
    }

});
