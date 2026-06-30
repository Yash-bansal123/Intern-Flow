/**
 * Validate an email address.
 * @param {string} email
 * @returns {{ valid: boolean, message: string }}
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { valid: false, message: 'Email is required' };
  }
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!re.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  return { valid: true, message: '' };
};

/**
 * Validate a password with strength requirements.
 * @param {string} password
 * @returns {{ valid: boolean, message: string, strength: number }}
 */
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, message: 'Password is required', strength: 0 };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters', strength: 1 };
  }

  let strength = 1;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength < 3) {
    return {
      valid: false,
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      strength,
    };
  }
  return { valid: true, message: '', strength };
};

/**
 * Validate that a field is not empty.
 * @param {string} value
 * @param {string} fieldName
 * @returns {{ valid: boolean, message: string }}
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true, message: '' };
};

/**
 * Validate that two values match (e.g. password confirmation).
 * @param {string} value
 * @param {string} compareValue
 * @param {string} fieldName
 * @returns {{ valid: boolean, message: string }}
 */
export const validateMatch = (value, compareValue, fieldName = 'Fields') => {
  if (value !== compareValue) {
    return { valid: false, message: `${fieldName} do not match` };
  }
  return { valid: true, message: '' };
};

/**
 * Validate minimum length.
 * @param {string} value
 * @param {number} min
 * @param {string} fieldName
 * @returns {{ valid: boolean, message: string }}
 */
export const validateMinLength = (value, min, fieldName = 'This field') => {
  if (!value || value.length < min) {
    return { valid: false, message: `${fieldName} must be at least ${min} characters` };
  }
  return { valid: true, message: '' };
};

/**
 * Run multiple validators against a set of values.
 * @param {Record<string, Array<() => { valid: boolean, message: string }>>} validations
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export const validateForm = (validations) => {
  const errors = {};
  let isValid = true;

  for (const [field, validators] of Object.entries(validations)) {
    for (const validator of validators) {
      const result = validator();
      if (!result.valid) {
        errors[field] = result.message;
        isValid = false;
        break; // first failure wins per field
      }
    }
  }

  return { isValid, errors };
};
