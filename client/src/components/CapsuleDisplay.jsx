import { fetchCapsuleData } from '../api/wikipedia';
import { fetchVisualArtifact } from '../api/nasa';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TVFrame from './TVFrame';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import SaveButton from './SaveButton';
import { formatDate } from '../utils/helpers';
import '../styles/capsule.css';

const CapsuleDisplay = () => {
  const { date, mode } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    events: [],
    births: [],
    visual: null,
  });

  useEffect(() => {
    const loadCapsuleData = async () => {
      setLoading(true);
      setError(null);
      try {
        const capsuleData = await fetchCapsuleData(date, mode);

        if (capsuleData.source === 'error') {
          throw new Error(capsuleData.error || 'Archive unavailable');
        }

        const allItems = [...capsuleData.events, ...capsuleData.births];
        const visual = await fetchVisualArtifact(allItems);

        setData({
          events: capsuleData.events,
          births: capsuleData.births,
          visual: visual,
        });
      } catch (err) {
        console.error('Broadcast Error:', err);
        setError(err.message || 'Signal Lost: Unable to retrieve archive.');
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    if (date) loadCapsuleData();
  }, [date, mode]);

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

  if (error) {
    return (
      <TVFrame brand="ZAMANI BROADCAST">
        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
        />
      </TVFrame>
    );
  }

  const hasNoData = data.events.length === 0 && data.births.length === 0;

  return (
    <TVFrame brand={`ZAMANI • ${mode.toUpperCase()} MODE`}>
      <div className="capsule-container">
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

        {hasNoData && (
          <div className="empty-state">
            <p>NO SIGNAL DETECTED</p>
            <p className="subtext">
              {mode === 'kenya'
                ? 'No Kenyan records found for this date in our archive.'
                : 'Try selecting another date or switching modes.'}
            </p>
          </div>
        )}

        {!hasNoData && (
          <div className="capsule-grid">
            {data.visual?.url && (
              <section className="nasa-section">
                <h2 className="section-title">VISUAL ARTIFACT</h2>
                <div className="nasa-card">
                  <div className="image-wrapper">
                    <img
                      src={data.visual.url}
                      alt={data.visual.title}
                      loading="lazy"
                      referrerPolicy={
                        data.visual.referrerPolicy || 'no-referrer'
                      }
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML =
                          '<div class="placeholder-text">IMAGE UNAVAILABLE</div>';
                      }}
                    />
                  </div>
                  <div className="nasa-info">
                    <h3>{data.visual.title}</h3>
                    <p className="explanation">{data.visual.explanation}</p>
                  </div>
                </div>
              </section>
            )}

            {data.events.length > 0 && (
              <section className="wiki-section">
                <h2 className="section-title">HISTORICAL EVENTS</h2>
                <div className="events-list">
                  {data.events.slice(0, 5).map((event, idx) => (
                    <article key={idx} className="event-card">
                      <span className="event-year">
                        {event.year || event.date}
                      </span>
                      <p className="event-text">
                        {event.text || event.description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {data.births.length > 0 && (
              <section className="births-section">
                <h2 className="section-title">NOTABLE BIRTHS</h2>
                <div className="births-grid">
                  {data.births.slice(0, 6).map((person, idx) => (
                    <div key={idx} className="birth-card">
                      <span className="birth-year">
                        {person.year || person.date}
                      </span>
                      <strong>{person.name || person.title}</strong>
                      <p className="birth-desc">
                        {person.text || person.description}
                      </p>
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
