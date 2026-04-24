import { useState, useEffect } from 'react';
import type { Transaction } from '../types';
import { transactionsService } from '../services/transactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    transactionsService
      .getAll()
      .then(data => { if (!cancelled) setTransactions(data); })
      .catch(() => { if (!cancelled) setError('Falha ao carregar transações'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const add = (tx: Transaction) => setTransactions(prev => [tx, ...prev]);

  return { transactions, loading, error, add };
}
