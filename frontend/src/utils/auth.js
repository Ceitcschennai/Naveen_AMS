// src/utils/auth.js
export const getToken = () => {
  return localStorage.getItem('token');
};

// Password validation regex:
// - 8-16 characters long
// - At least one uppercase letter (A-Z)
// - At least one lowercase letter (a-z)
// - At least one number (0-9)
// - At least one special character (!@#$%^&*)
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

export const PASSWORD_ERROR_MESSAGE = "Password must be 8-16 characters: include uppercase (A-Z), lowercase (a-z), number (0-9), and special character (@$!%*?&).";

/**
 * Validates a password against the security requirements
 * @param {string} password - The password to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validatePassword = (password) => {
  if (!password) return false;
  return PASSWORD_REGEX.test(password);
};

/**
 * Checks individual password requirements and returns which ones are met
 * @param {string} password - The password to check
 * @returns {object} - Object with individual requirement status
 */
export const getPasswordRequirements = (password) => {
  return {
    minLength: password && password.length >= 8,
    maxLength: password && password.length <= 16,
    hasUppercase: password && /[A-Z]/.test(password),
    hasLowercase: password && /[a-z]/.test(password),
    hasNumber: password && /\d/.test(password),
    hasSpecialChar: password && /[@$!%*?&]/.test(password),
  };
};
