import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../../../src/components/auth/LoginForm';
import { authApi } from '../../../src/api/auth';

// Mock auth API
vi.mock('../../../src/api/auth', () => ({
  authApi: {
    login: vi.fn(),
    getGoogleAuthUrl: vi.fn().mockResolvedValue({ configured: false, url: '' }),
  },
}));

describe('LoginForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

  it('renders login form with inputs and submit button', () => {
    renderComponent();

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('displays client-side validation errors when submitted empty', async () => {
    renderComponent();

    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    expect(authApi.login).not.toHaveBeenCalled();
  });

  it('submits credentials and handles server errors gracefully', async () => {
    authApi.login.mockRejectedValueOnce({
      response: {
        data: {
          detail: 'Invalid email or password.',
        },
      },
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'Password123!' },
    });

    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/invalid email or password/i);
    });

    expect(authApi.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Password123!',
    });
  });
});
