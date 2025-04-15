import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Filter from '../../components/jobs/Filter';
import { BASE_URL } from '../../constants';

vi.mock('axios');

describe('Filter Component', () => {
  const mockCompanies = [
    { _id: '1', name: 'Tech Corp' },
    { _id: '2', name: 'Dev Solutions' },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    axios.get.mockImplementation((url) => {
      if (url === `${BASE_URL}/companies`) {
        return Promise.resolve({ data: mockCompanies });
      }
      if (url.includes('/search/jobs')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  // Test 1: Verify all controls render
  it('renders all filter controls', async () => {
    render(<Filter />);
    
    // Experience slider
    const experienceInput = screen.getByRole('slider', { name: /Experience:/i });
    expect(experienceInput).toBeInTheDocument();

    // Two comboboxes
    const comboboxes = screen.getAllByRole('combobox');
    expect(comboboxes).toHaveLength(2);

    // Default options
    expect(screen.getByRole('option', { name: 'Company' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Work Type' })).toBeInTheDocument();
  });

  // Test 2: Verify company data loading
  it('fetches companies and populates dropdown', async () => {
    render(<Filter />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/companies`);
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(`${BASE_URL}/search/jobs`));
    });

    const companyOptions = screen.getAllByRole('option', { name: /Tech Corp|Dev Solutions/ });
    expect(companyOptions).toHaveLength(2);
  });

  // Test 3: Experience filter
  it('updates experience filter', async () => {
    render(<Filter />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/companies`);
    });

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '5' } });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('minExperience=5')
      );
    });
  });

  // Test 4: Work type selection
  it('selects work type', async () => {
    render(<Filter />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/companies`);
    });

    const comboboxes = screen.getAllByRole('combobox');
    await userEvent.selectOptions(comboboxes[1], 'Remote');

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('q=Remote')
      );
    });
  });

  // Test 5: Combined filters
  it('combines multiple filters', async () => {
    render(<Filter />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/companies`);
    });

    const comboboxes = screen.getAllByRole('combobox');
    const slider = screen.getByRole('slider');

    fireEvent.change(slider, { target: { value: '8' }});
    await userEvent.selectOptions(comboboxes[0], '2');
    await userEvent.selectOptions(comboboxes[1], 'Hybrid');

    await waitFor(() => {
      const searchCalls = axios.get.mock.calls.filter(call => 
        call[0].includes('/search/jobs')
      );
      const lastCall = searchCalls[searchCalls.length - 1][0];
      
      expect(lastCall).toContain('minExperience=8');
      expect(lastCall).toContain('companyId=2');
      expect(lastCall).toContain('q=Hybrid');
    });
  });
});