import type { MetricCard, ChartDataPoint, PortfolioAsset } from './types';

// Data for Global Macro Dashboard
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
  (_, i) => ({
    date: `2022-${(i % 12) + 1}-01`,
    'Fed Rate': (4.5 + Math.sin(i / 6) * 0.5 + (Math.random() - 0.5) * 0.2).toFixed(2),
  })
);

export const inflationVsBTC: ChartDataPoint[] = Array.from(
  { length: 24 },
  (_, i) => ({
    date: `2022-${(i % 12) + 1}-01`,
    'BTC Return': (Math.random() * 20 - 10).toFixed(2),
    'CPI Rate': (3 + Math.cos(i / 4) * 1.5 + (Math.random() - 0.5) * 0.5).toFixed(2),
  })
);

// Data for Crypto Market Overview
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
    const date = new Date(2020, 0, i * 7);
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


// Data for DCA Simulator
export const availableAssets: PortfolioAsset[] = [
  { ticker: 'BTC-USD', name: 'Bitcoin' },
  { ticker: 'ETH-USD', name: 'Ethereum' },
  { ticker: 'SOL-USD', name: 'Solana' },
  { ticker: 'DOGE-USD', name: 'Dogecoin' },
];

export const dcaSimulationResult = (amount: number) => {
  const data: ChartDataPoint[] = [];
  let totalInvested = 0;
  let portfolioValue = 0;
  for (let i = 0; i < 52; i++) {
    const date = new Date(2023, 0, i * 7);
    totalInvested += amount;
    const randomFactor = 1 + (Math.sin(i / 5) * 0.1 + (Math.random() - 0.5) * 0.05);
    portfolioValue = (portfolioValue + amount) * randomFactor;
    data.push({
      date: date.toISOString().split('T')[0],
      'Portfolio Value': portfolioValue.toFixed(2),
      'Total Invested': totalInvested.toFixed(2),
    });
  }
  return {
    data,
    finalValue: portfolioValue.toFixed(2),
    totalInvested: totalInvested.toFixed(2),
    roi: ((portfolioValue - totalInvested) / totalInvested * 100).toFixed(2),
  }
};

// Data for Portfolio Optimizer
export const optimizerAssets: PortfolioAsset[] = [...availableAssets, {ticker: 'ADA-USD', name: 'Cardano'}, {ticker: 'AVAX-USD', name: 'Avalanche'}];

export const efficientFrontierData: ChartDataPoint[] = Array.from({length: 20}, (_, i) => ({
    date: 'Point ' + (i + 1),
    'Risk': (0.1 + i * 0.02 + (Math.random() - 0.5) * 0.02).toFixed(3),
    'Return': (0.05 + Math.sqrt(i) * 0.05 + (Math.random() - 0.5) * 0.03).toFixed(3),
}))
.sort((a,b) => Number(a.Risk) - Number(b.Risk));
