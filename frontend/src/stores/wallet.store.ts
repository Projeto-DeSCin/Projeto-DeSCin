import { create } from 'zustand';
import type { WalletData, Asset, Transaction } from '../types';
import { walletService } from '../services/wallet';
import { generateHash } from '../utils/format';
import { useProjectStore } from './project.store';

interface WalletStore extends WalletData {
  loading: boolean;
  error: string | null;
  transactions: Transaction[];
  lastSync: number;
  fetch: () => Promise<void>;
  deposit: (amount: number, method: 'pix' | 'bank') => void;
  withdraw: (amount: number) => void;
  optimisticDeposit: (amount: number) => void;
  optimisticWithdraw: (amount: number) => void;
  optimisticBuy: (ticker: string, projectName: string, tokens: number, value: number, price: number) => void;
  optimisticSell: (ticker: string, tokens: number, value: number) => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  availableBalance: 0,
  totalInvested: 0,
  totalValue: 0,
  assets: [],
  loading: false,
  error: null,
  transactions: [],
  lastSync: Date.now(),

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const data = await walletService.getWallet();
      set({ ...data, loading: false, lastSync: Date.now() });
    } catch {
      set({ loading: false, error: 'Falha ao carregar carteira' });
    }
  },

  deposit: (amount, method) => {
    const tx: Transaction = {
      hash: generateHash(), type: 'deposit', amount, value: amount,
      timestamp: new Date().toISOString(), status: 'confirmed',
      description: `Depósito via ${method === 'pix' ? 'PIX' : 'Transferência bancária'}`, method,
    };
    set(s => ({ availableBalance: s.availableBalance + amount, totalValue: s.totalValue + amount,
      transactions: [tx, ...s.transactions], lastSync: Date.now() }));
  },

  withdraw: (amount) => {
    const s = get();
    if (amount > s.availableBalance) return;
    const tx: Transaction = {
      hash: generateHash(), type: 'withdraw', amount, value: amount,
      timestamp: new Date().toISOString(), status: 'pending', description: 'Saque via PIX', method: 'pix',
    };
    set(state => ({ availableBalance: state.availableBalance - amount, totalValue: state.totalValue - amount,
      transactions: [tx, ...state.transactions], lastSync: Date.now() }));
  },

  optimisticDeposit: (amount) => {
    set(s => ({ availableBalance: s.availableBalance + amount, totalValue: s.totalValue + amount }));
  },

  optimisticWithdraw: (amount) => {
    set(s => ({ availableBalance: s.availableBalance - amount, totalValue: s.totalValue - amount }));
  },

  optimisticBuy: (ticker, projectName, tokens, value, price) => {
    useProjectStore.getState().recordBuy(ticker, tokens, price);
    const tx: Transaction = {
      hash: generateHash(), type: 'buy', ticker, projectName, amount: tokens, value,
      timestamp: new Date().toISOString(), status: 'confirmed',
    };
    set((s) => {
      const existing = s.assets.find((a) => a.ticker === ticker);
      let assets: Asset[];
      if (existing) {
        const totalTokens = existing.tokensOwned + tokens;
        const totalCost = existing.averagePrice * existing.tokensOwned + value;
        const newAvgPrice = totalTokens > 0 ? totalCost / totalTokens : price;
        assets = s.assets.map((a) => a.ticker === ticker
          ? { ...a, tokensOwned: totalTokens, averagePrice: newAvgPrice,
              currentValue: totalTokens * price, pnl: (price - newAvgPrice) * totalTokens,
              pnlPercent: newAvgPrice > 0 ? ((price - newAvgPrice) / newAvgPrice) * 100 : 0 } : a);
      } else {
        assets = [...s.assets, { ticker, projectName, tokensOwned: tokens, averagePrice: price,
          currentValue: value, change24h: 0, pnl: 0, pnlPercent: 0, priceHistory: [] }];
      }
      return { assets, availableBalance: s.availableBalance - value, totalInvested: s.totalInvested + value,
        transactions: [tx, ...s.transactions], lastSync: Date.now() };
    });
  },

  optimisticSell: (ticker, tokens, value) => {
    const price = value > 0 && tokens > 0 ? value / tokens : 0;
    useProjectStore.getState().recordSell(ticker, tokens, price);
    const tx: Transaction = {
      hash: generateHash(), type: 'sell', ticker, amount: tokens, value,
      timestamp: new Date().toISOString(), status: 'confirmed',
    };
    set((s) => {
      const assets = s.assets
        .map((a) => {
          if (a.ticker !== ticker) return a;
          const newTokens = a.tokensOwned - tokens;
          if (newTokens <= 0) return null;
          return { ...a, tokensOwned: newTokens, currentValue: a.currentValue - value };
        })
        .filter((a): a is Asset => a !== null);
      return { assets, availableBalance: s.availableBalance + value,
        totalInvested: Math.max(0, s.totalInvested - value),
        transactions: [tx, ...s.transactions], lastSync: Date.now() };
    });
  },
}));
