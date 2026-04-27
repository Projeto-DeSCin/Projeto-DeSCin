import type { WalletData, PortfolioPoint } from '../types';
import { USE_MOCKS } from '../constants';
import { MOCK_WALLET, MOCK_PORTFOLIO_HISTORY } from '../mocks/data';
import api from './api';

export const walletService = {
  async getWallet(): Promise<WalletData> {
    if (USE_MOCKS) return MOCK_WALLET;
    const { data } = await api.get<WalletData>('/api/wallet');
    return data;
  },

  async getPortfolioHistory(): Promise<PortfolioPoint[]> {
    if (USE_MOCKS) return MOCK_PORTFOLIO_HISTORY;
    const { data } = await api.get<PortfolioPoint[]>('/api/wallet/portfolio-history');
    return data;
  },
};
