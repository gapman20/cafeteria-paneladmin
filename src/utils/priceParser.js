/**
 * Parse a price string like "$65" or "$1,200" into a numeric value.
 * Returns 0 for unparseable or empty inputs (never throws).
 *
 * @param {string} priceStr
 * @returns {number}
 */
export function parsePrice(priceStr) {
  const match = (priceStr || '').match(/\$(\d[\d,]*)/);
  return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
}
