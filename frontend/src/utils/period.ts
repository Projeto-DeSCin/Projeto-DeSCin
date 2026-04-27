import type { Period, PricePoint, PortfolioPoint } from '../types';

function daysForPeriod(period: Period): number {
  switch (period) {
    case '1D': return 1;
    case '1S': return 7;
    case '1M': return 30;
    case '3M': return 90;
    case '1A': return 365;
    case 'Tudo': return Infinity;
  }
}

export function filterPriceHistory(history: PricePoint[], period: Period): PricePoint[] {
  const days = daysForPeriod(period);
  if (!isFinite(days)) return history;
  return history.slice(-days - 1);
}

export function filterPortfolioHistory(history: PortfolioPoint[], period: Period): PortfolioPoint[] {
  const days = daysForPeriod(period);
  if (!isFinite(days)) return history;
  return history.slice(-days - 1);
}
