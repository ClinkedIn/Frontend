import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import JobListing from './JobListing';
import { BASE_URL } from '../../constants';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

// Mock the Lucide icons
vi.mock('lucide-react', () => ({
  AlarmClock: () => <div>AlarmClockIcon</div>,
  Archive: () => <div>ArchiveIcon</div>,
  CheckCircle: () => <div>CheckCircleIcon</div>,
  Edit: () => <div>EditIcon</div>,
  EyeOff: () => <div>EyeOffIcon</div>,
  Flag: () => <div>FlagIcon</div>,
  MoreHorizontal: () => <div>MoreHorizontalIcon</div>,
  Search: () => <div>SearchIcon</div>,
  Trash2: () => <div>Trash2Icon</div>,
}));

// Mock API data
const mockJobs = [
  {
    _id: '1',
    title: 'Frontend Developer',
    companyId: { name: 'Tech Corp' },
    jobLocation: 'Remote',
    applicants: ['a1', 'a2'],
    accepted: [],
    rejected: [],
    screeningQuestions: [],
    autoRejectMustHave: false,
    createdAt: '2023-01-01T00:00:00Z',
    workplaceType: 'Remote',
    jobType: 'Full-time',
    industry: 'Technology',
    isActive: true,
  },
  {
    _id: '2',
    title: 'Backend Engineer',
    companyId: { name: 'Dev Solutions' },
    jobLocation: 'New York',
    applicants: ['a1'],
    accepted: ['a1'],
    rejected: [],
    screeningQuestions: [],
    autoRejectMustHave: false,
    createdAt: '2023-01-02T00:00:00Z',
    workplaceType: 'Hybrid',
    jobType: 'Contract',
    industry: 'Finance',
    isActive: true,
  },
  {
    _id: '3',
    title: 'UX Designer',
    companyId: { name: 'Design Co' },
    jobLocation: 'San Francisco',
    applicants: ['a1', 'a2', 'a3'],
    accepted: [],
    rejected: ['a1', 'a2', 'a3'],
    screeningQuestions: [
      { question: 'Do you have experience?', mustHave: true }
    ],
    autoRejectMustHave: true,
    createdAt: '2023-01-03T00:00:00Z',
    workplaceType: 'On-site',
    jobType: 'Part-time',
    industry: 'Design',
    isActive: true,
  },
];

const server = setupServer(
  http.get(`${BASE_URL}/jobs`, () => HttpResponse.json(mockJobs)),
  http.put(`${BASE_URL}/jobs/1/approve`, () => HttpResponse.json({ success: true })),
  http.put(`${BASE_URL}/jobs/1/reject`, () => HttpResponse.json({ success: true })),
  http.put(`${BASE_URL}/jobs/3/resolve-flag`, () => HttpResponse.json({ success: true })),
  http.delete(`${BASE_URL}/jobs/1`, () => HttpResponse.json({ success: true })),
);

describe('JobListing Component', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  

  it('loads and displays jobs correctly', async () => {
    render(<JobListing />);
    
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
      expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
      expect(screen.getByText('UX Designer')).toBeInTheDocument();
    });
  });



  it('filters jobs by search term', async () => {
    render(<JobListing />);
    
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search jobs...');
    
    // Test title search
    fireEvent.change(searchInput, { target: { value: 'frontend' } });
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
      expect(screen.queryByText('Backend Engineer')).not.toBeInTheDocument();
      expect(screen.queryByText('UX Designer')).not.toBeInTheDocument();
    });

    // Test industry search
    fireEvent.change(searchInput, { target: { value: 'design' } });
    await waitFor(() => {
      expect(screen.getByText('UX Designer')).toBeInTheDocument();
      expect(screen.queryByText('Frontend Developer')).not.toBeInTheDocument();
      expect(screen.queryByText('Backend Engineer')).not.toBeInTheDocument();
    });

    // Test empty results
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    await waitFor(() => {
      expect(screen.getByText('No jobs found matching your criteria.')).toBeInTheDocument();
    });
  });

  

  it('shows flagged job with reason', async () => {
    render(<JobListing />);
    
    await waitFor(() => {
      const flaggedJob = screen.getByText('UX Designer');
      expect(flaggedJob).toBeInTheDocument();
      expect(screen.getByText(/Flagged:/i)).toBeInTheDocument();
      expect(screen.getByText(/Must-have screening questions with auto-reject/i)).toBeInTheDocument();
    });
  });

  it('displays "No jobs found" when filters return no results', async () => {
    render(<JobListing />);
    
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search jobs...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent job' } });
    
    await waitFor(() => {
      expect(screen.getByText('No jobs found matching your criteria.')).toBeInTheDocument();
    });
  });
});