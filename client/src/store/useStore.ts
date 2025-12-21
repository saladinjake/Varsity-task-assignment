import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
  is_verified?: number;
}

interface VarsityState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null, token?: string) => void;
  logout: () => void;
}

const savedUser = localStorage.getItem('varsity_user');
const initialUser = savedUser ? JSON.parse(savedUser) : null;

export const useStore = create<VarsityState>((set) => ({
  user: initialUser,
  isAuthenticated: !!initialUser,
  setUser: (user, token) => {
    if (user) {
      localStorage.setItem('varsity_user', JSON.stringify(user));
      if (token) localStorage.setItem('varsity_token', token);
    } else {
      localStorage.removeItem('varsity_user');
      localStorage.removeItem('varsity_token');
    }
    set({ user, isAuthenticated: !!user });
  },
  logout: () => {
    localStorage.removeItem('varsity_user');
    localStorage.removeItem('varsity_token');
    set({ user: null, isAuthenticated: false });
  },
}));
