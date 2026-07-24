import { parsePrice } from './priceParser';

/**
 * Build the formatted WhatsApp order ticket message.
 * Accepts either a cart object with an `items` array, or a plain items array.
 *
 * @param {Array|{ items: Array }} cartOrItems
 * @param {{ name: string, address: string, phone: string, notes: string }} customer
 * @returns {string}
 */
export function buildOrderMessage(cartOrItems, customer) {
  const items = Array.isArray(cartOrItems) ? cartOrItems : (cartOrItems.items || []);
  const lines = [];
  lines.push('🛒 Pedido de Café Aromático');
  lines.push('');
  lines.push(`👤 ${customer.name}`);
  lines.push(`📍 ${customer.address}`);
  lines.push(`📱 ${customer.phone}`);
  lines.push('');

  let total = 0;
  for (const item of items) {
    const priceNum = typeof item.price === 'number' ? item.price : parsePrice(`$${item.price}`);
    const subtotal = priceNum * item.qty;
    total += subtotal;
    lines.push(`• ${item.name} ×${item.qty} — $${subtotal}`);
  }

  lines.push('');
  lines.push(`💰 Total: $${total}`);

  if (customer.notes && customer.notes.trim()) {
    lines.push('');
    lines.push(`📝 ${customer.notes.trim()}`);
  }

  return lines.join('\n');
}

/**
 * Build a wa.me URL with encoded message.
 *
 * @param {string} number - WhatsApp number (digits only or with formatting)
 * @param {string} message - The message to pre-fill
 * @returns {string}
 */
export function getWhatsAppUrl(number, message) {
  const digits = (number || '').replace(/[^0-9]/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
