import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom'; // ✅ Import MemoryRouter
import Jobs from '../../pages/jobs/Jobs';
import { BASE_URL } from '../../constants';
import Header from '../../components/UpperNavBar';

// Mock external components and libraries
vi.mock('axios');
vi.mock('../../components/UpperNavBar', () => ({
  default: ({ onSearchChange }) => (
    <div data-testid="header">
      <input 
        type="text" 
        onChange={(e) => handleSearchChange(e.target.value)} 
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
    vi.clearAllMocks();
    
    axios.post.mockResolvedValue({ data: { success: true } });
    axios.get.mockImplementation((url) => {
      if (url.includes('/user/me')) return Promise.resolve({ data: mockUser });
      if (url.includes('/jobs')) return Promise.resolve({ data: mockJobs });
      return Promise.reject(new Error('Invalid URL'));
    });
  });

  const renderWithRouter = (ui) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };



  it('displays user profile and jobs after loading', async () => {
    renderWithRouter(<Jobs />);
    
    await waitFor(() => {
      expect(screen.getByText('ProfileCard')).toBeInTheDocument();
      expect(screen.getAllByText('JobCard').length).toBe(mockJobs.length);
    });
  });

  it('handles jobs fetch error', async () => {
    axios.get.mockRejectedValueOnce(new Error('API Error'));
    renderWithRouter(<Jobs />);
    
    await waitFor(() => {
      expect(screen.getByText('No jobs available at the moment.')).toBeInTheDocument();
    });
  });

  it('shows no jobs message when empty array', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    renderWithRouter(<Jobs />);
    
    await waitFor(() => {
      expect(screen.getByText('No jobs available at the moment.')).toBeInTheDocument();
    });
  });

});
