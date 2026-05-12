import api from './api';
import type { User } from '../types';

interface AuthResult {
  user: User;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResult | null> {
    try {
      const res = await api.post('/auth/login', { email, password, role: 'investor' });
      const { user, token } = res.data;
      localStorage.setItem('auth_token', token);
      return { user, token };
    } catch {
      return null;
    }
  },

  async register(name: string, email: string, password: string): Promise<AuthResult> {
    const res = await api.post('/users/', { username: name, email, password, roles: ['investor'] });
    const loginResult = await authService.login(email, password);
    if (!loginResult) throw new Error('Erro ao autenticar após cadastro');
    return loginResult;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('auth_token');
    }
  },

  async updateProfile(updates: Partial<User>): Promise<boolean> {
    try {
      await api.put(`/users/${updates.id}`, updates);
      return true;
    } catch {
      return false;
    }
  },
};
