import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Contact from '../../pages/Contact.jsx';
import { SiteProvider } from '../../context/SiteContext';
import { BrowserRouter } from 'react-router-dom';

// Mock LocationMap to avoid leaflet dependency in tests
vi.mock('../../components/LocationMap', () => ({
  default: () => <div data-testid="location-map" />,
}));

function renderContact() {
  return render(
    <BrowserRouter>
      <SiteProvider>
        <Contact />
      </SiteProvider>
    </BrowserRouter>
  );
}

describe('Contact Page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders the contact form', () => {
    renderContact();
    expect(screen.getByPlaceholderText('Ej. Juan Pérez')).toBeDefined();
    expect(screen.getByPlaceholderText('correo@empresa.com')).toBeDefined();
    expect(screen.getByPlaceholderText('Cuéntanos...')).toBeDefined();
    expect(screen.getByText('Enviar Solicitud Inmediata')).toBeDefined();
  });

  it('shows error for invalid email on submit', async () => {
    renderContact();

    fireEvent.change(screen.getByPlaceholderText('Ej. Juan Pérez'), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByPlaceholderText('correo@empresa.com'), { target: { value: 'not-an-email' } });
    fireEvent.change(screen.getByPlaceholderText('Cuéntanos...'), { target: { value: 'Test message that is long enough' } });

    const form = screen.getByText('Enviar Solicitud Inmediata').closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/inválido/i)).toBeDefined();
    });
  });

  it('shows error for short message on submit', async () => {
    renderContact();

    fireEvent.change(screen.getByPlaceholderText('Ej. Juan Pérez'), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByPlaceholderText('correo@empresa.com'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Cuéntanos...'), { target: { value: 'Hi' } });

    const form = screen.getByText('Enviar Solicitud Inmediata').closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/10 caracteres/)).toBeDefined();
    });
  });

  it('shows error for empty name on submit', async () => {
    renderContact();

    fireEvent.change(screen.getByPlaceholderText('correo@empresa.com'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Cuéntanos...'), { target: { value: 'A valid message here' } });

    const form = screen.getByText('Enviar Solicitud Inmediata').closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/obligatorio/)).toBeDefined();
    });
  });

  it('submits successfully with valid data', async () => {
    renderContact();

    fireEvent.change(screen.getByPlaceholderText('Ej. Juan Pérez'), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByPlaceholderText('correo@empresa.com'), { target: { value: 'juan@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Cuéntanos...'), { target: { value: 'A very valid message here' } });

    const form = screen.getByText('Enviar Solicitud Inmediata').closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('¡Mensaje Enviado!')).toBeDefined();
    });
  });
});
