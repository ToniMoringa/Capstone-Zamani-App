/**
 * Utility Helper Functions
 * Common functions used across the application
 */

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type ('full', 'short', 'iso')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'full') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'full':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'short':
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    case 'iso':
      return dateObj.toISOString().split('T')[0];
    default:
      return dateObj.toLocaleDateString();
  }
};

/**
 * Extract month and day from date string
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {Object} - { month, day }
 */
export const extractMonthDay = (dateString) => {
  const date = new Date(dateString);
  return {
    month: date.getMonth() + 1, // JavaScript months are 0-indexed
    day: date.getDate()
  };
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text with ellipsis
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Generate unique ID
 * @returns {string} - Unique identifier
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Debounce function for performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if date is valid
 * @param {string} dateString - Date string to validate
 * @returns {boolean} - True if valid date
 */
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Get relative time string
 * @param {string|Date} date - Date to compare
 * @returns {string} - Relative time description
 */
export const getRelativeTime = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = Math.abs(now - dateObj);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};