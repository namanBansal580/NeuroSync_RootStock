const API_KEY = "CG-hqMGzd5r3hMZFU7A9EZ1Mkcw";
const BASE_URL = "https://api.coingecko.com/api/v3";





export const fetchCoinData = async (coinId) => {
  const response = await fetch(
    `${BASE_URL}/simple/price?ids=${coinId}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`,
    {
      headers: {
        'x-cg-demo-api-key': API_KEY
      }
    }
  );
  return response.json();
};

export const fetchTradeHistory = async (coinId)=> {
  const response = await fetch(
    `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=1&interval=hourly`,
    {
      headers: {
        'x-cg-demo-api-key': API_KEY
      }
    }
  );
  const data = await response.json();
  return data.prices.map((item) => ({
    time: item[0],
    price: item[1],
    volume: 0 // CoinGecko free API doesn't provide volume in the same endpoint
  }));
};
