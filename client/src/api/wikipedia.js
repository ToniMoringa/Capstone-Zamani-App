import axios from 'axios';

const FLASK_API = 'http://localhost:5000/api/v1/capsules/';
const WIKI_API = 'https://en.wikipedia.org/api/rest_v1/feed/onthisday/all';

export const fetchCapsuleData = async (dateStr, mode = 'global') => {
  try {
    const localRes = await axios.get(`${FLASK_API}?date=${dateStr}`);
    const localData = Array.isArray(localRes.data) ? localRes.data : [];
    
    if (localData.length > 0) {
      return {
        events: localData.filter(c => c.category === 'event'),
        births: localData.filter(c => c.category === 'birth'),
        source: 'local_db'
      };
    }

    if (mode === 'kenya') {
      return { events: [], births: [], source: 'empty_kenya' };
    }

    const [, month, day] = dateStr.split('-');
    const wikiRes = await axios.get(`${WIKI_API}/${month}/${day}`);
    
    return {
      events: wikiRes.data?.events || [],
      births: wikiRes.data?.births || [],
      source: 'wikipedia_fallback'
    };

  } catch (error) {
    console.error('Capsule Fetch Error:', error);
    return { 
      events: [], 
      births: [], 
      source: 'error', 
      error: error.response?.data?.message || error.message || 'Network Error' 
    };
  }
};