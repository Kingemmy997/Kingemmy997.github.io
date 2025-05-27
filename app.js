require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const COINGECKO_BASE_URL = process.env.COINGECKO_API_BASE_URL;

// --- Your Hardcoded Portfolio ---
// Define your holdings here.
// 'id' should match CoinGecko's ID for the cryptocurrency (e.g., 'bitcoin', 'ethereum').
const myPortfolio = [
    { id: 'bitcoin', name: 'Bitcoin', amount: 0.5 }, // 0.5 BTC
    { id: 'ethereum', name: 'Ethereum', amount: 3.2 }, // 3.2 ETH
    { id: 'solana', name: 'Solana', amount: 10 }, // 10 SOL
    { id: 'cardano', name: 'Cardano', amount: 500 }, // 500 ADA
    // Add more cryptocurrencies you own. Make sure the 'id' matches CoinGecko's ID exactly (lowercase).
    // You can find IDs here: https://api.coingecko.com/api/v3/coins/list
];

// --- Set up EJS for templating ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Serve static files (like CSS) ---
app.use(express.static(path.join(__dirname, 'public')));

// --- Helper function to fetch prices ---
async function fetchCryptoPrices(coinIds, vsCurrencies = 'usd') {
    try {
        const response = await axios.get(`${COINGECKO_BASE_URL}/simple/price`, {
            params: {
                ids: coinIds.join(','),
                vs_currencies: vsCurrencies,
                include_24hr_change: 'true',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching crypto prices:', error.message);
        return {}; // Return empty object on error to prevent application crash
    }
}

// --- Main Route ---
app.get('/', async (req, res) => {
    const coinIds = myPortfolio.map(asset => asset.id);
    const prices = await fetchCryptoPrices(coinIds);

    let totalPortfolioValueUSD = 0;
    const portfolioDetails = myPortfolio.map(asset => {
        const priceData = prices[asset.id];
        const currentPrice = priceData ? priceData.usd : 0;
        const valueUSD = asset.amount * currentPrice;
        totalPortfolioValueUSD += valueUSD;
        const change24h = priceData ? priceData.usd_24h_change : 0;

        return {
            ...asset,
            currentPrice: currentPrice.toFixed(2),
            valueUSD: valueUSD.toFixed(2),
            change24h: change24h ? change24h.toFixed(2) : 'N/A', // Handle cases where 24h change might be missing
        };
    });

    res.render('index', {
        portfolioDetails,
        totalPortfolioValueUSD: totalPortfolioValueUSD.toFixed(2),
        lastUpdated: new Date().toLocaleString(),
    });
});

// --- Start the server ---
app.listen(PORT, () => {
    console.log(`Crypto Wealth App running on http://localhost:${PORT}`);
});
