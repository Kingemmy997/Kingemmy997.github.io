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

    // --- Real-Time Market Insights (Chart.js Integration) ---
    const chartCanvas = document.getElementById('marketPriceChart');
    const chartStatus = document.getElementById('chartStatus');
    let marketPriceChart; // To hold the Chart.js instance

    // Function to fetch cryptocurrency data (e.g., Bitcoin price over 7 days)
    async function fetchCryptoData(coinId = 'bitcoin', days = 7) {
        chartStatus.textContent = 'Loading market data...';
        chartStatus.style.display = 'block';
        if (chartCanvas) chartCanvas.style.opacity = '0.5';

        try {
            // Using CoinGecko API for historical data (e.g., last 7 days)
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (!data || !data.prices || data.prices.length === 0) {
                throw new Error('No price data received.');
            }

            // Extract labels (dates) and data (prices)
            const prices = data.prices;
            const labels = prices.map(item => {
                const date = new Date(item[0]);
                return date.toLocaleDateString(); // Format date nicely
            });
            const values = prices.map(item => item[1].toFixed(2)); // Price to 2 decimal places

            chartStatus.style.display = 'none'; // Hide status
            if (chartCanvas) chartCanvas.style.opacity = '1';

            return { labels, values };

        } catch (error) {
            console.error('Error fetching crypto data:', error);
            chartStatus.textContent = `Error loading data: ${error.message}. Please try again later.`;
            chartStatus.style.display = 'block';
            if (chartCanvas) chartCanvas.style.opacity = '0.2'; // Dim chart on error
            return null;
        }
    }

    // Function to render/update the chart
    async function renderMarketChart() {
        const chartData = await fetchCryptoData('bitcoin', 30); // Fetch Bitcoin data for last 30 days

        if (!chartData) {
            // Data fetch failed, chartStatus already updated
            if (marketPriceChart) {
                marketPriceChart.destroy(); // Destroy old chart if exists
            }
            return;
        }

        const ctx = chartCanvas.getContext('2d');

        // Destroy existing chart if it exists to prevent multiple instances
        if (marketPriceChart) {
            marketPriceChart.destroy();
        }

        marketPriceChart = new Chart(ctx, {
            type: 'line', // Line chart for price over time
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Bitcoin Price (USD)',
                    data: chartData.values,
                    borderColor: 'rgba(0, 255, 102, 1)', // Vibrant green
                    backgroundColor: 'rgba(0, 255, 102, 0.2)', // Light green fill
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3, // Smooth curves
                    pointRadius: 0, // No points on line
                    pointHoverRadius: 5, // Show point on hover
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Allows flexible sizing based on parent
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: 'var(--color-text-dim)', // Legend text color
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Price: $${context.parsed.y}`;
                            }
                        },
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: 'var(--color-green-primary)',
                        bodyColor: 'var(--color-text-light)',
                        borderColor: 'var(--color-green-primary)',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(51, 51, 51, 0.5)', // Darker grid lines
                            drawBorder: false
                        },
                        ticks: {
                            color: 'var(--color-text-dim)', // X-axis label color
                            autoSkip: true, // Auto-skip labels if too many
                            maxRotation: 0,
                            minRotation: 0
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(51, 51, 51, 0.5)', // Darker grid lines
                            drawBorder: false
                        },
                        ticks: {
                            color: 'var(--color-text-dim)', // Y-axis label color
                            callback: function(value) {
                                return `$${value}`; // Add dollar sign
                            }
                        },
                        beginAtZero: false // Start y-axis from actual min value
                    }
                }
            }
        });
    }

    // Initialize chart on page load
    if (chartCanvas) { // Only try to render if the canvas exists
        renderMarketChart();

        // Optional: Update data periodically for "real-time" feel
        // Be mindful of API rate limits! CoinGecko is usually 100 calls/minute.
        // For production, you'd use WebSockets for true real-time.
        // setInterval(renderMarketChart, 60000); // Update every minute (60,000 ms)
    }

    // --- Simple Smooth Scrolling for Nav Links (Optional) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

});
