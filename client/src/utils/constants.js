// API Config
export const API_CONFIG = {
  WIKIPEDIA_BASE:
    'https://api.wikimedia.org/core/v1/wikipedia/en/page/onthisday',
  NASA_BASE: 'https://api.nasa.gov/planetary/apod',
  NASA_KEY: 'DEMO_KEY',
  TIMEOUT: 10000, // 10 seconds
};

//  API Base URL
export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  'http://localhost:5000';

// Date Config
export const DATE_CONFIG = {
  MIN_DATE: '1900-01-01',
  MAX_DATE: new Date().toISOString().split('T')[0],
  DEFAULT_MODE: 'global',
};

// UI Config
export const UI_CONFIG = {
  TV_BRAND: 'ZAMANI BROADCAST',
  LOADING_DELAY: 800, 
  ANIMATION_DURATION: 300,
};

// Storage Keys 
export const STORAGE_KEYS = {
  SAVED_CAPSULES: 'zamani_saved_capsules',
  USER_PREFERENCES: 'zamani_preferences',
};

// Categories Kenya events
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
