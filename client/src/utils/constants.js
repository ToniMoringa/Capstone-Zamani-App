/**
 * Application Constants
 * Centralized configuration values and defaults
 */

// API Configuration
export const API_CONFIG = {
  WIKIPEDIA_BASE:
    'https://api.wikimedia.org/core/v1/wikipedia/en/page/onthisday',
  NASA_BASE: 'https://api.nasa.gov/planetary/apod',
  NASA_KEY: 'DEMO_KEY',
  TIMEOUT: 10000, // 10 seconds
};

// Date Configuration
export const DATE_CONFIG = {
  MIN_DATE: '1900-01-01',
  MAX_DATE: new Date().toISOString().split('T')[0],
  DEFAULT_MODE: 'global',
};

// UI Configuration
export const UI_CONFIG = {
  TV_BRAND: 'ZAMANI BROADCAST',
  LOADING_DELAY: 800, // Minimum loading time for smooth UX
  ANIMATION_DURATION: 300,
};

// Storage Keys (THIS IS WHAT WAS MISSING)
export const STORAGE_KEYS = {
  SAVED_CAPSULES: 'zamani_saved_capsules',
  USER_PREFERENCES: 'zamani_preferences',
};

// Categories for Kenya events
export const KENYA_CATEGORIES = {
  INDEPENDENCE: 'independence',
  POLITICAL: 'political',
  CULTURAL: 'cultural',
  SECURITY: 'security',
  SPORTS: 'sports',
  INFRASTRUCTURE: 'infrastructure',
  SOCIAL: 'social',
  REGIONAL: 'regional',
};
