import { describe, it, beforeEach, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import MyJobs from '../../pages/jobs/MyJobs';

// Mocks
vi.mock('axios');

vi.mock('../../components/UpperNavBar', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('../../components/jobs/JobCard', () => ({
  default: () => <div>JobCard</div>,
}));

describe('MyJobs Component', () => {
  const mockUser = { name: 'John Doe', email: 'john@example.com' };
  const mockSavedJobs = {
    jobs: [
      { id: 1, title: 'Frontend Dev' },
      { id: 2, title: 'Backend Dev' },
    ],
  };
  const mockApplications = {
    applications: [{ id: 3, title: 'Fullstack Dev' }],
  };

  const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

  beforeEach(() => {
    vi.clearAllMocks();
    axios.get.mockImplementation((url) => {
      if (url.includes('/user/me')) {
        return Promise.resolve({ data: mockUser });
      }
      if (url.includes('/jobs/saved')) {
        return Promise.resolve({ data: mockSavedJobs });
      }
      if (url.includes('/jobs/my-applications')) {
        return Promise.resolve({ data: mockApplications });
      }
      return Promise.reject(new Error('Invalid URL'));
    });
  });

  it('renders user and displays saved jobs by default', async () => {
    renderWithRouter(<MyJobs />);
    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getAllByText('JobCard')).toHaveLength(2);
    });
  });

  it('fetches and displays jobs based on filter (e.g., Pending)', async () => {
    renderWithRouter(<MyJobs />);
    const pendingButton = await screen.findByText('Pending');
    await userEvent.click(pendingButton);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/jobs/my-applications?status=pending'),
        expect.anything()
      );
      expect(screen.getAllByText('JobCard')).toHaveLength(1); // from mockApplications
    });
  });

  it('switches to "Posted jobs" tab and shows no jobs if none are returned', async () => {
    axios.get.mockImplementationOnce((url) => {
      if (url.includes('/user/me')) return Promise.resolve({ data: mockUser });
      return Promise.resolve({ data: { jobs: [] } });
    });

    renderWithRouter(<MyJobs />);
    const postedTab = screen.getByText('Posted jobs');
    await userEvent.click(postedTab);

    await waitFor(() => {
      expect(screen.getByText('No jobs available at the moment.')).toBeInTheDocument();
    });
  });

  it('handles job fetch error gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch'));
    renderWithRouter(<MyJobs />);

    await waitFor(() => {
      expect(screen.getByText('No jobs available at the moment.')).toBeInTheDocument();
    });
  });
});
