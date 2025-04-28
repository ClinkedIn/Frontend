import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import JobBoardPage from '../../pages/jobs/JobBoardPage';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(),
}));

vi.mock('axios');
vi.mock('../../components/UpperNavBar', () => ({
  default: () => <div data-testid="header" />
}));

vi.mock('../../components/jobs/JobCard', () => ({
  default: ({ job }) => <div>{job.title}</div>
}));

vi.mock('../../components/jobs/Filter', () => ({
  default: () => <div data-testid="filter" />
}));

vi.mock('../../components/jobs/ApplyJob', () => ({
  default: ({ isOpen }) => isOpen ? <div data-testid="apply-modal" /> : null
}));

const mockJobs = [
  { 
    _id: '1', 
    title: 'Frontend Developer', 
    companyId: { 
      name: 'Tech Corp', 
      logo: '' 
    },
    jobLocation: 'New York',
    jobType: 'Full-time',
    workplaceType: 'On-site',
    description: 'React development position'
  },
  { 
    _id: '2', 
    title: 'Backend Developer', 
    companyId: { 
      name: 'Dev Solutions', 
      logo: '' 
    } 
  },
];

describe('JobBoardPage', () => {
  beforeEach(() => {
    useLocation.mockReturnValue({
      state: null
    });
    axios.post.mockResolvedValue({ data: {} });
  });

  it('renders default state without location data', () => {
    render(<JobBoardPage />);
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('No jobs available at the moment.')).toBeInTheDocument();
    expect(screen.getByText('Select a job to see details')).toBeInTheDocument();
  });

  it('renders jobs from location state', async () => {
    useLocation.mockReturnValue({
      state: {
        jobs: mockJobs,
        currentPath: '/jobs'
      }
    });

    render(<JobBoardPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('filter')).toBeInTheDocument();
      expect(screen.getAllByText(/Developer/)).toHaveLength(2);
    });
  });


  it('opens/closes apply modal', async () => {
    useLocation.mockReturnValue({
      state: {
        jobs: mockJobs,
        selectedJob: mockJobs[0]
      }
    });

    render(<JobBoardPage />);
    
    fireEvent.click(screen.getByText('Easy Apply'));
    expect(screen.getByTestId('apply-modal')).toBeInTheDocument();
  });

  it('handles job save', async () => {
    useLocation.mockReturnValue({
      state: {
        jobs: mockJobs,
        selectedJob: mockJobs[0]
      }
    });

    render(<JobBoardPage />);
    
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/jobs/1/save'),
        {},
        { withCredentials: true }
      );
    });
  });

});