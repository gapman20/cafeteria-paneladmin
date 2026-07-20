import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SiteProvider } from '../../context/SiteContext';
import { BrowserRouter } from 'react-router-dom';

// Mock the useAuth hook module
const mockLogin = vi.fn(async () => false);
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    login: mockLogin,
    logout: vi.fn(),
    changePassword: vi.fn(),
  }),
}));

// Must import AFTER vi.mock
import Login from '../../pages/Login.jsx';

function renderLogin() {
  return render(
    <BrowserRouter>
      <SiteProvider>
        <Login />
      </SiteProvider>
    </BrowserRouter>
  );
}

describe('Login Page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders the login form', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('Correo electrónico')).toBeDefined();
    expect(screen.getByPlaceholderText('Contraseña')).toBeDefined();
    expect(screen.getByText('Ingresar al Panel')).toBeDefined();
  });

  it('shows error on failed login', async () => {
    mockLogin.mockResolvedValueOnce(false);
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByText('Ingresar al Panel'));

    await waitFor(() => {
      expect(screen.getByText('Credenciales incorrectas')).toBeDefined();
    });
  });

  it('increments attempt counter and disables after 5 failures', async () => {
    mockLogin.mockResolvedValue(false);
    renderLogin();

    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const passInput = screen.getByPlaceholderText('Contraseña');
    const submitBtn = screen.getByText('Ingresar al Panel');

    for (let i = 0; i < 5; i++) {
      fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } });
      fireEvent.change(passInput, { target: { value: `pass${i}` } });
      fireEvent.click(submitBtn);
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledTimes(i + 1);
      });
    }

    // After 5 failures, the button should show lockout state
    await waitFor(() => {
      const lockedElements = screen.getAllByText(/bloqueado/i);
      expect(lockedElements.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('clears error when user types', async () => {
    mockLogin.mockResolvedValueOnce(false);
    renderLogin();

    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const passInput = screen.getByPlaceholderText('Contraseña');

    // Submit with wrong creds
    fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } });
    fireEvent.change(passInput, { target: { value: 'wrong' } });
    fireEvent.click(screen.getByText('Ingresar al Panel'));

    await waitFor(() => {
      expect(screen.getByText('Credenciales incorrectas')).toBeDefined();
    });

    // Type in email clears error
    fireEvent.change(emailInput, { target: { value: 'n' } });
    expect(screen.queryByText('Credenciales incorrectas')).toBeNull();
  });
});
