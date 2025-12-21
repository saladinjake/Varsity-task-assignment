import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '../Navbar';
import * as useStoreModule from '../../store/useStore';

vi.mock('../../store/useStore', () => ({
  useStore: vi.fn(),
}));

describe('Navbar', () => {
  it('renders logo and search bar', () => {
    (useStoreModule.useStore as any).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('VARSITY')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search for courses/i)).toBeInTheDocument();
  });

  it('shows login/signup buttons when not authenticated', () => {
    (useStoreModule.useStore as any).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('shows dashboard and logout when authenticated', () => {
    (useStoreModule.useStore as any).mockReturnValue({
      user: { name: 'Test User' },
      isAuthenticated: true,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByTitle('Logout')).toBeInTheDocument();
  });
});
