/**
 * Kenya Data Module
 * 
 * Curated collection of significant Kenyan historical events.
 * Used as backup when APIs fail or for Kenya Mode enrichment.
 * Organized by category for better filtering.
 */

const kenyaEvents = [
  // Independence & Political Milestones
  {
    date: '1963-12-12',
    title: 'Kenya Independence Day',
    description: 'Kenya gained independence from British colonial rule. Jomo Kenyatta became the first Prime Minister, marking the end of over 60 years of colonial administration.',
    category: 'independence',
    significance: 'high'
  },
  {
    date: '1963-06-01',
    title: 'Madaraka Day',
    description: 'Kenya achieved internal self-government (Madaraka), transitioning from colonial rule to self-governance before full independence.',
    category: 'independence',
    significance: 'high'
  },
  {
    date: '1964-12-12',
    title: 'Republic Day',
    description: 'Kenya became a republic with Jomo Kenyatta as its first President, completing the transition from monarchy to republic.',
    category: 'political',
    significance: 'high'
  },
  {
    date: '1982-08-01',
    title: 'Attempted Coup d\'État',
    description: 'A group of air force officers attempted to overthrow President Daniel arap Moi\'s government. The coup was suppressed within 24 hours.',
    category: 'political',
    significance: 'medium'
  },
  {
    date: '1991-12-10',
    title: 'Repeal of Section 2A',
    description: 'Parliament repealed Section 2A of the constitution, ending single-party rule and paving the way for multi-party democracy.',
    category: 'political',
    significance: 'high'
  },
  {
    date: '2007-12-27',
    title: 'Post-Election Violence Begins',
    description: 'Disputed presidential election results triggered widespread violence across Kenya, leading to over 1,000 deaths and 600,000 displaced.',
    category: 'political',
    significance: 'high'
  },
  {
    date: '2010-08-27',
    title: 'New Constitution Promulgated',
    description: 'Kenya\'s new constitution was promulgated, introducing devolution, bill of rights, and independent judiciary.',
    category: 'political',
    significance: 'high'
  },

  // Social & Cultural Events
  {
    date: '1963-10-20',
    title: 'Release of Jomo Kenyatta',
    description: 'Jomo Kenyatta was released from detention after 7 years, setting the stage for his leadership in independent Kenya.',
    category: 'cultural',
    significance: 'high'
  },
  {
    date: '1978-08-22',
    title: 'Death of Jomo Kenyatta',
    description: 'Kenya\'s founding father and first President, Jomo Kenyatta, passed away. Daniel arap Moi succeeded him as President.',
    category: 'cultural',
    significance: 'high'
  },
  {
    date: '1998-08-07',
    title: 'US Embassy Bombing',
    description: 'Al-Qaeda bombed the US Embassy in Nairobi, killing 213 people including 12 Americans, in one of the deadliest terrorist attacks in Africa.',
    category: 'security',
    significance: 'high'
  },
  {
    date: '2013-09-21',
    title: 'Westgate Mall Attack',
    description: 'Al-Shabaab militants attacked Westgate Shopping Mall in Nairobi, killing 67 people and injuring over 175.',
    category: 'security',
    significance: 'high'
  },
  {
    date: '2017-09-01',
    title: 'Supreme Court Nullifies Election',
    description: 'Kenya\'s Supreme Court nullified the presidential election results, ordering a fresh vote - a first in African history.',
    category: 'political',
    significance: 'high'
  },

  // Recent Events
  {
    date: '2024-06-25',
    title: 'Gen Z Protests Peak',
    description: 'Nationwide protests led by Gen Z against proposed tax bills reached their peak, resulting in significant political changes and cabinet resignations.',
    category: 'social',
    significance: 'high'
  },
  {
    date: '2024-07-09',
    title: 'Finance Bill Withdrawn',
    description: 'President William Ruto withdrew the controversial Finance Bill 2024 following sustained public pressure and protests.',
    category: 'political',
    significance: 'high'
  },

  // Sports & Achievement
  {
    date: '1988-09-25',
    title: 'Douglas Wakiihuri Wins Marathon',
    description: 'Douglas Wakiihuri won the Olympic marathon gold medal in Seoul, becoming Kenya\'s first Olympic marathon champion.',
    category: 'sports',
    significance: 'medium'
  },
  {
    date: '1996-08-03',
    title: 'Josephat Machuka World Record',
    description: 'Josephat Machuka set a world record in the 10km road race, showcasing Kenya\'s dominance in long-distance running.',
    category: 'sports',
    significance: 'medium'
  },
  {
    date: '2008-08-17',
    title: 'Samuel Wanjiru Olympic Gold',
    description: 'Samuel Wanjiru won Kenya\'s first Olympic 10,000m gold medal in Beijing, continuing Kenya\'s athletics legacy.',
    category: 'sports',
    significance: 'medium'
  },

  // Economic & Development
  {
    date: '1976-05-30',
    title: 'Standard Gauge Railway Proposal',
    description: 'Initial proposals for modernizing Kenya\'s railway system were made, eventually leading to the SGR project decades later.',
    category: 'infrastructure',
    significance: 'low'
  },
  {
    date: '2017-10-16',
    title: 'SGR Launch',
    description: 'The Standard Gauge Railway (SGR) between Mombasa and Nairobi officially launched, transforming cargo and passenger transport.',
    category: 'infrastructure',
    significance: 'high'
  },
  {
    date: '2011-07-09',
    title: 'South Sudan Independence',
    description: 'South Sudan gained independence, affecting Kenya\'s regional dynamics and trade relationships.',
    category: 'regional',
    significance: 'medium'
  }
];

/**
 * Get Kenya events for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Array} - Matching events
 */
export const getKenyaEventsByDate = (date) => {
  return kenyaEvents.filter(event => event.date === date);
};

/**
 * Get Kenya events by category
 * @param {string} category - Event category
 * @returns {Array} - Events in category
 */
export const getKenyaEventsByCategory = (category) => {
  return kenyaEvents.filter(event => event.category === category);
};

/**
 * Get all Kenya events sorted by date
 * @returns {Array} - All events sorted chronologically
 */
export const getAllKenyaEvents = () => {
  return [...kenyaEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Search Kenya events by keyword
 * @param {string} query - Search term
 * @returns {Array} - Matching events
 */
export const searchKenyaEvents = (query) => {
  const lowerQuery = query.toLowerCase();
  return kenyaEvents.filter(event => 
    event.title.toLowerCase().includes(lowerQuery) ||
    event.description.toLowerCase().includes(lowerQuery)
  );
};

// Export the full dataset for potential future use
export default kenyaEvents;