import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VerifyEmail from '../../pages/signup/VerifyEmail';
import axios from 'axios';


vi.mock('axios');

describe('VerifyEmail', () => {
  it('renders initial state correctly', () => {
    render(<VerifyEmail />);
    
    expect(screen.getByText('Confirm your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('------')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Agree & Confirm' })).toBeInTheDocument();
    expect(screen.getByText(/Your privacy is important/)).toBeInTheDocument();
  });

  it('allows editing email address', async () => {
    render(<VerifyEmail />);
    
    await waitFor(() => {
      expect(screen.getByText(/Send again/)).toBeInTheDocument();
    });

    const editButton = screen.getByText('Edit email');
    await userEvent.click(editButton);
    
    const emailInput = screen.getByLabelText('Edit email');
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'new@example.com');
    
    const saveButton = screen.getByText('Save');
    await userEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('new@example.com')).toBeInTheDocument();
    });
  });

  it("requests OTP successfully", async () => {
    render(<VerifyEmail />);
  
    // Wait until the "Send Again" button appears
    await waitFor(() => expect(screen.getByRole("button", { name: /send again/i })).toBeInTheDocument());
  
    const requestOtpButton = screen.getByRole("button", { name: /send again/i });
    await userEvent.click(requestOtpButton);
  });

  it('verifies OTP successfully', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true, message: 'Verification successful' } });
    render(<VerifyEmail />);
    
    const otpInput = screen.getByTestId('otp-input');
    await userEvent.type(otpInput, '123456');
    
    const verifyButton = screen.getByTestId('verify-button');
    await userEvent.click(verifyButton);
    
    await waitFor(() => {
      expect(screen.getByText('Verification successful')).toBeInTheDocument();
      expect(verifyButton).toHaveTextContent('✅ Confirmed');
    });
  });

  it('handles OTP verification failure', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { message: 'Invalid OTP' } } });
    render(<VerifyEmail />);
    
    const otpInput = screen.getByTestId('otp-input');
    await userEvent.type(otpInput, '000000');
    
    const verifyButton = screen.getByTestId('verify-button');
    await userEvent.click(verifyButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid OTP')).toBeInTheDocument();
    });
  });

  it('disables verify button when verifying', async () => {
    axios.post.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ data: { success: true } }), 1000)));
    render(<VerifyEmail />);
    
    const otpInput = screen.getByTestId('otp-input');
    await userEvent.type(otpInput, '123456');
    
    const verifyButton = screen.getByTestId('verify-button');
    await userEvent.click(verifyButton);
    
    expect(verifyButton).toBeDisabled();
    expect(verifyButton).toHaveTextContent('Verifying...');
  });
  
  it("disables 'Send again' button during cooldown", async () => {
    render(<VerifyEmail />);

    // Ensure the "Wait for cooldown" button is initially disabled
    expect(screen.getByRole("button", { name: /wait for cooldown/i })).toBeDisabled();

    // Wait for cooldown time
    await waitFor(
      () => {
        expect(screen.getByRole("button", { name: /send again/i })).toBeEnabled();
      },
      { timeout: 1000 }
    );
  });

});
