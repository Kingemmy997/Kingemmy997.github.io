// --- Utility Functions ---

// Function to safely select an element
const getElement = (selector) => document.querySelector(selector);
const getAllElements = (selector) => document.querySelectorAll(selector);

// Function to show/hide elements for loading states
const show = (element) => element && (element.style.display = 'block');
const hide = (element) => element && (element.style.display = 'none');

// Simulate API call delay
const simulateApiCall = (callback, delay = 800) => {
    return new Promise(resolve => {
        setTimeout(() => {
            callback();
            resolve();
        }, delay);
    });
};

// --- General UI Elements & Interactions ---

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const hamburger = getElement('.hamburger');
    const mobileNavMenu = getElement('.mobile-nav-menu');
    const body = getElement('body');

    if (hamburger && mobileNavMenu && body) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileNavMenu.classList.toggle('open');
            body.classList.toggle('no-scroll'); // Prevent scrolling when menu is open
        });

        // Close mobile menu when a link is clicked
        getAllElements('.mobile-nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileNavMenu.classList.remove('open');
                body.classList.remove('no-scroll');
            });
        });
    }

    // Active Navigation Link Highlighting
    const highlightActiveNav = () => {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        getAllElements('.nav-links a, .mobile-nav-menu a').forEach(link => {
            link.classList.remove('active');
            const linkPath = link.getAttribute('href').split('/').pop();
            if (linkPath === currentPath) {
                link.classList.add('active');
            }
        });
    };
    highlightActiveNav(); // Call on load

    // Smooth scroll for internal links (if any)
    getAllElements('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Hero Section Carousel (Crypto Price Ticker) ---
    const cryptoCarousel = getElement('.crypto-carousel');
    const prevBtn = getElement('.carousel-navigation .prev-btn');
    const nextBtn = getElement('.carousel-navigation .next-btn');
    const indicatorsContainer = getElement('.carousel-indicators');

    if (cryptoCarousel) {
        let scrollAmount = 0;
        const cardWidth = 300; // Approx card width + gap (adjust as needed)
        let autoScrollInterval;

        const updateIndicators = () => {
            indicatorsContainer.innerHTML = ''; // Clear existing indicators
            const numCards = cryptoCarousel.children.length;
            const carouselWidth = cryptoCarousel.offsetWidth;
            const scrollableWidth = cryptoCarousel.scrollWidth - carouselWidth;

            // Calculate approximate number of "pages" or visible sections
            const numPages = Math.ceil(numCards * cardWidth / carouselWidth); // Or a simpler calc

            for (let i = 0; i < numPages; i++) {
                const dot = document.createElement('div');
                dot.classList.add('indicator-dot');
                dot.dataset.index = i;
                if (i * carouselWidth <= cryptoCarousel.scrollLeft + (carouselWidth / 2) &&
                    cryptoCarousel.scrollLeft + (carouselWidth / 2) < (i + 1) * carouselWidth) {
                    dot.classList.add('active');
                }
                indicatorsContainer.appendChild(dot);

                dot.addEventListener('click', () => {
                    cryptoCarousel.scrollLeft = i * carouselWidth;
                    resetAutoScroll();
                });
            }
        };

        const scrollCarousel = (direction) => {
            const scrollStep = cardWidth * 2; // Scroll by 2 cards at a time
            if (direction === 'next') {
                cryptoCarousel.scrollLeft += scrollStep;
            } else {
                cryptoCarousel.scrollLeft -= scrollStep;
            }
            // Loop back if at ends
            if (cryptoCarousel.scrollLeft >= cryptoCarousel.scrollWidth - cryptoCarousel.offsetWidth) {
                cryptoCarousel.scrollLeft = 0;
            } else if (cryptoCarousel.scrollLeft < 0) {
                cryptoCarousel.scrollLeft = cryptoCarousel.scrollWidth - cryptoCarousel.offsetWidth;
            }
            updateIndicators();
        };

        const startAutoScroll = () => {
            autoScrollInterval = setInterval(() => {
                scrollCarousel('next');
            }, 3000); // Scroll every 3 seconds
        };

        const resetAutoScroll = () => {
            clearInterval(autoScrollInterval);
            startAutoScroll();
        };

        prevBtn && prevBtn.addEventListener('click', () => {
            scrollCarousel('prev');
            resetAutoScroll();
        });

        nextBtn && nextBtn.addEventListener('click', () => {
            scrollCarousel('next');
            resetAutoScroll();
        });

        cryptoCarousel.addEventListener('scroll', () => {
            updateIndicators(); // Update indicators on manual scroll
        });

        // Initial setup
        updateIndicators();
        startAutoScroll();

        // Pause auto-scroll on hover
        cryptoCarousel.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
        cryptoCarousel.addEventListener('mouseleave', startAutoScroll);
    }

    // --- FAQ Accordion ---
    getAllElements('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            faqItem.classList.toggle('active');
        });
    });

    // --- Scroll Reveal Animation ---
    const revealElements = getAllElements('.features-section, .insights-section, .pricing-section, .faq-section, .contact-section, .dashboard-section, .learn-section, .wallet-section, .transactions-section, .settings-section');

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    revealElements.forEach(el => scrollObserver.observe(el));

    // --- Client-side Form Validation ---

    // Generic validation function
    const validateForm = (form) => {
        let isValid = true;
        const errorMessages = getAllElements('.error-message');
        errorMessages.forEach(msg => msg.classList.remove('active')); // Clear previous errors
        getAllElements('.error-input').forEach(input => input.classList.remove('error-input')); // Clear previous error styling

        const inputs = form.querySelectorAll('input[required], input[type="email"], input[type="password"], textarea[required]');

        inputs.forEach(input => {
            const parentGroup = input.closest('.form-group');
            if (!parentGroup) return; // Skip if no parent form-group

            const errorDiv = parentGroup.querySelector('.error-message');

            if (input.value.trim() === '') {
                isValid = false;
                input.classList.add('error-input');
                if (errorDiv) {
                    errorDiv.textContent = `${input.previousElementSibling ? input.previousElementSibling.textContent.replace(':', '') : 'This field'} is required.`;
                    errorDiv.classList.add('active');
                }
            } else if (input.type === 'email' && !isValidEmail(input.value.trim())) {
                isValid = false;
                input.classList.add('error-input');
                if (errorDiv) {
                    errorDiv.textContent = 'Please enter a valid email address.';
                    errorDiv.classList.add('active');
                }
            } else if (input.type === 'password') {
                if (input.id === 'password' && input.value.length < 6) { // Minimum password length
                    isValid = false;
                    input.classList.add('error-input');
                    if (errorDiv) {
                        errorDiv.textContent = 'Password must be at least 6 characters.';
                        errorDiv.classList.add('active');
                    }
                } else if (input.id === 'confirm-password') {
                    const passwordInput = getElement('#password');
                    if (passwordInput && input.value !== passwordInput.value) {
                        isValid = false;
                        input.classList.add('error-input');
                        if (errorDiv) {
                            errorDiv.textContent = 'Passwords do not match.';
                            errorDiv.classList.add('active');
                        }
                    }
                }
            }
            // Clear error if valid on re-check
            if (isValid && errorDiv) {
                errorDiv.classList.remove('active');
                input.classList.remove('error-input');
            }
        });

        return isValid;
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Login Form Validation & Demo Login
    const loginForm = getElement('#login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const generalError = getElement('#login-error-message');
            const generalSuccess = getElement('#login-success-message');
            hide(generalError);
            hide(generalSuccess);

            if (!validateForm(loginForm)) {
                show(generalError); // Show general error if specific ones are active
                generalError.textContent = 'Please correct the errors in the form.';
                return;
            }

            const email = getElement('#login-email').value;
            const password = getElement('#login-password').value;
            const loadingSpinner = getElement('#login-spinner');
            show(loadingSpinner);

            await simulateApiCall(() => {
                if (email === 'user@example.com' && password === 'password123') {
                    localStorage.setItem('loggedInUser', 'user@example.com'); // Store session
                    show(generalSuccess);
                    generalSuccess.textContent = 'Login successful! Redirecting...';
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    show(generalError);
                    generalError.textContent = 'Invalid email or password.';
                }
            }, 1500); // Simulate network delay
            hide(loadingSpinner);
        });
    }

    // Signup Form Validation & Demo Signup
    const signupForm = getElement('#signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const generalError = getElement('#signup-error-message');
            const generalSuccess = getElement('#signup-success-message');
            hide(generalError);
            hide(generalSuccess);

            if (!validateForm(signupForm)) {
                show(generalError);
                generalError.textContent = 'Please correct the errors in the form.';
                return;
            }

            const loadingSpinner = getElement('#signup-spinner');
            show(loadingSpinner);

            // Simulate signup success
            await simulateApiCall(() => {
                show(generalSuccess);
                generalSuccess.textContent = 'Account created successfully! Redirecting to login...';
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            }, 1800);
            hide(loadingSpinner);
        });
    }

    // Contact Form Validation & Submission
    const contactForm = getElement('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const generalError = getElement('#contact-error-message');
            const generalSuccess = getElement('#contact-success-message');
            hide(generalError);
            hide(generalSuccess);

            if (!validateForm(contactForm)) {
                show(generalError);
                generalError.textContent = 'Please correct the errors in the form.';
                return;
            }

            const loadingSpinner = getElement('#contact-spinner');
            show(loadingSpinner);

            // Simulate message sending
            await simulateApiCall(() => {
                show(generalSuccess);
                generalSuccess.textContent = 'Your message has been sent successfully!';
                contactForm.reset(); // Clear form on success
            }, 1500);
            hide(loadingSpinner);
        });
    }

    // --- Dashboard Logic (Conditional) ---
    const dashboardSection = getElement('.dashboard-section');
    if (dashboardSection) {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            window.location.href = 'login.html'; // Redirect if not logged in
            return;
        }

        // Display user email (mock)
        const userEmailSpan = getElement('#user-email');
        if (userEmailSpan) {
            userEmailSpan.textContent = loggedInUser;
        }

        // Logout functionality
        const logoutBtn = getElement('#logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('loggedInUser');
                window.location.href = 'index.html'; // Redirect to home or login page
            });
        }

        // Dummy Data for Dashboard Charts & Portfolio
        let dummyPortfolio = {
            totalValueUSD: 50000.00,
            assets: [
                { name: 'Bitcoin', symbol: 'BTC', amount: 0.5, valueUSD: 25000.00, icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
                { name: 'Ethereum', symbol: 'ETH', amount: 7.5, valueUSD: 15000.00, icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
                { name: 'Solana', symbol: 'SOL', amount: 100, valueUSD: 5000.00, icon: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
                { name: 'Ripple', symbol: 'XRP', amount: 5000, valueUSD: 2500.00, icon: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png' },
            ],
            historicalValue: [
                { date: '2023-01-01', value: 30000 },
                { date: '2023-03-01', value: 32000 },
                { date: '2023-05-01', value: 35000 },
                { date: '2023-07-01', value: 38000 },
                { date: '2023-09-01', value: 42000 },
                { date: '2023-11-01', value: 47000 },
                { date: '2024-01-01', value: 50000 }
            ],
            transactions: [
                { id: 'T101', type: 'Buy', asset: 'BTC', amount: 0.1, valueUSD: 5000, date: '2024-05-20 10:30', status: 'Completed' },
                { id: 'T102', type: 'Sell', asset: 'ETH', amount: 1.0, valueUSD: 2000, date: '2024-05-18 14:15', status: 'Completed' },
                { id: 'T103', type: 'Deposit', asset: 'USD', amount: 1000, date: '2024-05-15 09:00', status: 'Completed' },
                { id: 'T104', type: 'Buy', asset: 'SOL', amount: 10, valueUSD: 500, date: '2024-05-12 11:45', status: 'Completed' },
                { id: 'T105', type: 'Withdrawal', asset: 'USD', amount: 500, date: '2024-05-10 16:00', status: 'Pending' },
            ]
        };

        const updateDashboardUI = () => {
            const portfolioValueElem = getElement('#portfolio-total-value');
            if (portfolioValueElem) {
                portfolioValueElem.textContent = `$${dummyPortfolio.totalValueUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }

            const assetListElem = getElement('#asset-list');
            if (assetListElem) {
                assetListElem.innerHTML = '';
                dummyPortfolio.assets.forEach(asset => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div style="display:flex; align-items: center;">
                            <img src="${asset.icon}" alt="${asset.name} icon" style="width:24px; height:24px; margin-right: 8px;">
                            <span class="asset-name">${asset.name} (${asset.symbol})</span>
                        </div>
                        <span class="asset-value">$${asset.valueUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${(asset.valueUSD / dummyPortfolio.totalValueUSD * 100).toFixed(2)}%)</span>
                    `;
                    assetListElem.appendChild(li);
                });
            }

            // Update Transaction Table (for transactions.html and dashboard recent activity)
            const transactionTableBody = getElement('#transaction-table-body');
            const recentActivityList = getElement('#recent-activity-list');

            if (transactionTableBody || recentActivityList) {
                const transactionsToDisplay = transactionTableBody ? dummyPortfolio.transactions : dummyPortfolio.transactions.slice(0, 3); // Limit for dashboard
                const targetList = transactionTableBody || recentActivityList;
                targetList.innerHTML = ''; // Clear existing

                transactionsToDisplay.forEach(tx => {
                    const row = document.createElement('tr');
                    const amountClass = (tx.type === 'Buy' || tx.type === 'Deposit') ? 'positive' : 'negative';
                    const sign = (tx.type === 'Buy' || tx.type === 'Deposit') ? '+' : '-';
                    const amountValue = (tx.type === 'Deposit' || tx.type === 'Withdrawal') ? tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : tx.amount.toFixed(4); // For crypto amounts

                    row.innerHTML = `
                        <td>${tx.id}</td>
                        <td>${tx.type}</td>
                        <td>${tx.asset}</td>
                        <td class="amount ${amountClass}">${sign}$${amountValue}</td>
                        <td>${tx.date}</td>
                        <td><span style="color:${tx.status === 'Completed' ? 'var(--color-green-primary)' : 'var(--color-error)'};">${tx.status}</span></td>
                    `;
                    targetList.appendChild(row);
                });
            }
        };

        // Initialize Chart.js Charts
        const portfolioChartCanvas = getElement('#portfolioValueChart');
        const allocationChartCanvas = getElement('#assetAllocationChart');

        if (portfolioChartCanvas) {
            const portfolioCtx = portfolioChartCanvas.getContext('2d');
            const dates = dummyPortfolio.historicalValue.map(item => item.date);
            const values = dummyPortfolio.historicalValue.map(item => item.value);

            new Chart(portfolioCtx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: 'Portfolio Value (USD)',
                        data: values,
                        borderColor: '#00FF66',
                        backgroundColor: 'rgba(0, 255, 102, 0.2)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'month',
                                tooltipFormat: 'MMM DD, YYYY',
                                displayFormats: {
                                    month: 'MMM YYYY'
                                }
                            },
                            ticks: {
                                color: var('--color-text-dim')
                            },
                            grid: {
                                color: 'rgba(51, 51, 51, 0.5)'
                            }
                        },
                        y: {
                            beginAtZero: false,
                            ticks: {
                                color: var('--color-text-dim'),
                                callback: function(value) {
                                    return `$${value.toLocaleString()}`;
                                }
                            },
                            grid: {
                                color: 'rgba(51, 51, 51, 0.5)'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: var('--color-text-light')
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return ` ${context.dataset.label}: $${context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                }
                            }
                        }
                    }
                }
            });
        }

        if (allocationChartCanvas) {
            const allocationCtx = allocationChartCanvas.getContext('2d');
            const assetLabels = dummyPortfolio.assets.map(asset => asset.symbol);
            const assetValues = dummyPortfolio.assets.map(asset => asset.valueUSD);

            new Chart(allocationCtx, {
                type: 'pie',
                data: {
                    labels: assetLabels,
                    datasets: [{
                        label: 'Asset Allocation',
                        data: assetValues,
                        backgroundColor: [
                            '#00FF66', // Green
                            '#00CC4C', // Darker Green
                            '#009933', // Even Darker Green
                            '#00661A'  // Darkest Green
                        ],
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                color: var('--color-text-light')
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed !== null) {
                                        label += `$${context.parsed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Mock Buy/Sell/Swap functionality
        getAllElements('.portfolio-actions .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.textContent.trim();
                alert(`Simulating ${action} action. In a real app, this would open a transaction modal.`);
            });
        });

        // Initialize dashboard UI on load
        updateDashboardUI();
    }

    // --- Wallet Page Logic ---
    const walletSection = getElement('.wallet-section');
    if (walletSection) {
        // Mock wallet data (can be integrated with dummyPortfolio if needed)
        const dummyWalletBalances = [
            { asset: 'BTC', amount: 0.5, usdValue: 25000, address: 'bc1qxw5j9j2h4d6p8v3t2c1b7a9f0e1d4c2b' },
            { asset: 'ETH', amount: 7.5, usdValue: 15000, address: '0xabc123def456ghi789jkl012mno345pqr678stu' },
            { asset: 'USD', amount: 1200, usdValue: 1200, address: 'N/A' }
        ];

        const updateWalletUI = () => {
            const walletGrid = getElement('#wallet-balances-grid');
            if (walletGrid) {
                walletGrid.innerHTML = '';
                dummyWalletBalances.forEach(wallet => {
                    const walletCard = document.createElement('div');
                    walletCard.classList.add('wallet-card');
                    walletCard.innerHTML = `
                        <h3>${wallet.asset} Wallet</h3>
                        <p class="wallet-balance">$${wallet.usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span>USD</span></p>
                        <p>${wallet.amount.toLocaleString(undefined, { maximumFractionDigits: 8 })} ${wallet.asset}</p>
                        ${wallet.address !== 'N/A' ? `
                            <div class="wallet-address-box">
                                <span class="wallet-address">${wallet.address.substring(0, 10)}...${wallet.address.substring(wallet.address.length - 10)}</span>
                                <button class="copy-btn" data-address="${wallet.address}" title="Copy Address">📋</button>
                            </div>
                        ` : ''}
                        <div class="wallet-actions">
                            <button class="btn btn-secondary">Deposit</button>
                            <button class="btn btn-primary">Withdraw</button>
                        </div>
                    `;
                    walletGrid.appendChild(walletCard);
                });

                // Add event listeners for copy buttons
                getAllElements('.copy-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const address = e.target.dataset.address;
                        navigator.clipboard.writeText(address).then(() => {
                            alert(`Address copied to clipboard: ${address.substring(0, 10)}...`);
                        }).catch(err => {
                            console.error('Failed to copy text: ', err);
                            alert('Failed to copy address.');
                        });
                    });
                });

                // Mock Deposit/Withdrawal actions
                getAllElements('.wallet-actions .btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const action = btn.textContent.trim();
                        alert(`Simulating ${action} action. In a real app, this would open a dedicated form.`);
                    });
                });
            }
        };

        updateWalletUI();
    }
});

// For Chart.js date adaptor
// Make sure to include the script for 'chartjs-adapter-date-fns' or 'luxon'
// e.g., <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.bundle.min.js"></script>
// If not using a CDN, download it and link locally.
