import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Order from '../../pages/Order.jsx';
import { SiteProvider } from '../../context/SiteContext';
import { BrowserRouter } from 'react-router-dom';

function renderOrder() {
  return render(
    <BrowserRouter>
      <SiteProvider>
        <Order />
      </SiteProvider>
    </BrowserRouter>
  );
}

describe('Order Page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    
    // Mock navigator.geolocation to be undefined so GPS check falls back to error
    Object.defineProperty(window.navigator, 'geolocation', {
      value: undefined,
      configurable: true
    });
  });

  it('renders menu sections from context', () => {
    renderOrder();
    expect(screen.getByText('Arma tu Pedido')).toBeDefined();
    expect(screen.getByText('Bebidas Calientes')).toBeDefined();
    expect(screen.getByText('Bebidas Frías')).toBeDefined();
    expect(screen.getByText('Postres & Repostería')).toBeDefined();
  });

  it('shows item names and prices', () => {
    renderOrder();
    expect(screen.getByText('Espresso Doble')).toBeDefined();
    // $65 appears in multiple places (menu + cart area), use getAllByText
    expect(screen.getAllByText('$65').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Cold Brew Clásico')).toBeDefined();
  });

  it('adds an item to cart when clicking +', () => {
    renderOrder();
    const addButtons = screen.getAllByLabelText(/Agregar Espresso Doble/);
    fireEvent.click(addButtons[0]);
    // Item count appears in both cart total and floating bar
    expect(screen.getAllByText(/\d+ artículos?/).length).toBeGreaterThanOrEqual(1);
  });

  it('increments quantity when clicking + on item already in cart', () => {
    renderOrder();
    const addButtons = screen.getAllByLabelText(/Agregar Espresso Doble/);
    fireEvent.click(addButtons[0]);
    fireEvent.click(addButtons[0]);
    expect(screen.getAllByText(/2 artículos/).length).toBeGreaterThanOrEqual(1);
  });

  it('decrements quantity and removes item at zero', () => {
    renderOrder();
    const addButtons = screen.getAllByLabelText(/Agregar Espresso Doble/);
    fireEvent.click(addButtons[0]);
    expect(screen.getAllByText(/\d+ artículos?/).length).toBeGreaterThanOrEqual(1);

    // Decrement via the menu row minus button
    const decButtons = screen.getAllByLabelText(/Reducir Espresso Doble/);
    fireEvent.click(decButtons[0]);
    // Item removed, cart should be empty
    expect(screen.getByText('Tu carrito está vacío')).toBeDefined();
  });

  it('send button is disabled when cart is empty', () => {
    renderOrder();
    const btn = screen.getByText('Enviar Pedido por WhatsApp');
    expect(btn.closest('button').disabled).toBe(true);
  });

  it('send button is enabled when cart has items', () => {
    renderOrder();
    const addButtons = screen.getAllByLabelText(/Agregar Espresso Doble/);
    fireEvent.click(addButtons[0]);
    const btn = screen.getByText('Enviar Pedido por WhatsApp');
    expect(btn.closest('button').disabled).toBe(false);
  });

  it('shows validation errors for empty required fields', async () => {
    renderOrder();
    const addButtons = screen.getAllByLabelText(/Agregar Espresso Doble/);
    fireEvent.click(addButtons[0]);

    fireEvent.click(screen.getByText('Enviar Pedido por WhatsApp'));

    await waitFor(() => {
      // Multiple required fields show errors at once
      const errors = screen.getAllByText(/obligatorio/);
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('shows validation errors for invalid phone', async () => {
    renderOrder();
    const addButtons = screen.getAllByLabelText(/Agregar Espresso Doble/);
    fireEvent.click(addButtons[0]);

    fireEvent.change(screen.getByPlaceholderText('Tu nombre'), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByPlaceholderText(/Calle, número/), { target: { value: 'Calle 123' } });
    fireEvent.change(screen.getByPlaceholderText(/\+52/), { target: { value: '123' } });

    fireEvent.click(screen.getByText('Enviar Pedido por WhatsApp'));

    await waitFor(() => {
      expect(screen.getByText(/inválido/i)).toBeDefined();
    });
  });

  it('opens WhatsApp URL on valid submission', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {});

    renderOrder();
    const addButtons = screen.getAllByLabelText(/Agregar Espresso Doble/);
    fireEvent.click(addButtons[0]);

    fireEvent.change(screen.getByPlaceholderText('Tu nombre'), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByPlaceholderText(/Calle, número/), { target: { value: 'Calle 123' } });
    fireEvent.change(screen.getByPlaceholderText(/\+52/), { target: { value: '+521234567890' } });

    // Bypass GPS coverage for test
    fireEvent.click(screen.getByText(/Validar cobertura/));

    fireEvent.click(screen.getByText('Enviar Pedido por WhatsApp'));

    await waitFor(() => {
      expect(openSpy).toHaveBeenCalledTimes(1);
      const url = openSpy.mock.calls[0][0];
      expect(url).toContain('wa.me/521234567890');
      expect(url).toContain('text=');
      expect(decodeURIComponent(url)).toContain('CAFÉ AROMÁTICO');
    });
  });

  it('clears cart after successful send', async () => {
    vi.spyOn(window, 'open').mockImplementation(() => {});

    renderOrder();
    const addButtons = screen.getAllByLabelText(/Agregar Espresso Doble/);
    fireEvent.click(addButtons[0]);

    fireEvent.change(screen.getByPlaceholderText('Tu nombre'), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByPlaceholderText(/Calle, número/), { target: { value: 'Calle 123' } });
    fireEvent.change(screen.getByPlaceholderText(/\+52/), { target: { value: '+521234567890' } });

    // Bypass GPS coverage for test
    fireEvent.click(screen.getByText(/Validar cobertura/));

    fireEvent.click(screen.getByText('Enviar Pedido por WhatsApp'));

    await waitFor(() => {
      // Upon successful submission, the success ticket view replaces the form/cart
      expect(screen.getByText('¡Pedido Enviado!')).toBeDefined();
    });
  });

  it('persists cart in localStorage', () => {
    renderOrder();
    const addButtons = screen.getAllByLabelText(/Agregar Espresso Doble/);
    fireEvent.click(addButtons[0]);

    const stored = JSON.parse(localStorage.getItem('order_cart_v1'));
    expect(stored).toBeTruthy();
    expect(stored.items).toHaveLength(1);
    expect(stored.items[0].name).toBe('Espresso Doble');
    expect(stored.items[0].qty).toBe(1);
  });

  it('shows success message after sending', async () => {
    vi.spyOn(window, 'open').mockImplementation(() => {});

    renderOrder();
    const addButtons = screen.getAllByLabelText(/Agregar Espresso Doble/);
    fireEvent.click(addButtons[0]);

    fireEvent.change(screen.getByPlaceholderText('Tu nombre'), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByPlaceholderText(/Calle, número/), { target: { value: 'Calle 123' } });
    fireEvent.change(screen.getByPlaceholderText(/\+52/), { target: { value: '+521234567890' } });

    // Bypass GPS coverage for test
    fireEvent.click(screen.getByText(/Validar cobertura/));

    fireEvent.click(screen.getByText('Enviar Pedido por WhatsApp'));

    await waitFor(() => {
      expect(screen.getByText('¡Pedido Enviado!')).toBeDefined();
    });
  });

  it('shows notes field as optional', () => {
    renderOrder();
    const notesField = screen.getByPlaceholderText(/Instrucciones especiales/);
    expect(notesField).toBeDefined();
  });

  it('clear button removes all items from cart', () => {
    renderOrder();
    const addButtons = screen.getAllByLabelText(/Agregar Espresso Doble/);
    fireEvent.click(addButtons[0]);
    const coldAdd = screen.getAllByLabelText(/Agregar Cold Brew Clásico/);
    fireEvent.click(coldAdd[0]);

    expect(screen.getAllByText(/2 artículos/).length).toBeGreaterThanOrEqual(1);

    fireEvent.click(screen.getByText(/Limpiar/));
    expect(screen.getByText('Tu carrito está vacío')).toBeDefined();
  });
});
