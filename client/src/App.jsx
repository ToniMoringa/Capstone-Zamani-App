import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { CapsuleProvider } from './context/CapsuleContext';
import OrbCursor from './components/OrbCursor';
import Home from './pages/Home';
import Capsule from './pages/Capsule';
import Saved from './pages/Saved';
import About from './pages/About';
import './App.css';

const SOUNDS = {
  click: new Audio('/audio/button-press.wav'),
  tune: new Audio('/audio/tuning.wav')
};
Object.values(SOUNDS).forEach(s => { s.preload = 'auto'; s.volume = 0.4; });

function NavArrows() {
  const navigate = useNavigate();
  const location = useLocation();
  
  if (location.pathname === '/') return null;

  const goBack = () => {
    SOUNDS.click.cloneNode().play().catch(() => {});
    navigate(-1);
  };

  return (
    <button onClick={goBack} className="nav-arrow nav-arrow-left clickable" aria-label="Go back">←</button>
  );
}

export default function App() {
  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.closest('button, a, .clickable')) {
        SOUNDS.click.cloneNode().play().catch(() => {});
      }
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <Router>
      <CapsuleProvider>
        <OrbCursor />
        <NavArrows />
        
        <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
          <filter id="crt-fisheye-warp">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        <div className="crt-overlay" />
        <div className="film-grain" />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/capsule/:date/:mode" element={<Capsule />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </CapsuleProvider>
    </Router>
  );
}