import axios from 'axios';

/**
 * NASA API Module
 * 
 * Fetches Astronomy Picture of the Day (APOD) from NASA's API.
 * Uses DEMO_KEY for development (rate limited to ~50 requests/hour).
 * 
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Object} - { url, title, explanation, copyright, date }
 */

const NASA_API_KEY = 'DEMO_KEY'; // Replace with your own key for production
const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod';

export const fetchNASAAPOD = async (date) => {
  try {
    const response = await axios.get(NASA_APOD_URL, {
      params: {
        api_key: NASA_API_KEY,
        date: date, // Format: YYYY-MM-DD
        thumbs: true // Include thumbnail for videos
      }
    });

    const data = response.data;

    // Handle different media types (image vs video)
    const mediaUrl = data.media_type === 'video' 
      ? data.thumbnail_url 
      : data.url;

    return {
      url: mediaUrl,
      title: data.title,
      explanation: data.explanation,
      copyright: data.copyright || null,
      date: data.date,
      mediaType: data.media_type,
      hdUrl: data.hdurl || null
    };
  } catch (error) {
    console.error('NASA API Error:', error);
    
    // Handle specific error cases
    if (error.response?.status === 400) {
      return {
        error: 'Invalid date or no data available for this date',
        url: null,
        title: 'No Image Available',
        explanation: 'NASA does not have an APOD for this date.'
      };
    }
    
    if (error.response?.status === 429) {
      return {
        error: 'Rate limit exceeded. Please try again later.',
        url: null,
        title: 'Rate Limited',
        explanation: 'Too many requests to NASA API. Try again in a few minutes.'
      };
    }

    return {
      error: 'Failed to load NASA data',
      url: null,
      title: 'Connection Error',
      explanation: 'Unable to fetch data from NASA. Please check your connection.'
    };
  }
};

/**
 * Fetch multiple days of APOD data (for cached viewing)
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Array} - Array of APOD objects
 */
export const fetchNASARange = async (startDate, endDate) => {
  try {
    const response = await axios.get(NASA_APOD_URL, {
      params: {
        api_key: NASA_API_KEY,
        start_date: startDate,
        end_date: endDate,
        thumbs: true
      }
    });

    return response.data.map(item => ({
      url: item.media_type === 'video' ? item.thumbnail_url : item.url,
      title: item.title,
      explanation: item.explanation,
      copyright: item.copyright || null,
      date: item.date,
      mediaType: item.media_type
    }));
  } catch (error) {
    console.error('NASA Range API Error:', error);
    return [];
  }
};