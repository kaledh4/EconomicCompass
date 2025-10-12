import type {
  MetricCardData,
  ChartDataPoint,
  PortfolioAsset,
  NewsArticle,
  I18n,
} from './types';

const FRED_API_KEY = process.env.FRED_API_KEY;
const FMP_API_KEY = process.env.FMP_API_KEY;
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

const fredApiUrl = 'https://api.stlouisfed.org/fred';
const fmpApiUrl = 'https://financialmodelingprep.com/api/v3';
const gnewsApiUrl = 'https://gnews.io/api/v4';

async function fetchFredSeries(seriesId: string, limit = 1) {
  if (!FRED_API_KEY || FRED_API_KEY === 'PASTE_YOUR_FRED_API_KEY_HERE')
    return null;
  const url = `${fredApiUrl}/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=${limit}`;
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error('Failed to fetch FRED data');
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
    const response = await fetch(url, { next: { revalidate: 60 } });
     if (!response.ok) throw new Error('Failed to fetch FMP quote');
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error(`Failed to fetch FMP quote for ${ticker}:`, error);
    return null;
  }
}

async function fetchFmpHistorical(ticker: string, days = 365) {
  if (!FMP_API_KEY || FMP_API_KEY === 'PASTE_YOUR_FMP_API_KEY_HERE')
    return null;
  const url = `${fmpApiUrl}/historical-price-full/${ticker}?timeseries=${days}&apikey=${FMP_API_KEY}`;
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error('Failed to fetch FMP historical data');
    const data = await response.json();
    return data.historical;
  } catch (error) {
    console.error(`Failed to fetch FMP historical for ${ticker}:`, error);
    return null;
  }
}

async function fetchGNews() {
  if (!GNEWS_API_KEY || GNEWS_API_KEY === 'PASTE_YOUR_GNEWS_API_KEY_HERE') {
    return {
      error: 'GNews API Key not configured.',
      articles: [],
    };
  }
  const url = `${gnewsApiUrl}/top-headlines?category=business&lang=en&q=crypto|forex|economy&max=9&apikey=${GNEWS_API_KEY}`;
  try {
    const response = await fetch(url, { next: { revalidate: 3600 }});
    const data = await response.json();
    if (response.status !== 200) {
      return {
        error: data.errors?.join(', ') || 'An unknown error occurred with GNews.',
        articles: [],
      };
    }
    return { articles: data.articles as NewsArticle[] };
  } catch (error) {
    console.error('Failed to fetch GNews:', error);
    return {
      error: 'Failed to fetch news. Please check your connection.',
      articles: [],
    };
  }
}

// --- Data for Global Macro Dashboard ---
export const getMacroMetrics = (t: I18n): MetricCardData[] => [
  {
    title: t('Macro.fedFundsRate'),
    value: '5.33%',
    change: '+0.08%',
    changeType: 'negative',
    description: t('Macro.fedFundsRateDescription'),
    tooltipText: t('Macro.fedFundsRateTooltip'),
  },
  {
    title: t('Macro.cpi'),
    value: '3.4%',
    change: t('Macro.vsLastMonth', { val: '-0.1%' }),
    changeType: 'positive',
    description: t('Macro.cpiDescription'),
    tooltipText: t('Macro.cpiTooltip'),
  },
  {
    title: t('Macro.m2'),
    value: '$20.8T',
    change: t('Macro.vsLastMonth', { val: '+0.2%' }),
    changeType: 'negative',
    description: t('Macro.m2Description'),
    tooltipText: t('Macro.m2Tooltip'),
  },
  {
    title: t('Macro.recessionProb'),
    value: '45%',
    change: t('Macro.vsLastMonth', { val: '-5%' }),
    changeType: 'positive',
    description: t('Macro.recessionProbDescription'),
    tooltipText: t('Macro.recessionProbTooltip'),
  },
];

export const interestRateHistory: ChartDataPoint[] = Array.from(
  { length: 24 },
  (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (23 - i));
    return {
      date: date.toISOString().split('T')[0],
      'Fed Rate': (
        4.5 +
        Math.sin(i / 6) * 0.5 +
        (Math.random() - 0.5) * 0.2
      ).toFixed(2),
    };
  }
);

export const sp500VsBtcCorrelation: ChartDataPoint[] = Array.from(
  { length: 24 },
  (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (23 - i));
    return {
      date: date.toISOString().split('T')[0],
      correlation: (Math.sin(i / 3) * 0.5 + (Math.random() - 0.5) * 0.2).toFixed(
        3
      ),
    };
  }
);


export const fedDotPlotData: { year: string, rate: number }[] = [
  // Current Year
  { year: '2024', rate: 5.1 }, { year: '2024', rate: 5.1 }, { year: '2024', rate: 4.9 }, { year: '2024', rate: 5.1 },
  { year: '2024', rate: 4.6 }, { year: '2024', rate: 4.6 }, { year: '2024', rate: 5.4 }, { year: '2024', rate: 5.1 },
  { year: '2024', rate: 4.9 }, { year: '2024', rate: 4.9 }, { year: '2024', rate: 4.6 },
  
  // Next Year
  { year: '2025', rate: 4.1 }, { year: '2025', rate: 3.9 }, { year: '2025', rate: 4.4 }, { year: '2025', rate: 4.1 },
  { year: '2025', rate: 3.6 }, { year: '2025', rate: 3.9 }, { year: '2025', rate: 4.6 }, { year: '2025', rate: 4.1 },
  { year: '2025', rate: 3.9 }, { year: '2025', rate: 3.1 }, { year: '2025', rate: 3.4 },

  // Year After Next
  { year: '2026', rate: 3.1 }, { year: '2026', rate: 2.9 }, { year: '2026', rate: 3.4 }, { year: '2026', rate: 3.1 },
  { year: '2026', rate: 2.6 }, { year: '2026', rate: 2.9 }, { year: '2026', rate: 3.6 }, { year: '2026', rate: 3.1 },
  { year: '2026', rate: 2.9 }, { year: '2026', rate: 2.4 }, { year: '2026', rate: 2.1 },
];


// --- Data for Crypto Market Overview ---
export const cryptoMetrics = (t: I18n): MetricCardData[] => [
  {
    title: t('Crypto.btcPrice'),
    value: '$65,432',
    change: t('Crypto.inLast24h', { val: '+2.1%' }),
    changeType: 'positive',
    description: 'BTC/USD',
    tooltipText: t('Crypto.btcPriceTooltip'),
  },
  {
    title: t('Crypto.ethPrice'),
    value: '$3,480',
    change: t('Crypto.inLast24h', { val: '+4.5%' }),
    changeType: 'positive',
    description: 'ETH/USD',
     tooltipText: t('Crypto.ethPriceTooltip'),
  },
  {
    title: t('Crypto.fearAndGreed'),
    value: '72',
    change: t('Crypto.greed'),
    changeType: 'positive',
    description: t('Crypto.marketSentiment'),
    tooltipText: t('Crypto.fearAndGreedTooltip'),
  },
  {
    title: t('Crypto.totalMarketCap'),
    value: '$2.45T',
    change: t('Crypto.inLast24h', { val: '+3.1%' }),
    changeType: 'positive',
    description: t('Crypto.totalMarketCapDescription'),
    tooltipText: t('Crypto.totalMarketCapTooltip'),
  },
  {
    title: t('Crypto.btcDominance'),
    value: '54.2%',
    change: t('Crypto.inLast24h', { val: '+0.5%' }),
    changeType: 'positive',
    description: t('Crypto.btcDominanceDescription'),
    tooltipText: t('Crypto.btcDominanceTooltip'),
  },
  {
    title: t('Crypto.ethBtcRatio'),
    value: '0.0531',
    change: t('Crypto.inLast24h', { val: '-1.2%' }),
    changeType: 'negative',
    description: t('Crypto.ethBtcRatioDescription'),
    tooltipText: t('Crypto.ethBtcRatioTooltip'),
  },
  {
    title: t('Crypto.total2'),
    value: '$1.59T',
    change: t('Crypto.inLast24h', { val: '+2.8%' }),
    changeType: 'positive',
    description: t('Crypto.total2Description'),
    tooltipText: t('Crypto.total2Tooltip'),
  },
  {
    title: t('Crypto.total3'),
    value: '$0.86T',
    change: t('Crypto.inLast24h', { val: '+4.2%' }),
    changeType: 'positive',
    description: t('Crypto.total3Description'),
    tooltipText: t('Crypto.total3Tooltip'),
  },
];

export function getNextHalving() {
  const BLOCKS_PER_HALVING = 210000;
  const LAST_HALVING_BLOCK = 840000;
  const LAST_HALVING_DATE = new Date('2024-04-20T00:09:00Z');
  const AVG_BLOCK_TIME_MS = 10 * 60 * 1000;

  // This is an estimation. For a real app, you'd fetch the current block height.
  // For this app, we'll calculate from the last known halving.
  const estimatedNextHalvingTime =
    LAST_HALVING_DATE.getTime() + BLOCKS_PER_HALVING * AVG_BLOCK_TIME_MS;

  return {
    nextHalvingDate: new Date(estimatedNextHalvingTime),
  };
}

export const btcLogRegression: ChartDataPoint[] = Array.from(
  { length: 150 },
  (_, i) => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 4);
    date.setDate(date.getDate() + i * 10);
    const price =
      Math.exp(0.015 * i + 8 + Math.sin(i / 10) * 0.2) *
      (1 + (Math.random() - 0.5) * 0.2);
    const topBand = price * 1.8;
    const bottomBand = price * 0.5;
    return {
      date: date.toISOString().split('T')[0],
      Price: price,
      'Top Band': topBand,
      'Bottom Band': bottomBand,
    };
  }
);

// --- Data for DCA Simulator ---
export const availableAssets = (t: I18n): PortfolioAsset[] => [
  { ticker: 'BTC-USD', name: t('Assets.btc') },
  { ticker: 'ETH-USD', name: t('Assets.eth') },
  { ticker: 'SOL-USD', name: t('Assets.sol') },
  { ticker: 'DOGE-USD', name: t('Assets.doge') },
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
    portfolioValue =
      totalInvested *
      (1 + Math.sin(i / 10) * 0.2 + (Math.random() - 0.5) * 0.1);
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
export const optimizerAssets = (t: I18n): PortfolioAsset[] => [
  ...availableAssets(t),
  { ticker: 'ADAUSD', name: t('Assets.ada') },
  { ticker: 'AVAXUSD', name: t('Assets.avax') },
];

export const efficientFrontierData: ChartDataPoint[] = Array.from(
  { length: 20 },
  (_, i) => ({
    date: 'Point ' + (i + 1),
    Risk: (0.1 + i * 0.02 + (Math.random() - 0.5) * 0.02).toFixed(3),
    Return: (0.05 + Math.sqrt(i) * 0.05 + (Math.random() - 0.5) * 0.03).toFixed(
      3
    ),
  })
).sort((a, b) => Number(a.Risk) - Number(b.Risk));

// --- News Feed ---
export async function getNewsFeed() {
  const newsData = await fetchGNews();
  return newsData;
}
