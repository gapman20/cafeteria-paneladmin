import { describe, it, expect } from 'vitest';
import { buildOrderMessage, getWhatsAppUrl } from '../../utils/whatsappMessage';

describe('buildOrderMessage', () => {
  const items = [
    { name: 'Espresso Doble', price: 65, qty: 2 },
    { name: 'Cappuccino', price: 85, qty: 1 },
  ];

  const customer = {
    name: 'Juan Pérez',
    address: 'Calle Centro 123',
    phone: '+521234567890',
    notes: 'Sin azúcar, por favor',
  };

  it('formats the complete message with notes', () => {
    const msg = buildOrderMessage(items, customer);
    expect(msg).toContain('🛒 Pedido de Café Aromático');
    expect(msg).toContain('👤 Juan Pérez');
    expect(msg).toContain('📍 Calle Centro 123');
    expect(msg).toContain('📱 +521234567890');
    expect(msg).toContain('• Espresso Doble ×2 — $130');
    expect(msg).toContain('• Cappuccino ×1 — $85');
    expect(msg).toContain('💰 Total: $215');
    expect(msg).toContain('📝 Sin azúcar, por favor');
  });

  it('omits notes when empty', () => {
    const custNoNotes = { ...customer, notes: '' };
    const msg = buildOrderMessage(items, custNoNotes);
    expect(msg).not.toContain('📝');
    expect(msg).toContain('💰 Total: $215');
  });

  it('omits notes when whitespace only', () => {
    const custWhitespace = { ...customer, notes: '   ' };
    const msg = buildOrderMessage(items, custWhitespace);
    expect(msg).not.toContain('📝');
  });

  it('handles single item', () => {
    const singleItem = [{ name: 'Americano', price: 60, qty: 1 }];
    const msg = buildOrderMessage(singleItem, customer);
    expect(msg).toContain('• Americano ×1 — $60');
    expect(msg).toContain('💰 Total: $60');
  });

  it('calculates correct total for multiple quantities', () => {
    const bulkItems = [
      { name: 'Brownie', price: 65, qty: 3 },
    ];
    const msg = buildOrderMessage(bulkItems, customer);
    expect(msg).toContain('• Brownie ×3 — $195');
    expect(msg).toContain('💰 Total: $195');
  });
});

describe('getWhatsAppUrl', () => {
  it('strips non-digit characters from number', () => {
    const url = getWhatsAppUrl('+521234567890', 'Hello');
    expect(url).toBe('https://wa.me/521234567890?text=Hello');
  });

  it('encodes the message', () => {
    const url = getWhatsAppUrl('123456', 'Hola mundo!');
    expect(url).toContain('text=Hola%20mundo!');
  });

  it('handles empty number gracefully', () => {
    const url = getWhatsAppUrl('', 'Hello');
    expect(url).toBe('https://wa.me/?text=Hello');
  });

  it('handles null number', () => {
    const url = getWhatsAppUrl(null, 'Hello');
    expect(url).toBe('https://wa.me/?text=Hello');
  });

  it('encodes special characters in message', () => {
    const url = getWhatsAppUrl('123', 'Pedido: Café & Pasteles');
    expect(url).toContain('text=Pedido%3A%20Caf%C3%A9%20%26%20Pasteles');
  });
});
