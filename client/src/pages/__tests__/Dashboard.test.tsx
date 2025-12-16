import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from '../Dashboard';
import { useStore } from '../../store/useStore';
import * as reactQuery from '@tanstack/react-query';

vi.mock('../../store/useStore', () => ({
  useStore: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = (await importOriginal()) as any;
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => ({ pathname: '/dashboard' }),
    };
});

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to login if not authenticated', async () => {
    vi.mocked(useStore).mockReturnValue({ isAuthenticated: false, user: null });
    
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it('renders student dashboard for student role', async () => {
    vi.mocked(useStore).mockReturnValue({ 
      isAuthenticated: true, 
      user: { name: 'Victor', role: 'student' } 
    });
    
    vi.mocked(reactQuery.useQuery).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Dashboard/i)).toBeInTheDocument();
  });

  it('renders management mode for admin role', async () => {
    vi.mocked(useStore).mockReturnValue({ 
      isAuthenticated: true, 
      user: { name: 'Admin', role: 'admin' } 
    });
    
    vi.mocked(reactQuery.useQuery).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Management Mode/i)).toBeInTheDocument();
  });
});
