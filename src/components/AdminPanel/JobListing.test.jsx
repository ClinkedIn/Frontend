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

  it('renders loading state initially', async () => {
    render(<JobListing />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('displays error message when API fails', async () => {
    server.use(
      http.get(`${BASE_URL}/jobs`, () => new HttpResponse(null, { status: 500 })),
    );
    render(<JobListing />);
    await waitFor(() => {
      expect(screen.getByText(/Error! Failed to load jobs/i)).toBeInTheDocument();
    });
  });

  it('loads and displays jobs correctly', async () => {
    render(<JobListing />);
    
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
      expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
      expect(screen.getByText('UX Designer')).toBeInTheDocument();
    });
  });

  it('displays correct stats cards', async () => {
    render(<JobListing />);
    
    await waitFor(() => {
      // Test for exact text matches in stats cards
      const activeCard = screen.getByText('Active Jobs').closest('div[class*="bg-white"]');
      expect(within(activeCard).getByText('1')).toBeInTheDocument();
      
      const pendingCard = screen.getByText('Pending Review').closest('div[class*="bg-white"]');
      expect(within(pendingCard).getByText('1')).toBeInTheDocument();
      
      const inactiveCard = screen.getByText('Inactive Jobs').closest('div[class*="bg-white"]');
      expect(within(inactiveCard).getByText('1')).toBeInTheDocument();
      
      const flaggedCard = screen.getByText('Flagged Jobs').closest('div[class*="bg-white"]');
      expect(within(flaggedCard).getByText('1')).toBeInTheDocument();
    });
  });

  it('filters jobs by tab', async () => {
    render(<JobListing />);
    
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    });

    // Test Active tab
    fireEvent.click(screen.getByRole('button', { name: /active/i }));
    await waitFor(() => {
      expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
      expect(screen.queryByText('Frontend Developer')).not.toBeInTheDocument();
      expect(screen.queryByText('UX Designer')).not.toBeInTheDocument();
    });

    // Test Pending tab
    fireEvent.click(screen.getByRole('button', { name: /pending review/i }));
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
      expect(screen.queryByText('Backend Engineer')).not.toBeInTheDocument();
      expect(screen.queryByText('UX Designer')).not.toBeInTheDocument();
    });

    // Test Inactive tab
    fireEvent.click(screen.getByRole('button', { name: /inactive/i }));
    await waitFor(() => {
      expect(screen.getByText('UX Designer')).toBeInTheDocument();
      expect(screen.queryByText('Frontend Developer')).not.toBeInTheDocument();
      expect(screen.queryByText('Backend Engineer')).not.toBeInTheDocument();
    });

    // Test Flagged tab
    fireEvent.click(screen.getByRole('button', { name: /flagged/i }));
    await waitFor(() => {
      expect(screen.getByText('UX Designer')).toBeInTheDocument();
      expect(screen.queryByText('Frontend Developer')).not.toBeInTheDocument();
      expect(screen.queryByText('Backend Engineer')).not.toBeInTheDocument();
    });

    // Test All tab
    fireEvent.click(screen.getByRole('button', { name: /all listings/i }));
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

  it('handles job deletion', async () => {
    render(<JobListing />);
    
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    });

    // Find and click the delete button for the first job
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(screen.queryByText('Frontend Developer')).not.toBeInTheDocument();
      expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
      expect(screen.getByText('UX Designer')).toBeInTheDocument();
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