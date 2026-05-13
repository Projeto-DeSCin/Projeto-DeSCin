import type { Project, PricePoint } from '../types';
import { adaptProjectFromApi, adaptProjectToApi, type ApiProjectRaw } from '../adapters/projectAdapter';
import api from './api';

export const projectsService = {
  async getAll(): Promise<Project[]> {
    try {
      const res = await api.get('/projects');
      const data: ApiProjectRaw[] = res.data?.data ?? [];
      return data.map(adaptProjectFromApi);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      return [];
    }
  },

  async getById(id: number): Promise<Project> {
    const res = await api.get(`/projects/${id}/`);
    return adaptProjectFromApi(res.data);
  },

  async getPriceHistory(_ticker: string): Promise<PricePoint[]> {
    return [];
  },

  async create(project: Partial<Project>): Promise<Project> {
    const payload = adaptProjectToApi(project);
    const res = await api.post('/projects/', payload);
    return adaptProjectFromApi(res.data);
  },

  async update(id: number, project: Partial<Project>): Promise<Project> {
    const payload = adaptProjectToApi(project);
    const res = await api.put(`/projects/${id}/`, payload);
    return adaptProjectFromApi(res.data);
  },
};
