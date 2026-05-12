import type { Area, Period, SortBy } from '../types';

export const AREAS: Area[] = ['Todas', 'Tecnologia', 'Saúde', 'Engenharia', 'Humanas', 'Ciências', 'Sustentabilidade'];

export const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'volume', label: 'Volume' },
  { value: 'recent', label: 'Mais recentes' },
  { value: 'change', label: 'Valorização' },
];

export const PERIODS: Period[] = ['1D', '7D', '1M', '3M', '1A', 'Tudo'];
export const PROJECT_PERIODS = PERIODS;

export const QUICK_DEPOSIT_VALUES = [50, 100, 250, 500];

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5173/';

export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';
