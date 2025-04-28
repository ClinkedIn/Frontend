// ApplyJob.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ApplyJob from '../../components/jobs/ApplyJob';
import axios from 'axios';

vi.mock('axios');

describe('ApplyJob Component', () => {
  const mockJob = {
    _id: '1',
    companyId: { name: 'TechCorp' },
    screeningQuestions: [
      { _id: 'q1', question: 'Why do you want this job?' },
      { _id: 'q2', question: 'Describe a challenging project.' }
    ]
  };

  const mockUser = {
    user: {
      firstName: 'Jane',
      location: 'Cairo',
      profilePicture: 'https://example.com/profile.jpg',
      countryCode:"+20"
    }
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockUser });
  });

  it('renders contact info step with user data', async () => {
    render(<ApplyJob isOpen={true} onClose={vi.fn()} job={mockJob} />);
    
    // Use alternative selectors that don't rely on label associations
    expect(await screen.findByText('Jane')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('Egypt (+20)')).toBeInTheDocument();
  });

  it('goes to screening questions on Next click', async () => {
    const user = userEvent.setup();
    render(<ApplyJob isOpen={true} onClose={vi.fn()} job={mockJob} />);

    // Find button by text content instead of role
    const nextButton = await screen.findByText('Next');
    await user.click(nextButton);

    // Use placeholder text to find inputs
    const inputs = await screen.findAllByPlaceholderText('Your answer');
    expect(inputs.length).toBe(2);
  });


});