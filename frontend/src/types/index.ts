export interface TeamMember {
  name: string;
  role: string;
}

export interface Project {
  ticker: string;
  name: string;
  university: string;
  area: string;
  description: string;
  totalSupply: number;
  availableTokens: number;
  currentPrice: number;
  change24h: number;
  volume: number;
  team: TeamMember[];
}

export interface PricePoint {
  timestamp: string;
  price: number;
}

export interface PortfolioPoint {
  timestamp: string;
  value: number;
}

export interface Transaction {
  hash: string;
  type: 'buy' | 'deposit';
  ticker?: string;
  projectName?: string;
  amount: number;
  value: number;
  timestamp: string;
}

export interface Asset {
  ticker: string;
  projectName: string;
  tokensOwned: number;
  currentValue: number;
  change24h: number;
  priceHistory: number[];
}

export interface WalletData {
  availableBalance: number;
  totalInvested: number;
  assets: Asset[];
}

export type Period = '1D' | '1S' | '1M' | '3M' | '1A' | 'Tudo';

export type Area = 'Todas' | 'Tecnologia' | 'Saúde' | 'Engenharia' | 'Humanas' | 'Ciências';

export type SortBy = 'volume' | 'recent' | 'change';
