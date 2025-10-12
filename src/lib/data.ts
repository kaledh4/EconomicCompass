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
    if (!response.ok) throw new Error(`Failed to fetch FRED data for ${seriesId}`);
    const data = await response.json();
    return data.observations;
  } catch (error) {
    console.error(`Failed to fetch FRED series ${seriesId}:`, error);
    return null;
  }
}

async function fetchFmpQuote(ticker: string | string[]) {
  if (!FMP_API_KEY || FMP_API_KEY === 'PASTE_YOUR_FMP_API_KEY_HERE') return null;
  const tickers = Array.isArray(ticker) ? ticker.join(',') : ticker;
  const url = `${fmpApiUrl}/quote/${tickers}?apikey=${FMP_API_KEY}`;
  try {
    const response = await fetch(url, { next: { revalidate: 60 } });
     if (!response.ok) throw new Error('Failed to fetch FMP quote');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch FMP quote for ${ticker}:`, error);
    return null;
  }
}

async function fetchFmpHistorical(ticker: string, from: string, to: string) {
  if (!FMP_API_KEY || FMP_API_KEY === 'PASTE_YOUR_FMP_API_KEY_HERE')
    return null;
  const url = `${fmpApiUrl}/historical-price-full/${ticker}?from=${from}&to=${to}&apikey=${FMP_API_KEY}`;
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
export async function getMacroMetrics(t: I18n): Promise<MetricCardData[]> {
  const [
    fedFundsData,
    cpiData,
    m2Data,
    recessionData,
  ] = await Promise.all([
    fetchFredSeries('FEDFUNDS', 2),
    fetchFredSeries('CPIAUCSL', 2),
    fetchFredSeries('M2SL', 2),
    fetchFredSeries('T10Y2Y', 2), // Yield curve spread for recession probability
  ]);

  const fedRate = fedFundsData ? parseFloat(fedFundsData[0].value).toFixed(2) + '%' : 'N/A';
  const fedRateChange = fedFundsData ? (parseFloat(fedFundsData[0].value) - parseFloat(fedFundsData[1].value)).toFixed(2) + '%' : 'N/A';

  const cpi = cpiData ? (parseFloat(cpiData[0].value) / parseFloat(cpiData[1].value) - 1) * 100 : null;
  const cpiValue = cpi ? cpi.toFixed(2) + '%' : 'N/A';
  const cpiChange = cpiData ? (parseFloat(cpiData[0].value) - parseFloat(cpiData[1].value)).toFixed(2) : 'N/A'
  
  const m2 = m2Data ? parseFloat(m2Data[0].value) / 1000 : null; // In Trillions
  const m2Value = m2 ? `$${m2.toFixed(2)}T` : 'N/A';
  const m2Change = m2Data ? ((parseFloat(m2Data[0].value) / parseFloat(m2Data[1].value)) - 1) * 100 : null;
  const m2ChangeValue = m2Change ? `${m2Change.toFixed(2)}%` : 'N/A';
  
  const recessionProbValue = recessionData ? (parseFloat(recessionData[0].value) < 0 ? 'High' : 'Low') : 'N/A';
  const recessionProbChange = recessionData ? `${(parseFloat(recessionData[0].value) - parseFloat(recessionData[1].value)).toFixed(2)}` : 'N/A';

  return [
    {
      title: t('Macro.fedFundsRate'),
      value: fedRate,
      change: `${fedRateChange}`,
      changeType: 'negative',
      description: t('Macro.fedFundsRateDescription'),
      tooltipText: t('Macro.fedFundsRateTooltip'),
    },
    {
      title: t('Macro.cpi'),
      value: cpiValue,
      change: t('Macro.vsLastMonth', { val: cpiChange }),
      changeType: cpiChange && parseFloat(cpiChange) > 0 ? 'negative' : 'positive',
      description: t('Macro.cpiDescription'),
      tooltipText: t('Macro.cpiTooltip'),
    },
    {
      title: t('Macro.m2'),
      value: m2Value,
      change: t('Macro.vsLastMonth', { val: m2ChangeValue }),
      changeType: m2Change && m2Change > 0 ? 'negative' : 'positive',
      description: t('Macro.m2Description'),
      tooltipText: t('Macro.m2Tooltip'),
    },
    {
      title: t('Macro.recessionProb'),
      value: recessionProbValue,
      change: t('Macro.vsLastMonth', { val: recessionProbChange }),
      changeType: 'negative',
      description: t('Macro.recessionProbDescription'),
      tooltipText: t('Macro.recessionProbTooltip'),
    },
  ];
};


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
export async function getCryptoMetrics(t: I18n): Promise<MetricCardData[]> {
    const quotes = await fetchFmpQuote(['BTCUSD', 'ETHUSD', 'SOLUSD', 'DOGEUSD']);
    const btcQuote = quotes?.find((q: any) => q.symbol === 'BTCUSD');
    const ethQuote = quotes?.find((q: any) => q.symbol === 'ETHUSD');

    const formatPrice = (price: number) => price < 1 ? `$${price.toFixed(4)}` : `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const metrics: MetricCardData[] = [
      {
        title: t('Crypto.btcPrice'),
        value: btcQuote ? formatPrice(btcQuote.price) : 'N/A',
        change: btcQuote ? `${btcQuote.changesPercentage.toFixed(2)}%` : 'N/A',
        changeType: btcQuote?.changesPercentage > 0 ? 'positive' : 'negative',
        description: 'BTC/USD',
        tooltipText: t('Crypto.btcPriceTooltip'),
      },
      {
        title: t('Crypto.ethPrice'),
        value: ethQuote ? formatPrice(ethQuote.price) : 'N/A',
        change: ethQuote ? `${ethQuote.changesPercentage.toFixed(2)}%` : 'N/A',
        changeType: ethQuote?.changesPercentage > 0 ? 'positive' : 'negative',
        description: 'ETH/USD',
        tooltipText: t('Crypto.ethPriceTooltip'),
      },
      {
        title: t('Crypto.fearAndGreed'),
        value: '72', // This would require another API or a more complex calculation
        change: t('Crypto.greed'),
        changeType: 'positive',
        description: t('Crypto.marketSentiment'),
        tooltipText: t('Crypto.fearAndGreedTooltip'),
      },
      {
        title: t('Crypto.totalMarketCap'),
        value: btcQuote ? `$${(btcQuote.marketCap / 1e12).toFixed(2)}T` : 'N/A', // Simplified
        change: '+3.1%',
        changeType: 'positive',
        description: t('Crypto.totalMarketCapDescription'),
        tooltipText: t('Crypto.totalMarketCapTooltip'),
      },
      {
        title: t('Crypto.btcDominance'),
        value: '54.2%', // Requires total market cap data
        change: '+0.5%',
        changeType: 'positive',
        description: t('Crypto.btcDominanceDescription'),
        tooltipText: t('Crypto.btcDominanceTooltip'),
      },
      {
        title: t('Crypto.ethBtcRatio'),
        value: (btcQuote && ethQuote) ? (ethQuote.price / btcQuote.price).toFixed(4) : 'N/A',
        change: '-1.2%', // Requires historical ratio
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

    return metrics;
}

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
  { ticker: 'BTCUSD', name: t('Assets.btc') },
  { ticker: 'ETHUSD', name: t('Assets.eth') },
  { ticker: 'SOLUSD', name: t('Assets.sol') },
  { ticker: 'DOGEUSD', name: t('Assets.doge') },
];

export async function dcaSimulationResult(asset: string, investment: number, from: string, to: string) {
  const historicalData = await fetchFmpHistorical(asset, from, to);
  if (!historicalData) return null;

  const weeklyData = historicalData.filter((_, i) => i % 7 === 0).reverse();

  const data: ChartDataPoint[] = [];
  let totalInvested = 0;
  let totalCoins = 0;

  for (const record of weeklyData) {
    totalInvested += investment;
    totalCoins += investment / record.close;
    const portfolioValue = totalCoins * record.close;
    data.push({
      date: record.date,
      'Portfolio Value': portfolioValue.toFixed(2),
      'Total Invested': totalInvested.toFixed(2),
    });
  }
  
  if (data.length === 0) return null;

  const finalValue = parseFloat(data[data.length - 1]['Portfolio Value']);
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
