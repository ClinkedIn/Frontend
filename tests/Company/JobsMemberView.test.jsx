import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CompanyJobsPage from '../../src/components/CompanyPageSections/Jobs';
import * as reactRouterDom from 'react-router-dom';
import axios from 'axios';

// Mock the outlet context
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useOutletContext: vi.fn(),
  };
});

// Mock axios
vi.mock('axios');

describe('CompanyJobsPage', () => {
  const fakeCompany = { id: 'company123' };
  const fakeUser = { _id: 'user456' };

  const fakeJobs = [
    {
      _id: 'job1',
      title: 'Frontend Developer',
      location: 'Remote',
      employmentType: 'Full-time',
      createdAt: new Date().toISOString(),
      description: 'Build UI components',
      applicants: [],
      rejected: [],
      accepted: [],
      skills: ['React', 'CSS'],
    },
  ];

  beforeEach(() => {
    // Set up mocks
    reactRouterDom.useOutletContext.mockReturnValue({ companyInfo: fakeCompany });

    axios.get.mockImplementation((url) => {
      if (url.includes('/user/me')) {
        return Promise.resolve({ data: { user: fakeUser } });
      }
      if (url.includes(`/jobs/company/${fakeCompany.id}`)) {
        return Promise.resolve({ data: fakeJobs });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
  });

  it('renders loading state initially', async () => {
    render(<CompanyJobsPage />);
    expect(screen.getByText(/Loading Jobs.../i)).toBeInTheDocument();
  });

  it('renders job listings after fetching', async () => {
    render(<CompanyJobsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Frontend Developer/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Remote/i)).toBeInTheDocument();
    expect(screen.getByText(/Apply Now/i)).toBeInTheDocument();
  });

  it('shows message when no jobs are available', async () => {
    axios.get.mockImplementationOnce((url) => {
      if (url.includes('/user/me')) {
        return Promise.resolve({ data: { user: fakeUser } });
      }
      if (url.includes(`/jobs/company/${fakeCompany.id}`)) {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    render(<CompanyJobsPage />);

    await waitFor(() => {
      expect(screen.getByText(/No Jobs Available For You/i)).toBeInTheDocument();
    });
  });
});
