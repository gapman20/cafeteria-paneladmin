import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateRequired,
  validatePhone,
  validateMinLength,
} from '../../utils/validation';

describe('validateEmail', () => {
  it('returns error for empty email', () => {
    const result = validateEmail('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns error for missing @ sign', () => {
    const result = validateEmail('notanemail');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('inválido');
  });

  it('returns error for missing domain', () => {
    const result = validateEmail('user@');
    expect(result.valid).toBe(false);
  });

  it('returns error for missing TLD', () => {
    const result = validateEmail('user@domain');
    expect(result.valid).toBe(false);
  });

  it('accepts valid email', () => {
    const result = validateEmail('user@example.com');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('trims whitespace', () => {
    const result = validateEmail('  user@example.com  ');
    expect(result.valid).toBe(true);
  });

  it('accepts subdomain emails', () => {
    const result = validateEmail('user@sub.domain.com');
    expect(result.valid).toBe(true);
  });
});

describe('validatePassword', () => {
  it('returns error for empty password', () => {
    const result = validatePassword('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns error for too short password', () => {
    const result = validatePassword('Ab1');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('8');
  });

  it('returns error for missing uppercase', () => {
    const result = validatePassword('abcdefg1');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('mayúscula');
  });

  it('returns error for missing lowercase', () => {
    const result = validatePassword('ABCDEFG1');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('minúscula');
  });

  it('returns error for missing number', () => {
    const result = validatePassword('Abcdefgh');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('número');
  });

  it('accepts valid password', () => {
    const result = validatePassword('Admin123');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('respects custom options', () => {
    const result = validatePassword('abc', {
      minLength: 3,
      requireUppercase: false,
      requireLowercase: true,
      requireNumber: false,
    });
    expect(result.valid).toBe(true);
  });
});

describe('validateRequired', () => {
  it('returns error for empty string', () => {
    const result = validateRequired('', 'Nombre');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Nombre');
  });

  it('returns error for whitespace-only string', () => {
    const result = validateRequired('   ', 'Nombre');
    expect(result.valid).toBe(false);
  });

  it('returns error for null/undefined', () => {
    expect(validateRequired(null, 'Campo').valid).toBe(false);
    expect(validateRequired(undefined, 'Campo').valid).toBe(false);
  });

  it('accepts valid value', () => {
    const result = validateRequired('Hello', 'Nombre');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });
});

describe('validatePhone', () => {
  it('returns error for empty phone', () => {
    const result = validatePhone('');
    expect(result.valid).toBe(false);
  });

  it('returns error for too short number', () => {
    const result = validatePhone('123');
    expect(result.valid).toBe(false);
  });

  it('accepts valid phone with country code', () => {
    const result = validatePhone('+521234567890');
    expect(result.valid).toBe(true);
  });

  it('accepts phone with spaces and dashes', () => {
    const result = validatePhone('+1 (555) 123-4567');
    expect(result.valid).toBe(true);
  });
});

describe('validateMinLength', () => {
  it('returns error for too short value', () => {
    const result = validateMinLength('Hi', 10, 'Mensaje');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('10');
  });

  it('accepts value meeting min length', () => {
    const result = validateMinLength('Hello World', 10, 'Mensaje');
    expect(result.valid).toBe(true);
  });

  it('accepts value exceeding min length', () => {
    const result = validateMinLength('A very long message', 10, 'Mensaje');
    expect(result.valid).toBe(true);
  });
});
