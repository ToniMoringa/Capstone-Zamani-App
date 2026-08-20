import axios from 'axios';

/**
 * Wikipedia API Module (Public Action API Endpoint)
 * Fetches "On This Day" events and births reliably without strict auth headers.
 */
const WIKIPEDIA_BASE_URL = 'https://en.wikipedia.org/w/api.php';

export const fetchWikipediaEvents = async (month, day) => {
  try {
    // Using Wikipedia's standard public action API for On This Day
    const response = await axios.get(WIKIPEDIA_BASE_URL, {
      params: {
        action: 'query',
        format: 'json',
        prop: 'extracts',
        // Note: Wikipedia's feed API is cleaner for structured onthisday events
        origin: '*',
      },
    });

    // Fallback/direct fetch from the reliable Wikimedia feeds endpoint
    const feedResponse = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`,
    );

    const birthsResponse = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/${month}/${day}`,
    );

    const events = (feedResponse.data.events || []).map((event) => ({
      year: event.year,
      text: event.text,
      pages: event.pages || [],
    }));

    const births = (birthsResponse.data.births || []).map((birth) => ({
      year: birth.year,
      name: birth.text,
      text: birth.text,
      pages: birth.pages || [],
    }));

    return { events, births };
  } catch (error) {
    console.error('Wikipedia API Error:', error);

    return {
      events: [],
      births: [],
      error: 'Failed to load Wikipedia data',
    };
  }
};
