/**
 * Utility functions for formatting values in the application
 */

/**
 * Format a number as a currency string
 * @param value - The number to format
 * @param currency - The currency symbol (default: $)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, currency: string = '$', decimals: number = 2): string => {
  return `${currency}${value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

/**
 * Format a number as a percentage string
 * @param value - The number to format (e.g., 0.25 for 25%)
 * @param decimals - Number of decimal places (default: 1)
 * @param includeSymbol - Whether to include the % symbol (default: true)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals: number = 1, includeSymbol: boolean = true): string => {
  const formatted = (value * 100).toFixed(decimals);
  return includeSymbol ? `${formatted}%` : formatted;
};

/**
 * Format a date as a string
 * @param date - The date to format
 * @param includeTime - Whether to include the time (default: false)
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string, includeTime: boolean = false): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime && { hour: '2-digit', minute: '2-digit' })
  };
  
  return dateObj.toLocaleDateString('en-US', options);
};

/**
 * Truncate a string to a specified length with an ellipsis
 * @param str - The string to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}; 