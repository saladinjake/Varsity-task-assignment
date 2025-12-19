import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Home from '../Home';
import * as reactQuery from '@tanstack/react-query';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('Home Page', () => {
  it('renders hero section', () => {
    (reactQuery.useQuery as any).mockReturnValue({
      data: { courses: [] },
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText(/Unlock Your/i)).toBeInTheDocument();
    expect(screen.getByText(/Academic/i)).toBeInTheDocument();
  });

  it('shows loading state for courses', () => {
    (reactQuery.useQuery as any).mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // There should be skeletons according to the code
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders featured courses when loaded', () => {
    const mockCourses = [
      { id: 1, title: 'Test Course 1', slug: 'test-1', price: 0, category_name: 'Tech', instructor_name: 'John' },
    ];
    (reactQuery.useQuery as any).mockReturnValue({
      data: { courses: mockCourses },
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Course 1')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('FREE')).toBeInTheDocument();
  });
});
