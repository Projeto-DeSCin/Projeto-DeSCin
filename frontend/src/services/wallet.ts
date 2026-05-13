import type { WalletData, PortfolioPoint } from '../types';
import api from './api';

export const walletService = {
  async getWallet(): Promise<WalletData> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return { availableBalance: 0, totalInvested: 0, totalValue: 0, assets: [] };
      const res = await api.get('/wallets/');
      const data = res.data?.data?.[0];
      if (!data) return { availableBalance: 0, totalInvested: 0, totalValue: 0, assets: [] };
      return {
        availableBalance: data.balance_usd ?? 0,
        totalInvested: 0,
        totalValue: data.balance_usd ?? 0,
        assets: [],
      };
    } catch {
      return { availableBalance: 0, totalInvested: 0, totalValue: 0, assets: [] };
    }
  },

  async getPortfolioHistory(): Promise<PortfolioPoint[]> {
    return [];
  },
};
