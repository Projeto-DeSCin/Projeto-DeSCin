import type { Project, PricePoint } from '../types';
import { USE_MOCKS } from '../constants';
import { MOCK_PROJECTS, MOCK_PRICE_HISTORIES } from '../mocks/data';
import api from './api';

export const projectsService = {
  async getAll(): Promise<Project[]> {
    if (USE_MOCKS) return MOCK_PROJECTS;
    const { data } = await api.get<Project[]>('/api/projects');
    return data;
  },

  async getByTicker(ticker: string): Promise<Project> {
    if (USE_MOCKS) {
      const project = MOCK_PROJECTS.find(p => p.ticker === ticker);
      if (!project) throw new Error(`Projeto ${ticker} não encontrado`);
      return project;
    }
    const { data } = await api.get<Project>(`/api/projects/${encodeURIComponent(ticker)}`);
    return data;
  },

  async getPriceHistory(ticker: string): Promise<PricePoint[]> {
    if (USE_MOCKS) {
      return MOCK_PRICE_HISTORIES[ticker] ?? [];
    }
    const { data } = await api.get<PricePoint[]>(
      `/api/projects/${encodeURIComponent(ticker)}/price-history`,
    );
    return data;
  },
};
