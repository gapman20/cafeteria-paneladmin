/**
 * Pure validation functions for form fields.
 * Each function returns { valid: boolean, error: string | null }.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s\-().]{7,20}$/;

/**
 * Validate email format.
 * @param {string} email
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateEmail(email) {
  const value = (email || '').trim();
  if (!value) {
    return { valid: false, error: 'El correo es obligatorio' };
  }
  if (!EMAIL_REGEX.test(value)) {
    return { valid: false, error: 'Formato de correo inválido' };
  }
  return { valid: true, error: null };
}

/**
 * Validate password strength.
 * @param {string} pass
 * @param {object} [options]
 * @param {number} [options.minLength=8]
 * @param {boolean} [options.requireUppercase=true]
 * @param {boolean} [options.requireLowercase=true]
 * @param {boolean} [options.requireNumber=true]
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validatePassword(pass, options = {}) {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
  } = options;

  const value = pass || '';

  if (!value) {
    return { valid: false, error: 'La contraseña es obligatoria' };
  }
  if (value.length < minLength) {
    return { valid: false, error: `Mínimo ${minLength} caracteres` };
  }
  if (requireUppercase && !/[A-Z]/.test(value)) {
    return { valid: false, error: 'Debe incluir al menos 1 mayúscula' };
  }
  if (requireLowercase && !/[a-z]/.test(value)) {
    return { valid: false, error: 'Debe incluir al menos 1 minúscula' };
  }
  if (requireNumber && !/[0-9]/.test(value)) {
    return { valid: false, error: 'Debe incluir al menos 1 número' };
  }
  return { valid: true, error: null };
}

/**
 * Validate that a value is not empty (after trim).
 * @param {*} value
 * @param {string} fieldName
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateRequired(value, fieldName) {
  const str = typeof value === 'string' ? value.trim() : String(value || '').trim();
  if (!str) {
    return { valid: false, error: `${fieldName} es obligatorio` };
  }
  return { valid: true, error: null };
}

/**
 * Validate phone number format.
 * @param {string} phone
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validatePhone(phone) {
  const value = (phone || '').trim();
  if (!value) {
    return { valid: false, error: 'El teléfono es obligatorio' };
  }
  if (!PHONE_REGEX.test(value)) {
    return { valid: false, error: 'Formato de teléfono inválido' };
  }
  return { valid: true, error: null };
}

/**
 * Validate minimum string length.
 * @param {*} value
 * @param {number} min
 * @param {string} fieldName
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateMinLength(value, min, fieldName) {
  const str = typeof value === 'string' ? value : String(value || '');
  if (str.length < min) {
    return { valid: false, error: fieldName ? `${fieldName}: mínimo ${min} caracteres` : `Mínimo ${min} caracteres` };
  }
  return { valid: true, error: null };
}
