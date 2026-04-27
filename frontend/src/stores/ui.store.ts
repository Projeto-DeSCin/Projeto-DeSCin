import { create } from 'zustand';

interface UiStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUiStore = create<UiStore>(set => ({
  sidebarOpen: false,
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
}));
