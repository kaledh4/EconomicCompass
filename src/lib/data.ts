import type { MetricCard, ChartDataPoint, PortfolioAsset } from './types';

const FRED_API_KEY = process.env.FRED_API_KEY;
const FMP_API_KEY = process.env.FMP_API_KEY;

const fredApiUrl = 'https://api.stlouisfed.org/fred';
const fmpApiUrl = 'https://financialmodelingprep.com/api/v3';

async function fetchFredSeries(seriesId: string, limit = 1) {
  if (!FRED_API_KEY || FRED_API_KEY === 'PASTE_YOUR_FRED_API_KEY_HERE') return null;
  const url = `${fredApiUrl}/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=${limit}`;
  try {
    const response = await fetch(url);
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
    const response = await fetch(url);
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
        const response = await fetch(url);
        const data = await response.json();
        return data.historical;
    } catch (error) {
        console.error(`Failed to fetch FMP historical for ${ticker}:`, error);
        return null;
    }
}


// --- Data for Global Macro Dashboard ---
// This is now an async function to fetch live data
export async function getMacroMetrics(): Promise<MetricCard[]> {
    const fedFundsObs = await fetchFredSeries('FEDFUNDS');
    const cpiObs = await fetchFredSeries('CPIAUCSL', 2);
    const m2Obs = await fetchFredSeries('M2SL', 2);
    const recessionProbObs = await fetchFredSeries('RECPROUSM156N', 2);

    const fedFundsRate = fedFundsObs ? parseFloat(fedFundsObs[0].value).toFixed(2) + '%' : 'N/A';
    const fedFundsChange = fedFundsObs && fedFundsObs[1] ? (parseFloat(fedFundsObs[0].value) - parseFloat(fedFundsObs[1].value)).toFixed(2) + '%' : '+0.00%';

    const cpiYoy = cpiObs ? ((parseFloat(cpiObs[0].value) - parseFloat(cpiObs[1].value)) / parseFloat(cpiObs[1].value) * 100).toFixed(2) + '%' : 'N/A';
    
    const m2Value = m2Obs ? (parseFloat(m2Obs[0].value) / 1000).toFixed(1) + 'T' : 'N/A';
    const m2Change = m2Obs && m2Obs[1] ? (((parseFloat(m2Obs[0].value) - parseFloat(m2Obs[1].value)) / parseFloat(m2Obs[1].value)) * 100).toFixed(2) + '%' : '+0.00%';

    const recessionProb = recessionProbObs ? parseFloat(recessionProbObs[0].value).toFixed(1) + '%' : 'N/A';
    const recessionProbChange = recessionProbObs && recessionProbObs[1] ? (parseFloat(recessionProbObs[0].value) - parseFloat(recessionProbObs[1].value)).toFixed(1) + '%' : '+0.00%';


  return [
    {
      title: 'Fed Funds Rate',
      value: fedFundsRate,
      change: fedFundsChange,
      changeType: parseFloat(fedFundsChange) >= 0 ? 'negative' : 'positive',
      description: 'Federal Reserve target rate',
    },
    {
      title: 'CPI Inflation (YoY)',
      value: cpiYoy,
      change: '',
      changeType: 'positive',
      description: 'Consumer Price Index',
    },
    {
      title: 'M2 Money Supply',
      value: m2Value,
      change: m2Change,
      changeType: parseFloat(m2Change) >= 0 ? 'negative' : 'positive',
      description: 'Total liquid assets',
    },
    {
      title: 'Recession Probability',
      value: recessionProb,
      change: recessionProbChange,
      changeType: parseFloat(recessionProbChange) >= 0 ? 'negative' : 'positive',
      description: 'NY Fed recession model',
    },
  ];
}
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
    change: '-0.1%',
    changeType: 'positive',
    description: 'Consumer Price Index',
  },
  {
    title: 'M2 Money Supply',
    value: '$20.8T',
    change: '+0.2%',
    changeType: 'negative',
    description: 'Total liquid assets',
  },
  {
    title: 'Recession Probability',
    value: '45%',
    change: '-5%',
    changeType: 'positive',
    description: 'NY Fed recession model',
  },
];


export const interestRateHistory: ChartDataPoint[] = Array.from(
  { length: 24 },
  (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      date: date.toISOString().split('T')[0],
      'Fed Rate': (4.5 + Math.sin(i / 6) * 0.5 + (Math.random() - 0.5) * 0.2).toFixed(2),
    };
  }
).reverse();

export const inflationVsBTC: ChartDataPoint[] = Array.from(
  { length: 24 },
  (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      date: date.toISOString().split('T')[0],
      'BTC Return': (Math.random() * 20 - 10).toFixed(2),
      'CPI Rate': (3 + Math.cos(i / 4) * 1.5 + (Math.random() - 0.5) * 0.5).toFixed(2),
    };
  }
).reverse();


// --- Data for Crypto Market Overview ---
export async function getCryptoMetrics(): Promise<MetricCard[]> {
    const btcQuote = await fetchFmpQuote('BTCUSD');
    const ethQuote = await fetchFmpQuote('ETHUSD');

    const btcPrice = btcQuote ? '$' + btcQuote.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 'N/A';
    const btcChange = btcQuote ? btcQuote.changesPercentage.toFixed(2) + '%' : '0.00%';
    
    const ethPrice = ethQuote ? '$' + ethQuote.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 'N/A';
    const ethChange = ethQuote ? ethQuote.changesPercentage.toFixed(2) + '%' : '0.00%';
    
    const volume = btcQuote ? '$' + (btcQuote.volume / 1_000_000_000).toFixed(1) + 'B' : 'N/A';

    return [
         {
            title: 'Bitcoin Price',
            value: btcPrice,
            change: `${btcChange > '0' ? '+' : ''}${btcChange}`,
            changeType: btcChange > '0' ? 'positive' : 'negative',
            description: 'BTC/USD',
        },
        {
            title: 'Ethereum Price',
            value: ethPrice,
            change: `${ethChange > '0' ? '+' : ''}${ethChange}`,
            changeType: ethChange > '0' ? 'positive' : 'negative',
            description: 'ETH/USD',
        },
        {
            title: 'BTC Dominance',
            value: '54.2%',
            change: '-0.3%',
            changeType: 'negative',
            description: 'Market cap share',
        },
        {
            title: '24h Volume',
            value: volume,
            change: '+15%', // FMP API does not provide total volume change easily
            changeType: 'positive',
            description: 'Total crypto volume',
        },
    ]
}
export const cryptoMetrics: MetricCard[] = [
  {
    title: 'Bitcoin Price',
    value: '$65,432',
    change: '+2.1%',
    changeType: 'positive',
    description: 'BTC/USD',
  },
  {
    title: 'Ethereum Price',
    value: '$3,480',
    change: '+4.5%',
    changeType: 'positive',
    description: 'ETH/USD',
  },
  {
    title: 'BTC Dominance',
    value: '54.2%',
    change: '-0.3%',
    changeType: 'negative',
    description: 'Market cap share',
  },
  {
    title: '24h Volume',
    value: '$75.6B',
    change: '+15%',
    changeType: 'positive',
    description: 'Total crypto volume',
  },
];

export const btcLogRegression: ChartDataPoint[] = Array.from({ length: 100 }, (_, i) => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 2);
    date.setDate(date.getDate() + i * 7);
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
  { ticker: 'BTCUSD', name: 'Bitcoin' },
  { ticker: 'ETHUSD', name: 'Ethereum' },
  { ticker: 'SOLUSD', name: 'Solana' },
  { ticker: 'DOGEUSD', name: 'Dogecoin' },
];

export async function dcaSimulationResult(asset: string, amount: number) {
    const historicalData = await fetchFmpHistorical(asset, 365);
    if (!historicalData) return null;

    const weeklyData = historicalData.reverse().filter((_, i) => i % 7 === 0);
    
    let totalInvested = 0;
    let totalCoins = 0;
    const chartData: ChartDataPoint[] = [];

    weeklyData.forEach((d, i) => {
        totalInvested += amount;
        totalCoins += amount / d.close;
        const portfolioValue = totalCoins * d.close;

        chartData.push({
            date: d.date,
            'Portfolio Value': portfolioValue.toFixed(2),
            'Total Invested': totalInvested.toFixed(2),
        });
    });

    const finalValue = totalCoins * weeklyData[weeklyData.length - 1].close;

    return {
        data: chartData,
        finalValue: finalValue.toFixed(2),
        totalInvested: totalInvested.toFixed(2),
        roi: ((finalValue - totalInvested) / totalInvested * 100).toFixed(2),
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
