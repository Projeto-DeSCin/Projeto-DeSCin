import { create } from 'zustand';
import type { Project, Area, SortBy } from '../types';
import { projectsService } from '../services/projects';

interface ProjectsStore {
  projects: Project[];
  loading: boolean;
  error: string | null;
  filters: { area: Area; university: string; sortBy: SortBy; search: string; };
  fetch: () => Promise<void>;
  setFilter: <K extends keyof ProjectsStore['filters']>(key: K, value: ProjectsStore['filters'][K]) => void;
  getFilteredProjects: () => Project[];
  getPendingProjects: () => Project[];
  getProjectByTicker: (ticker: string) => Project | undefined;
  updateProjectStatus: (ticker: string, status: Project['status']) => void;
}

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: [],
  loading: false,
  error: null,
  filters: { area: 'Todas', university: '', sortBy: 'volume', search: '' },

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const projects = await projectsService.getAll();
      set({ projects, loading: false });
    } catch {
      set({ loading: false, error: 'Falha ao carregar projetos' });
    }
  },

  setFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value } })),

  getFilteredProjects: () => {
    const { projects, filters } = get();
    return projects
      .filter((p) => p.status === 'approved')
      .filter((p) => filters.area === 'Todas' || p.area === filters.area)
      .filter((p) => !filters.university || p.university === filters.university)
      .filter((p) => !filters.search ||
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.ticker.toLowerCase().includes(filters.search.toLowerCase()))
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'volume': return b.volume - a.volume;
          case 'recent': return new Date(b.approvedAt || b.submittedAt).getTime() - new Date(a.approvedAt || a.submittedAt).getTime();
          case 'change': return b.change24h - a.change24h;
          default: return 0;
        }
      });
  },

  getPendingProjects: () => get().projects
    .filter((p) => p.status === 'pending')
    .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()),

  getProjectByTicker: (ticker) => get().projects.find((p) => p.ticker === ticker),

  updateProjectStatus: (ticker, status) => {
    set((s) => ({
      projects: s.projects.map((p) =>
        p.ticker === ticker
          ? { ...p, status, approvedAt: status === 'approved' ? new Date().toISOString() : p.approvedAt }
          : p
      ),
    }));
  },
}));
