import { create } from 'zustand';
import { authAPI } from '@/lib/api';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; full_name: string; country_code: string }) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async (email, password) => {
    const mockUser = { id: 'dummy-1', email, full_name: 'Dummy User', country_code: 'US', preferences: {} };
    localStorage.setItem('access_token', 'dummy_token');
    localStorage.setItem('refresh_token', 'dummy_refresh');
    set({ user: mockUser as any, isAuthenticated: true, isLoading: false });
    window.location.href = '/dashboard';
  },
  register: async (data) => {
    const mockUser = { id: 'dummy-2', email: data.email, full_name: data.full_name, country_code: data.country_code, preferences: {} };
    localStorage.setItem('access_token', 'dummy_token');
    localStorage.setItem('refresh_token', 'dummy_refresh');
    set({ user: mockUser as any, isAuthenticated: true, isLoading: false });
    window.location.href = '/dashboard';
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, isAuthenticated: false });
    window.location.href = '/login';
  },
  loadUser: async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) { set({ isLoading: false }); return; }
      // Dummy user load if token exists
      const mockUser = { id: '1', email: 'user@finzen.app', full_name: 'FinZen User', country_code: 'GLOBAL', preferences: {} };
      set({ user: mockUser as any, isAuthenticated: true, isLoading: false });
    } catch { set({ isLoading: false }); }
  },
}));
