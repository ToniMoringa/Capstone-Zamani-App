import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CapsuleProvider } from './context/CapsuleContext';
import { TVSystemProvider } from './context/TVSystemContext';
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
Object.values(SOUNDS).forEach((sound) => {
  sound.preload = 'auto';
  sound.volume = 0.4;
});

export default function App() {
  useEffect(() => {
    const handleClick = (event) => {
      if (event.target.closest('button, a, .clickable')) {
        SOUNDS.click.cloneNode().play().catch(() => {});
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <Router>
      <TVSystemProvider>
        <CapsuleProvider>
          <OrbCursor />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/capsule/:date/:mode" element={<Capsule />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </CapsuleProvider>
      </TVSystemProvider>
    </Router>
  );
}
