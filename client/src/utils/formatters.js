import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Format a date string to a readable date.
 * @param {string|Date} date
 * @param {string} format - dayjs format string
 * @returns {string}
 */
export const formatDate = (date, format = 'MMM D, YYYY') => {
  if (!date) return '—';
  return dayjs(date).format(format);
};

/**
 * Format a date string to date + time.
 * @param {string|Date} date
 * @param {string} format
 * @returns {string}
 */
export const formatDateTime = (date, format = 'MMM D, YYYY h:mm A') => {
  if (!date) return '—';
  return dayjs(date).format(format);
};

/**
 * Format a date string to a relative time string (e.g. "2 hours ago").
 * @param {string|Date} date
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  if (!date) return '—';
  return dayjs(date).fromNow();
};

/**
 * Format a number with locale-aware separators.
 * @param {number} value
 * @param {object} options - Intl.NumberFormat options
 * @returns {string}
 */
export const formatNumber = (value, options = {}) => {
  if (value == null || isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US', options).format(value);
};

/**
 * Format a number as compact (e.g. 1.2K, 3.4M).
 * @param {number} value
 * @returns {string}
 */
export const formatCompact = (value) => {
  if (value == null || isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
};

/**
 * Truncate text with ellipsis.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
};

/**
 * Get user initials (e.g. "John Doe" → "JD").
 * @param {string} firstName
 * @param {string} lastName
 * @returns {string}
 */
export const getInitials = (firstName = '', lastName = '') => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

/**
 * Capitalise the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
