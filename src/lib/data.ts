import type { MetricCard, ChartDataPoint, PortfolioAsset } from './types';

const FRED_API_KEY = process.env.FRED_API_KEY;
const FMP_API_KEY = process.env.FMP_API_KEY;

const fredApiUrl = 'https://api.stlouisfed.org/fred';
const fmpApiUrl = 'https://financialmodelingprep.com/api/v3';

async function fetchFredSeries(seriesId: string, limit = 1) {
  if (!FRED_API_KEY || FRED_API_KEY === 'PASTE_YOUR_FRED_API_KEY_HERE') return null;
  const url = `${fredApiUrl}/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=${limit}`;
  try {
    const response = await fetch(url, { cache: 'no-store' });
    const data = await response.json();
    return data.observations;
  } catch (error) {
    console.error(`Failed to fetch FRED series ${seriesId}:`, error);
    return null;
  }
}

async function fetchFmpQuote(ticker: string) {
  if (!FMP_API_KEY || FMP_API_KEY === 'PASTE_YOUR_FMP_API_KEY_HERE') return null;
  const url = `${fmpApiUrl}/quote/${ticker}?apikey=${FMP_API_KEY}`;
  try {
    const response = await fetch(url, { cache: 'no-store' });
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error(`Failed to fetch FMP quote for ${ticker}:`, error);
    return null;
  }
}

async function fetchFmpHistorical(ticker: string, days = 365) {
    if (!FMP_API_KEY || FMP_API_KEY === 'PASTE_YOUR_FMP_API_KEY_HERE') return null;
    const url = `${fmpApiUrl}/historical-price-full/${ticker}?timeseries=${days}&apikey=${FMP_API_KEY}`;
    try {
        const response = await fetch(url, { cache: 'no-store' });
        const data = await response.json();
        return data.historical;
    } catch (error) {
        console.error(`Failed to fetch FMP historical for ${ticker}:`, error);
        return null;
    }
}


// --- Data for Global Macro Dashboard ---
export const macroMetrics: MetricCard[] = [
  {
    title: 'Fed Funds Rate',
    value: '5.33%',
    change: '+0.08%',
    changeType: 'negative',
    description: 'Federal Reserve target rate',
  },
  {
    title: 'CPI Inflation (YoY)',
    value: '3.4%',
    change: '-0.1% vs last month',
    changeType: 'positive',
    description: 'Consumer Price Index',
  },
  {
    title: 'M2 Money Supply',
    value: '$20.8T',
    change: '+0.2% vs last month',
    changeType: 'negative',
    description: 'Total liquid assets',
  },
  {
    title: 'Recession Probability',
    value: '45%',
    change: '-5% vs last month',
    changeType: 'positive',
    description: 'NY Fed recession model',
  },
];


const CURRENT_YEAR = new Date().getFullYear();
export const interestRateHistory: ChartDataPoint[] = Array.from(
  { length: 24 },
  (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (23 - i));
    return {
      date: date.toISOString().split('T')[0],
      'Fed Rate': (4.5 + Math.sin(i / 6) * 0.5 + (Math.random() - 0.5) * 0.2).toFixed(2),
    };
  }
);

export const inflationVsBTC: ChartDataPoint[] = Array.from(
  { length: 24 },
  (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (23 - i));
    return {
      date: date.toISOString().split('T')[0],
      'BTC Return': (Math.random() * 20 - 10).toFixed(2),
      'CPI Rate': (3 + Math.cos(i / 4) * 1.5 + (Math.random() - 0.5) * 0.5).toFixed(2),
    };
  }
);


export const sp500VsBtcCorrelation: ChartDataPoint[] = Array.from({ length: 24 }, (_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() - (23 - i));
  return {
    date: date.toISOString().split('T')[0],
    correlation: (Math.sin(i / 3) * 0.5 + (Math.random() - 0.5) * 0.2).toFixed(3),
  };
});


// --- Data for Crypto Market Overview ---
export const cryptoMetrics: MetricCard[] = [
  {
    title: 'Bitcoin Price',
    value: '$65,432',
    change: '+2.1% in last 24h',
    changeType: 'positive',
    description: 'BTC/USD',
  },
  {
    title: 'Ethereum Price',
    value: '$3,480',
    change: '+4.5% in last 24h',
    changeType: 'positive',
    description: 'ETH/USD',
  },
  {
    title: 'Fear & Greed Index',
    value: '72',
    change: 'Greed',
    changeType: 'positive',
    description: 'Market Sentiment',
  },
  {
    title: 'BTC Dominance',
    value: '54.2%',
    change: '+0.5% in last 24h',
    changeType: 'positive',
    description: 'BTC Market Share',
  },
  {
    title: 'Total Mkt Cap',
    value: '$2.45T',
    change: '+3.1% in last 24h',
    changeType: 'positive',
    description: 'Total Crypto Value',
  },
   {
    title: 'BTC 30D Volatility',
    value: '2.8%',
    change: '+0.1%',
    changeType: 'negative',
    description: 'Price Fluctuation',
  },
];

export function getNextHalving() {
    const BLOCKS_PER_HALVING = 210000;
    const LAST_HALVING_BLOCK = 840000;
    const LAST_HALVING_DATE = new Date('2024-04-20T00:09:00Z');
    const AVG_BLOCK_TIME_MS = 10 * 60 * 1000;

    const blocksUntilNextHalving = BLOCKS_PER_HALVING;
    const msUntilNextHalving = blocksUntilNextHalving * AVG_BLOCK_TIME_MS;
    
    // This is an estimation. For a real app, you'd fetch the current block height.
    // For this app, we'll calculate from the last known halving.
    const estimatedNextHalvingTime = LAST_HALVING_DATE.getTime() + (BLOCKS_PER_HALVING * AVG_BLOCK_TIME_MS);

    return {
        nextHalvingDate: new Date(estimatedNextHalvingTime),
    };
}


export const btcLogRegression: ChartDataPoint[] = Array.from({ length: 150 }, (_, i) => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 4);
    date.setDate(date.getDate() + i * 10);
    const price = Math.exp(0.015 * i + 8 + Math.sin(i / 10) * 0.2) * (1 + (Math.random() - 0.5) * 0.2);
    const topBand = price * 1.8;
    const bottomBand = price * 0.5;
    return {
        date: date.toISOString().split('T')[0],
        'Price': price,
        'Top Band': topBand,
        'Bottom Band': bottomBand,
    };
});


// --- Data for DCA Simulator ---
export const availableAssets: PortfolioAsset[] = [
  { ticker: 'BTC-USD', name: 'Bitcoin' },
  { ticker: 'ETH-USD', name: 'Ethereum' },
  { ticker: 'SOL-USD', name: 'Solana' },
  { ticker: 'DOGE-USD', name: 'Dogecoin' },
];

export const dcaSimulationResult = (investment: number) => {
    const data: ChartDataPoint[] = [];
    let totalInvested = 0;
    let portfolioValue = 0;
    for (let i = 0; i < 52; i++) {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 1);
        date.setDate(date.getDate() + i * 7);
        totalInvested += investment;
        portfolioValue = totalInvested * (1 + Math.sin(i/10) * 0.2 + (Math.random() - 0.5) * 0.1);
        data.push({
            date: date.toISOString().split('T')[0],
            'Portfolio Value': portfolioValue.toFixed(2),
            'Total Invested': totalInvested.toFixed(2),
        });
    }
    const finalValue = portfolioValue;
    const roi = ((finalValue - totalInvested) / totalInvested) * 100;
    return {
        data,
        finalValue: finalValue.toFixed(2),
        totalInvested: totalInvested.toFixed(2),
        roi: roi.toFixed(2),
    };
};

// --- Data for Portfolio Optimizer ---
export const optimizerAssets: PortfolioAsset[] = [...availableAssets, {ticker: 'ADAUSD', name: 'Cardano'}, {ticker: 'AVAXUSD', name: 'Avalanche'}];

export const efficientFrontierData: ChartDataPoint[] = Array.from({length: 20}, (_, i) => ({
    date: 'Point ' + (i + 1),
    'Risk': (0.1 + i * 0.02 + (Math.random() - 0.5) * 0.02).toFixed(3),
    'Return': (0.05 + Math.sqrt(i) * 0.05 + (Math.random() - 0.5) * 0.03).toFixed(3),
}))
.sort((a,b) => Number(a.Risk) - Number(b.Risk));
