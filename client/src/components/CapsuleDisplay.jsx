import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TVFrame from './TVFrame';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import SaveButton from './SaveButton';
import { fetchWikipediaEvents } from '../api/wikipedia';
import { fetchNASAAPOD } from '../api/nasa';
import { getKenyaEventsByDate } from '../api/kenyaData';
import { extractMonthDay, formatDate } from '../utils/helpers';
import '../styles/capsule.css';

/**
 * CapsuleDisplay Component
 * Fetches and renders time capsule content based on date and mode.
 * Handles Global (Wiki + NASA) and Kenya (Local events + Wiki) modes.
 */
const CapsuleDisplay = () => {
  const { date, mode } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    wiki: { events: [], births: [] },
    nasa: null,
    kenya: []
  });

  useEffect(() => {
    const loadCapsuleData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { month, day } = extractMonthDay(date);
        
        // Parallel fetching for performance
        const promises = [
          fetchWikipediaEvents(month, day),
          mode === 'global' ? fetchNASAAPOD(date) : Promise.resolve(null),
          mode === 'kenya' ? Promise.resolve(getKenyaEventsByDate(date)) : Promise.resolve([])
        ];

        const [wikiRes, nasaRes, kenyaRes] = await Promise.all(promises);

        // Check for critical errors in Wikipedia response
        if (wikiRes.error) throw new Error(wikiRes.error);

        setData({
          wiki: wikiRes,
          nasa: nasaRes,
          kenya: kenyaRes || []
        });

      } catch (err) {
        console.error('Capsule fetch error:', err);
        setError(err.message || 'Failed to load capsule data');
      } finally {
        // Artificial delay for smooth "tuning in" effect
        setTimeout(() => setLoading(false), 800);
      }
    };

    if (date) loadCapsuleData();
  }, [date, mode]);

  // Render Loading State
  if (loading) {
    return (
      <TVFrame brand="ZAMANI BROADCAST">
        <div className="capsule-loading">
          <LoadingSpinner />
          <p className="tuning-text">TUNING SIGNAL...</p>
          <p className="date-display">{formatDate(date, 'full')}</p>
        </div>
      </TVFrame>
    );
  }

  // Render Error State
  if (error) {
    return (
      <TVFrame brand="ZAMANI BROADCAST">
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </TVFrame>
    );
  }

  const hasNoData = 
    data.wiki.events.length === 0 && 
    data.wiki.births.length === 0 && 
    (mode === 'kenya' ? data.kenya.length === 0 : !data.nasa?.url);

  return (
    <TVFrame brand={`ZAMANI • ${mode.toUpperCase()} MODE`}>
      <div className="capsule-container">
        {/* Header Section */}
        <header className="capsule-header">
          <div className="header-meta">
            <span className="broadcast-tag">ON THIS DAY</span>
            <SaveButton date={date} mode={mode} />
          </div>
          <h1 className="capsule-date">{formatDate(date, 'full')}</h1>
          <div className="mode-indicator">
            {mode === 'global' ? '🌍 GLOBAL ARCHIVE' : '🇰🇪 KENYA ARCHIVE'}
          </div>
        </header>

        {/* Empty State */}
        {hasNoData && (
          <div className="empty-state">
            <p>NO SIGNAL DETECTED FOR THIS DATE</p>
            <p className="subtext">Try selecting another date or switching modes.</p>
          </div>
        )}

        {/* Content Grid */}
        {!hasNoData && (
          <div className="capsule-grid">
            
            {/* NASA Section (Global Mode Only) */}
            {mode === 'global' && data.nasa?.url && (
              <section className="nasa-section">
                <h2 className="section-title">ASTRONOMY PICTURE OF THE DAY</h2>
                <div className="nasa-card">
                  <div className="image-wrapper">
                    <img 
                      src={data.nasa.url} 
                      alt={data.nasa.title} 
                      loading="lazy"
                    />
                  </div>
                  <div className="nasa-info">
                    <h3>{data.nasa.title}</h3>
                    <p className="explanation">{data.nasa.explanation}</p>
                    {data.nasa.copyright && (
                      <span className="copyright">© {data.nasa.copyright}</span>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Kenya Events Section (Kenya Mode Only) */}
            {mode === 'kenya' && data.kenya.length > 0 && (
              <section className="kenya-section">
                <h2 className="section-title">KENYAN HISTORY</h2>
                <div className="events-list">
                  {data.kenya.map((event, idx) => (
                    <article key={idx} className="event-card kenya-card">
                      <span className="event-category">{event.category}</span>
                      <h3>{event.title}</h3>
                      <p>{event.description}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Wikipedia Events */}
            {data.wiki.events.length > 0 && (
              <section className="wiki-section">
                <h2 className="section-title">HISTORICAL EVENTS</h2>
                <div className="events-list">
                  {data.wiki.events.slice(0, 5).map((event, idx) => (
                    <article key={idx} className="event-card">
                      <span className="event-year">{event.year}</span>
                      <p className="event-text">{event.text}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Famous Births */}
            {data.wiki.births.length > 0 && (
              <section className="births-section">
                <h2 className="section-title">NOTABLE BIRTHS</h2>
                <div className="births-grid">
                  {data.wiki.births.slice(0, 6).map((person, idx) => (
                    <div key={idx} className="birth-card">
                      <span className="birth-year">{person.year}</span>
                      <strong>{person.name}</strong>
                      <p className="birth-desc">{person.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </TVFrame>
  );
};

export default CapsuleDisplay;