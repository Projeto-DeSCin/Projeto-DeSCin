import type { Transaction } from '../types';
import { USE_MOCKS } from '../constants';
import { MOCK_TRANSACTIONS } from '../mocks/data';
import api from './api';

interface BuyPayload {
  ticker: string;
  amount: number;
}

interface DepositPayload {
  value: number;
}

export const transactionsService = {
  async getAll(): Promise<Transaction[]> {
    if (USE_MOCKS) return MOCK_TRANSACTIONS;
    const { data } = await api.get<Transaction[]>('/api/wallet/transactions');
    return data;
  },

  async buy(payload: BuyPayload): Promise<Transaction> {
    if (USE_MOCKS) {
      await new Promise(r => setTimeout(r, 1200));
      return {
        hash: `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`,
        type: 'buy',
        ticker: payload.ticker,
        amount: payload.amount,
        value: payload.amount * 5,
        timestamp: new Date().toISOString(),
      };
    }
    const { data } = await api.post<Transaction>('/api/transactions/buy', payload);
    return data;
  },

  async deposit(payload: DepositPayload): Promise<Transaction> {
    if (USE_MOCKS) {
      await new Promise(r => setTimeout(r, 1200));
      return {
        hash: `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`,
        type: 'deposit',
        amount: payload.value,
        value: payload.value,
        timestamp: new Date().toISOString(),
      };
    }
    const { data } = await api.post<Transaction>('/api/transactions/deposit', payload);
    return data;
  },
};
