async function searchCrypto() {
    const cryptoName = document.getElementById('searchInput').value.trim();
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    
    resultDiv.innerHTML = '';
    errorDiv.style.display = 'none';
    
    if (!cryptoName) {
        errorDiv.textContent = '⚠️ Masukkan nama cryptocurrency!';
        errorDiv.style.display = 'block';
        return;
    }
    
    loadingDiv.style.display = 'block';
    
    try {
        // CoinGecko API - GRATIS & LENGKAP
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoName.toLowerCase()}&order=market_cap_desc&per_page=1&page=1&sparkline=false`;
        
        console.log('Fetching:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Cryptocurrency tidak ditemukan');
        }
        
        const data = await response.json();
        console.log('Data berhasil:', data);
        
        if (!data || data.length === 0) {
            throw new Error('Cryptocurrency tidak ditemukan. Coba: bitcoin, ethereum, dogecoin');
        }
        
        const crypto = data[0];
        displayCrypto(crypto);
        loadingDiv.style.display = 'none';
        
    } catch (error) {
        console.error('Error:', error);
        loadingDiv.style.display = 'none';
        errorDiv.textContent = '❌ ' + error.message;
        errorDiv.style.display = 'block';
    }
}

function displayCrypto(crypto) {
    const resultDiv = document.getElementById('result');
    
    const name = crypto.name || 'Unknown';
    const symbol = crypto.symbol?.toUpperCase() || 'N/A';
    const currentPrice = crypto.current_price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || 'N/A';
    const marketCap = crypto.market_cap?.toLocaleString('id-ID') || 'Tidak ada data';
    const totalVolume = crypto.total_volume?.toLocaleString('id-ID') || 'Tidak ada data';
    const high24h = crypto.high_24h?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || 'N/A';
    const low24h = crypto.low_24h?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || 'N/A';
    const priceChange24h = crypto.price_change_24h?.toFixed(2) || 0;
    const priceChangePercentage24h = crypto.price_change_percentage_24h?.toFixed(2) || 0;
    const circulatingSupply = crypto.circulating_supply?.toLocaleString('id-ID') || 'Tidak ada data';
    const totalSupply = crypto.total_supply?.toLocaleString('id-ID') || 'Tidak ada data';
    const ath = crypto.ath?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || 'N/A';
    const atl = crypto.atl?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || 'N/A';
    const image = crypto.image || '';
    
    // Tentukan warna untuk perubahan harga
    const changeColor = priceChangePercentage24h >= 0 ? '#10b981' : '#ef4444';
    const changeIcon = priceChangePercentage24h >= 0 ? '📈' : '📉';
    
    resultDiv.innerHTML = `
        <div class="crypto-card">
            <div class="crypto-header">
                <img src="${image}" alt="${name}" onerror="this.src='https://via.placeholder.com/100x100/667eea/ffffff?text=${symbol}'">
                <div>
                    <h2>${name}</h2>
                    <span class="symbol-tag">${symbol}</span>
                </div>
            </div>
            
            <div class="price-section">
                <div class="current-price">${currentPrice}</div>
                <div class="price-change" style="color: ${changeColor}">
                    ${changeIcon} ${priceChangePercentage24h}% ($${priceChange24h})
                </div>
            </div>
            
            <div class="info-grid">
                <div class="info-item">
                    <strong>📊 Market Cap</strong>
                    <span>$${marketCap}</span>
                </div>
                
                <div class="info-item">
                    <strong>📈 Volume 24J</strong>
                    <span>$${totalVolume}</span>
                </div>
                
                <div class="info-item">
                    <strong>⬆️ Tertinggi 24J</strong>
                    <span>${high24h}</span>
                </div>
                
                <div class="info-item">
                    <strong>⬇️ Terendah 24J</strong>
                    <span>${low24h}</span>
                </div>
                
                <div class="info-item">
                    <strong>💰 ATH</strong>
                    <span>${ath}</span>
                </div>
                
                <div class="info-item">
                    <strong>📉 ATL</strong>
                    <span>${atl}</span>
                </div>
                
                <div class="info-item">
                    <strong>💵 Supply Beredar</strong>
                    <span>${circulatingSupply}</span>
                </div>
                
                <div class="info-item">
                    <strong>📦 Total Supply</strong>
                    <span>${totalSupply}</span>
                </div>
            </div>
        </div>
    `;
}

document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchCrypto();
    }
});