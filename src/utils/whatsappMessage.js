import { parsePrice } from './priceParser';

/**
 * Build the formatted WhatsApp order ticket message.
 * Accepts either a cart object with an `items` array, or a plain items array.
 *
 * @param {Array|{ items: Array }} cartOrItems
 * @param {{ name: string, address: string, phone: string, notes: string, tableNumber?: string }} customer
 * @returns {string}
 */
export function buildOrderMessage(cartOrItems, customer) {
  const items = Array.isArray(cartOrItems) ? cartOrItems : (cartOrItems.items || []);
  const lines = [];

  const storeName = (customer.siteName || 'CAFÉ AROMÁTICO').toUpperCase();
  const LINE_WIDTH = 32;

  // Helpers for text alignment
  const padRight = (str, len) => (str.length >= len ? str.substring(0, len) : str + ' '.repeat(len - str.length));
  const padLeft = (str, len) => (str.length >= len ? str.substring(0, len) : ' '.repeat(len - str.length) + str);
  const padCenter = (str, len) => {
    if (str.length >= len) return str.substring(0, len);
    const pad = len - str.length;
    const padL = Math.floor(pad / 2);
    const padR = pad - padL;
    return ' '.repeat(padL) + str + ' '.repeat(padR);
  };

  // Start WhatsApp Monospace Block
  lines.push('```');
  lines.push('='.repeat(LINE_WIDTH));
  lines.push(padCenter(storeName, LINE_WIDTH));
  lines.push('='.repeat(LINE_WIDTH));
  
  const dateStr = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  lines.push(`Fecha: ${dateStr} ${timeStr}`);
  
  if (customer.orderType === 'table' || customer.tableNumber) {
    lines.push(`Tipo: En Mesa`);
    lines.push(`Mesa: ${customer.tableNumber}`);
    lines.push(`Para: ${customer.name}`);
  } else {
    lines.push(`Tipo: ${customer.orderType === 'delivery' ? 'A Domicilio' : 'Para Llevar'}`);
    lines.push(`Para: ${customer.name}`);
    if (customer.orderType === 'delivery') {
      lines.push(`Dir: ${customer.address}`);
    }
    lines.push(`Tel: ${customer.phone}`);
  }
  
  lines.push('-'.repeat(LINE_WIDTH));

  let total = 0;
  for (const item of items) {
    const priceNum = typeof item.price === 'number' ? item.price : parsePrice(`$${item.price}`);
    const subtotal = priceNum * item.qty;
    total += subtotal;
    
    // Format line: "1  Cappuccino Clásico  $ 85.00"
    const qtyStr = `${item.qty} `;
    const priceStr = `$${subtotal.toFixed(2)}`;
    
    // Calculate remaining space for item name
    const nameLen = LINE_WIDTH - qtyStr.length - priceStr.length;
    const nameStr = padRight(item.name, nameLen);
    
    lines.push(`${qtyStr}${nameStr}${padLeft(priceStr, LINE_WIDTH - qtyStr.length - nameLen)}`);
    
    // Include customization details if present
    if (item.customization) {
      const c = item.customization;
      const details = [];
      if (c.sizeLabel) details.push(c.sizeLabel);
      if (c.milkLabel) details.push(c.milkLabel);
      if (c.sweetnessLabel) details.push(c.sweetnessLabel);
      if (c.extrasLabels && c.extrasLabels.length > 0) {
        details.push(c.extrasLabels.join(', '));
      }
      if (c.excludedIngredients && c.excludedIngredients.length > 0) {
        details.push(`Sin: ${c.excludedIngredients.join(', ')}`);
      }
      if (details.length > 0) {
        const detailStr = ` ↳ ${details.join(' · ')}`;
        if (detailStr.length > LINE_WIDTH) {
          lines.push(detailStr.substring(0, LINE_WIDTH));
        } else {
          lines.push(detailStr);
        }
      }
    }
  }

  lines.push('-'.repeat(LINE_WIDTH));
  
  const totalLabel = 'TOTAL:';
  const totalStr = `$${total.toFixed(2)}`;
  lines.push(`${totalLabel}${padLeft(totalStr, LINE_WIDTH - totalLabel.length)}`);
  lines.push('='.repeat(LINE_WIDTH));

  if (customer.notes && customer.notes.trim()) {
    lines.push(`Notas: ${customer.notes.trim()}`);
    lines.push('='.repeat(LINE_WIDTH));
  }
  
  lines.push('¡Gracias por su pedido!');
  
  // Close WhatsApp Monospace Block
  lines.push('```');

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
