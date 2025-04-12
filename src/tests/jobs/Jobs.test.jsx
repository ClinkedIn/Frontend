import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Jobs from '../../pages/jobs/Jobs';

// Mock external components and libraries
vi.mock('axios');
vi.mock('../../components/UpperNavBar', () => ({
  default: ({ onSearchChange }) => (
    <div data-testid="header">
      <input 
        type="text" 
        onChange={(e) => onSearchChange(e.target.value)} 
        placeholder="Search..."
      />
    </div>
  )
}));
vi.mock('../../components/ProfileCard', () => ({ default: () => <div>ProfileCard</div> }));
vi.mock('../../components/FooterLinks', () => ({ default: () => <div>FooterLinks</div> }));
vi.mock('../../components/jobs/JobCard', () => ({ default: () => <div>JobCard</div> }));

describe('Jobs Component', () => {
  const mockUser = { name: 'John Doe', title: 'Developer' };
  const mockJobs = [{ id: 1 }, { id: 2 }];

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Mock API responses
    axios.post.mockResolvedValue({ data: { success: true } });
    axios.get.mockImplementation((url) => {
      if (url.includes('/user/me')) return Promise.resolve({ data: mockUser });
      if (url.includes('/jobs')) return Promise.resolve({ data: mockJobs });
      return Promise.reject(new Error('Invalid URL'));
    });
  });


  it('performs login and fetches data on mount', async () => {
    render(<Jobs />);
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3000/user/login',
        {
          email: "Charlie.Kreiger@yahoo.com",
          password: "password123"
        },
        { withCredentials: true }
      );
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/user/me', { withCredentials: true });
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/jobs', {});
    });
  });

  it('displays user profile and jobs after loading', async () => {
    render(<Jobs />);
    
    await waitFor(() => {
      expect(screen.getByText('ProfileCard')).toBeInTheDocument();
      expect(screen.getAllByText('JobCard').length).toBe(mockJobs.length);
    });
  });

  it('handles jobs fetch error', async () => {
    axios.get.mockRejectedValueOnce(new Error('API Error'));
    render(<Jobs />);
    
    await waitFor(() => {
      expect(screen.getByText('No jobs available at the moment.')).toBeInTheDocument();
    });
  });

  it('shows no jobs message when empty array', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<Jobs />);
    
    await waitFor(() => {
      expect(screen.getByText('No jobs available at the moment.')).toBeInTheDocument();
    });
  });

  it('updates search query', async () => {
    render(<Jobs />);
    
    await screen.findAllByText('JobCard');
    const searchInput = screen.getByPlaceholderText('Search...');
    
    await userEvent.type(searchInput, 'developer');
    await waitFor(() => {
      expect(searchInput.value).toBe('developer');
    });
  });
});