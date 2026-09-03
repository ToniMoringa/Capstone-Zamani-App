import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import TVFrame from '../components/TVFrame';
import DatePickerComponent from '../components/DatePicker';

const Home = () => {
  const location = useLocation();
  const pickerRef = useRef(null);

  useEffect(() => {
    if (location.state?.focusDate) {
      pickerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [location.state]);

  return (
    <div className="home-page">
      <TVFrame brand="ZAMANI" model="TIME CAPSULE">
        <main className="home-broadcast">
          <section className="home-copy">
            <div className="broadcast-kicker">
              <span className="live-dot" aria-hidden="true" />
              ARCHIVE SIGNAL / 001
            </div>

            <p className="home-eyebrow">A WINDOW INTO THEN</p>
            <h1>
              Tune into <span>history.</span>
            </h1>
            <p className="home-intro">
              Pick a date and travel through global and Kenyan moments, people,
              stories and visual archives.
            </p>

            <div ref={pickerRef} className="home-picker-panel">
              <DatePickerComponent />
            </div>
          </section>

          <aside className="home-image-placeholder" aria-label="Homepage image placeholder">
            <div className="placeholder-grid" aria-hidden="true" />
            <div className="placeholder-content">
              <span className="placeholder-index">IMG / 01</span>
              <div className="placeholder-frame" aria-hidden="true">
                <span>+</span>
              </div>
              <strong>YOUR IMAGE HERE</strong>
              <p>Replace this block with your preferred time-capsule imagery.</p>
            </div>
          </aside>
        </main>
      </TVFrame>
    </div>
  );
};

export default Home;
