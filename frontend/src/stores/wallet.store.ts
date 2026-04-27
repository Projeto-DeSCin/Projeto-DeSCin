import { create } from 'zustand';
import type { WalletData, Asset } from '../types';
import { walletService } from '../services/wallet';

interface WalletStore extends WalletData {
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  optimisticDeposit: (amount: number) => void;
  optimisticBuy: (ticker: string, projectName: string, tokens: number, value: number) => void;
}

export const useWalletStore = create<WalletStore>(set => ({
  availableBalance: 0,
  totalInvested: 0,
  assets: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const data = await walletService.getWallet();
      set({ ...data, loading: false });
    } catch {
      set({ loading: false, error: 'Falha ao carregar carteira' });
    }
  },

  optimisticDeposit: (amount: number) => {
    set(s => ({ availableBalance: s.availableBalance + amount }));
  },

  optimisticBuy: (ticker: string, projectName: string, tokens: number, value: number) => {
    set(s => {
      const existing = s.assets.find(a => a.ticker === ticker);
      let assets: Asset[];
      if (existing) {
        assets = s.assets.map(a =>
          a.ticker === ticker
            ? { ...a, tokensOwned: a.tokensOwned + tokens, currentValue: a.currentValue + value }
            : a,
        );
      } else {
        assets = [
          ...s.assets,
          {
            ticker,
            projectName,
            tokensOwned: tokens,
            currentValue: value,
            change24h: 0,
            priceHistory: [],
          },
        ];
      }
      return {
        assets,
        availableBalance: s.availableBalance - value,
        totalInvested: s.totalInvested + value,
      };
    });
  },
}));
