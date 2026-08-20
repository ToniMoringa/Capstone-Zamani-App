import React from 'react';
import { Link } from 'react-router-dom';
import TVFrame from '../components/TVFrame';
import DatePickerComponent from '../components/DatePicker';

const Home = () => {
  return (
    <div className="home-page" style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <TVFrame brand="ZAMANI TIME CAPSULE">
        {/* Absolute Corner Branding */}
        <div style={{ position: 'absolute', top: '20px', left: '25px', zIndex: 20, pointerEvents: 'none', textAlign: 'left' }}>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.1em', margin: 0, color: '#e0e0e0' }}>ZAMANI</h1>
          <p style={{ fontSize: '0.7rem', opacity: 0.6, letterSpacing: '0.05em', margin: 0, fontFamily: 'Space Mono, monospace' }}>KENYA'S TIME CAPSULE</p>
        </div>
        
        {/* Main Content Centered Inside TV */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', 
            marginBottom: '0.5rem',
            fontWeight: 900,
            letterSpacing: '-0.02em'
          }}>
            TUNE IN TO HISTORY
          </h2>
          <p style={{ marginBottom: '1.5rem', opacity: 0.7, fontSize: '0.9rem' }}>
            Select a date to explore global and Kenyan history...
          </p>
          
          <DatePickerComponent />
          
          <nav className="home-nav" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <Link to="/saved">View Saved Memories</Link>
            <Link to="/about">About ZAMANI</Link>
          </nav>
        </div>
      </TVFrame>
    </div>
  );
};

export default Home;