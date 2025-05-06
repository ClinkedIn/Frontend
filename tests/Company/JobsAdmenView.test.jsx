import { render, screen, waitFor, act } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import axios from 'axios';
import { useOutletContext, useNavigate } from 'react-router-dom';
import CompanyManageJobsPage from '../../src/components/CompanyPageSections/ManageJobs';
import { FaSpinner } from 'react-icons/fa';

// Mock react-router-dom hooks
vi.mock('react-router-dom', () => ({
  useOutletContext: vi.fn(),
  useNavigate: vi.fn(),
}));

// Mock axios
vi.mock('axios');

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaPlus: () => <div>FaPlus</div>,
  FaBriefcase: () => <div>FaBriefcase</div>,
  FaSpinner: () => <div>FaSpinner</div>,
}));

vi.mock('react-icons/md', () => ({
  MdWork: () => <div>MdWork</div>,
  MdLocationOn: () => <div>MdLocationOn</div>,
  MdAccessTime: () => <div>MdAccessTime</div>,
}));

describe('CompanyManageJobsPage', () => {
  const mockCompanyInfo = {
    id: '123',
    name: 'Test Company',
  };

  const mockJobs = [
    {
      _id: '1',
      title: 'Frontend Developer',
      description: 'We are looking for a skilled frontend developer',
      employmentType: 'Full-time',
      location: 'Remote',
      createdAt: '2023-01-01T00:00:00.000Z',
      skills: ['React', 'JavaScript', 'CSS', 'HTML'],
    },
    {
      _id: '2',
      title: 'Backend Developer',
      description: 'We need an experienced backend engineer',
      employmentType: 'Contract',
      location: 'New York',
      createdAt: '2023-01-15T00:00:00.000Z',
      skills: ['Node.js', 'Python', 'AWS'],
    },
  ];

  const mockUser = {
    id: 'user123',
    name: 'Test User',
  };

  const mockNavigate = vi.fn();

  beforeEach(() => {
    useOutletContext.mockReturnValue({ companyInfo: mockCompanyInfo });
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading spinner initially', async () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<CompanyManageJobsPage />);
    expect(screen.getByText('FaSpinner')).toBeInTheDocument();
    expect(screen.getByText('Loading Jobs...')).toBeInTheDocument();
  });

  test('displays empty state when no jobs are found', async () => {
    axios.get.mockResolvedValueOnce({ data: [] }); // Empty jobs array
    render(<CompanyManageJobsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('No Jobs Posted Yet')).toBeInTheDocument();
      expect(screen.getByText('MdWork')).toBeInTheDocument();
    });
  });

  test('fetches and displays job listings', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/jobs/company')) {
        return Promise.resolve({ data: mockJobs });
      }
      if (url.includes('/user/me')) {
        return Promise.resolve({ data: { user: mockUser } });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    render(<CompanyManageJobsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Manage Jobs')).toBeInTheDocument();
      expect(screen.getByText('2 jobs posted')).toBeInTheDocument();
      
      // Verify job listings are rendered
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
      expect(screen.getByText('Backend Developer')).toBeInTheDocument();
      
      // Verify job details
      expect(screen.getByText('We are looking for a skilled frontend developer')).toBeInTheDocument();
      expect(screen.getByText('Full-time')).toBeInTheDocument();
      expect(screen.getByText('Remote')).toBeInTheDocument();
      
      // Verify skills
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('+1 more')).toBeInTheDocument(); // For the first job
    });
  });

  test('handles job navigation correctly', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/jobs/company')) {
        return Promise.resolve({ data: mockJobs });
      }
      if (url.includes('/user/me')) {
        return Promise.resolve({ data: { user: mockUser } });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    render(<CompanyManageJobsPage />);
    
    await waitFor(() => {
      const manageButtons = screen.getAllByText('Manage Job');
      fireEvent.click(manageButtons[0]);
      
      expect(mockNavigate).toHaveBeenCalledWith('/jobdetails', {
        state: {
          job: mockJobs[0],
          user: mockUser,
        },
      });
    });
  });

  test('handles API errors gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch jobs'));
    
    render(<CompanyManageJobsPage />);
    
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Error fetching jobs:', expect.any(Error));
      expect(screen.queryByText('Manage Jobs')).not.toBeInTheDocument();
    });
    
    consoleError.mockRestore();
  });

  test('displays correct date format', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/jobs/company')) {
        return Promise.resolve({ data: mockJobs });
      }
      if (url.includes('/user/me')) {
        return Promise.resolve({ data: { user: mockUser } });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    render(<CompanyManageJobsPage />);
    
    await waitFor(() => {
      // Format depends on the user's locale, so we test for partial matches
      expect(screen.getByText(/Posted/)).toHaveTextContent(
        expect.stringMatching(/Posted (0?1\/0?1\/2023|January 1, 2023)/)
      );
    });
  });

  test('shows correct number of skills with overflow indicator', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/jobs/company')) {
        return Promise.resolve({ data: mockJobs });
      }
      if (url.includes('/user/me')) {
        return Promise.resolve({ data: { user: mockUser } });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    render(<CompanyManageJobsPage />);
    
    await waitFor(() => {
      // First job has 4 skills, should show 3 + "+1 more"
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('CSS')).toBeInTheDocument();
      expect(screen.getByText('+1 more')).toBeInTheDocument();
      
      // Second job has exactly 3 skills, should show all without overflow
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getByText('AWS')).toBeInTheDocument();
      expect(screen.queryByText('+0 more')).not.toBeInTheDocument();
    });
  });
});