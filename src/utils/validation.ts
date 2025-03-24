/**
 * Utility functions for validation in the application
 */

/**
 * Validate a bet amount
 * @param value - The bet amount to validate
 * @param balance - Current balance
 * @param minBet - Minimum allowed bet
 * @returns Error message if invalid, empty string if valid
 */
export const validateBetAmount = (value: number, balance: number, minBet: number = 1): string => {
  if (isNaN(value)) {
    return 'Bet amount must be a number';
  }

  if (value <= 0) {
    return 'Bet amount must be greater than zero';
  }

  if (value < minBet) {
    return `Bet amount must be at least ${minBet}`;
  }

  if (value > balance) {
    return 'Bet amount cannot exceed your balance';
  }

  return '';
};

/**
 * Validate a percentage value
 * @param value - The percentage to validate (0-100)
 * @returns Error message if invalid, empty string if valid
 */
export const validatePercentage = (value: number): string => {
  if (isNaN(value)) {
    return 'Percentage must be a number';
  }

  if (value < 0 || value > 100) {
    return 'Percentage must be between 0 and 100';
  }

  return '';
};

/**
 * Validate if a value is a positive number
 * @param value - The value to validate
 * @returns Error message if invalid, empty string if valid
 */
export const validatePositiveNumber = (value: number): string => {
  if (isNaN(value)) {
    return 'Value must be a number';
  }

  if (value < 0) {
    return 'Value must be a positive number';
  }

  return '';
};

/**
 * Validate if a string is not empty
 * @param value - The string to validate
 * @returns Error message if invalid, empty string if valid
 */
export const validateRequired = (value: string): string => {
  if (!value || value.trim() === '') {
    return 'This field is required';
  }

  return '';
}; 