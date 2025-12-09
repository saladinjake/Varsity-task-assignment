import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from '../Login';
import * as api from '../../services/api';

vi.mock('../../services/api', () => ({
  login: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText('Welcome Back.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const mockData = { user: { id: 1, name: 'Test' }, token: 'abc' };
    (api.login as any).mockResolvedValue(mockData);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password' });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles login failure', async () => {
    (api.login as any).mockRejectedValue({ response: { data: { error: 'Invalid credentials' } } });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
