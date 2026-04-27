import { useState, useEffect } from 'react';
import type { PricePoint, PortfolioPoint, Period } from '../types';
import { projectsService } from '../services/projects';
import { walletService } from '../services/wallet';
import { filterPriceHistory, filterPortfolioHistory } from '../utils/period';

export function usePriceHistory(ticker: string | undefined, period: Period) {
  const [allData, setAllData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticker) return;
    let cancelled = false;
    setLoading(true);
    projectsService
      .getPriceHistory(ticker)
      .then(data => { if (!cancelled) setAllData(data); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [ticker]);

  return { data: filterPriceHistory(allData, period), loading };
}

export function usePortfolioHistory(period: Period) {
  const [allData, setAllData] = useState<PortfolioPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    walletService
      .getPortfolioHistory()
      .then(data => { if (!cancelled) setAllData(data); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { data: filterPortfolioHistory(allData, period), loading };
}
