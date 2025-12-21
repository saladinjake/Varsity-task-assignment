import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from '../useStore';

describe('useStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useStore.setState({ user: null, isAuthenticated: false });
  });

  process.env.NODE_ENV = 'test';

  it('initializes with null user', () => {
    const state = useStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('sets user and updates localStorage', () => {
    const user = { id: 1, name: 'Test User', email: 'test@example.com', role: 'student' as const };
    const token = 'test-token';
    
    useStore.getState().setUser(user, token);
    
    const state = useStore.getState();
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(localStorage.getItem('varsity_user')).toBe(JSON.stringify(user));
    expect(localStorage.getItem('varsity_token')).toBe(token);
  });

  it('clears user on logout', () => {
    const user = { id: 1, name: 'Test User', email: 'test@example.com', role: 'student' as const };
    const token = 'test-token';
    useStore.getState().setUser(user, token);
    
    useStore.getState().logout();
    
    const state = useStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorage.getItem('varsity_user')).toBeNull();
    expect(localStorage.getItem('varsity_token')).toBeNull();
  });
});
