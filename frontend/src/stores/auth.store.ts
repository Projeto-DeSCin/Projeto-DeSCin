import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role } from '../types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  hasRole: (role: Role) => boolean;
  activateFounderRole: () => void;
  activateCuratorRole: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },

      hasRole: (role) => {
        const { user } = get();
        return user?.roles.includes(role) ?? false;
      },

      activateFounderRole: () => {
        const { user } = get();
        if (user && !user.roles.includes('founder')) {
          set({ user: { ...user, roles: [...user.roles, 'founder'] } });
        }
      },

      activateCuratorRole: () => {
        const { user } = get();
        if (user && !user.roles.includes('curator')) {
          set({ user: { ...user, roles: [...user.roles, 'curator'] } });
        }
      },
    }),
    {
      name: 'descin-auth',
    }
  )
);
