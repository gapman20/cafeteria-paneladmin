import { describe, it, expect } from 'vitest';
import { parsePrice } from '../../utils/priceParser';

describe('parsePrice', () => {
  it('parses $65 to 65', () => {
    expect(parsePrice('$65')).toBe(65);
  });

  it('parses $1,200 to 1200', () => {
    expect(parsePrice('$1,200')).toBe(1200);
  });

  it('parses $1,000 to 1000', () => {
    expect(parsePrice('$1,000')).toBe(1000);
  });

  it('parses $50 to 50', () => {
    expect(parsePrice('$50')).toBe(50);
  });

  it('returns 0 for null', () => {
    expect(parsePrice(null)).toBe(0);
  });

  it('returns 0 for empty string', () => {
    expect(parsePrice('')).toBe(0);
  });

  it('returns 0 for unparseable string', () => {
    expect(parsePrice('free')).toBe(0);
  });

  it('returns 0 for undefined', () => {
    expect(parsePrice(undefined)).toBe(0);
  });

  it('handles $0', () => {
    expect(parsePrice('$0')).toBe(0);
  });
});
