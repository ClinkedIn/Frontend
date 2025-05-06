import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach} from 'vitest';
import axios from 'axios';
import CompanyAnalyticsPage from '../../src/components/CompanyPageSections/Analytics';
import { useOutletContext } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Mock react-router-dom's useOutletContext
vi.mock('react-router-dom', () => ({
  useOutletContext: vi.fn(),
}));

// Mock axios
vi.mock('axios');

// Mock ChartJS to prevent rendering charts in tests
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
  },
}));

// Mock react-chartjs-2 components
vi.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart" />,
  Bar: () => <div data-testid="bar-chart" />,
}));

// Mock DatePicker
vi.mock('react-datepicker', () => ({
  __esModule: true,
  default: ({ selected, onChange }) => (
    <input
      data-testid="datepicker"
      value={selected?.toISOString()}
      onChange={(e) => onChange(new Date(e.target.value))}
    />
  ),
}));

describe('CompanyAnalyticsPage', () => {
  const mockCompanyInfo = {
    id: '123',
    name: 'Test Company',
  };

  const mockAnalyticsData = {
    summary: {
      totalVisitors: 1000,
      totalFollowers: 500,
      visitorsTrend: 10,
      followersTrend: 5,
    },
    visitors: [
      { date: '2023-01-01', count: 50 },
      { date: '2023-01-02', count: 75 },
    ],
    followers: [
      { date: '2023-01-01', count: 20 },
      { date: '2023-01-02', count: 25 },
    ],
  };

  beforeEach(() => {
    useOutletContext.mockReturnValue({ companyInfo: mockCompanyInfo });
    axios.get.mockResolvedValue({ data: { analytics: mockAnalyticsData } });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  test('renders loading spinner initially', async () => {
    render(<CompanyAnalyticsPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
  });

  test('fetches analytics data on mount', async () => {
    render(<CompanyAnalyticsPage />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining(`/companies/${mockCompanyInfo.id}/analytics`),
        expect.objectContaining({
          params: {
            startDate: expect.any(String),
            endDate: expect.any(String),
            interval: 'day',
          },
        })
      );
    });
  });

  test('displays error message when fetch fails', async () => {
    const errorMessage = 'Failed to fetch analytics';
    axios.get.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });
    
    render(<CompanyAnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  test('refreshes data when retry button is clicked', async () => {
    const errorMessage = 'Failed to fetch analytics';
    axios.get.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });
    
    render(<CompanyAnalyticsPage />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /retry/i }));
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });

  test('displays summary cards with correct data', async () => {
    render(<CompanyAnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Visitors')).toBeInTheDocument();
      expect(screen.getByText('1,000')).toBeInTheDocument();
      expect(screen.getByText('↑ 10%')).toBeInTheDocument();
      
      expect(screen.getByText('Total Followers')).toBeInTheDocument();
      expect(screen.getByText('500')).toBeInTheDocument();
      expect(screen.getByText('↑ 5%')).toBeInTheDocument();
    });
  });

  test('renders charts with correct data', async () => {
    render(<CompanyAnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getAllByTestId('line-chart')).toHaveLength(3);
      expect(screen.getByText('Visitors & Followers Trend')).toBeInTheDocument();
      expect(screen.getByText('Visitor Statistics')).toBeInTheDocument();
      expect(screen.getByText('Follower Statistics')).toBeInTheDocument();
    });
  });

  test('updates data when date range changes', async () => {
    render(<CompanyAnalyticsPage />);
    
    await waitFor(() => {
      const datePickers = screen.getAllByTestId('datepicker');
      fireEvent.change(datePickers[0], { target: { value: new Date('2023-01-01').toISOString() } });
      fireEvent.change(datePickers[1], { target: { value: new Date('2023-01-31').toISOString() } });
      
      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: {
            startDate: expect.stringContaining('2023-01-01'),
            endDate: expect.stringContaining('2023-01-31'),
          },
        })
      );
    });
  });

  test('updates data when interval changes', async () => {
    render(<CompanyAnalyticsPage />);
    
    await waitFor(() => {
      const intervalSelect = screen.getByRole('combobox', { name: '' });
      fireEvent.change(intervalSelect, { target: { value: 'week' } });
      
      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: {
            interval: 'week',
          },
        })
      );
    });
  });

  test('auto-refreshes data when enabled', async () => {
    render(<CompanyAnalyticsPage />);
    
    await waitFor(() => {
      const autoRefreshCheckbox = screen.getByRole('checkbox');
      fireEvent.click(autoRefreshCheckbox);
      
      act(() => {
        vi.advanceTimersByTime(60000); // Advance timers by 60 seconds
      });
      
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });

  test('changes refresh interval', async () => {
    render(<CompanyAnalyticsPage />);
    
    await waitFor(() => {
      const autoRefreshCheckbox = screen.getByRole('checkbox');
      fireEvent.click(autoRefreshCheckbox);
      
      const intervalSelect = screen.getByRole('combobox', { name: '' });
      fireEvent.change(intervalSelect, { target: { value: '300' } });
      
      act(() => {
        vi.advanceTimersByTime(300000); // Advance timers by 5 minutes
      });
      
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });
});