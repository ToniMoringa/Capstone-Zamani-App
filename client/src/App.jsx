import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CapsuleProvider } from './context/CapsuleContext';
import Home from './pages/Home';
import Capsule from './pages/Capsule';
import Saved from './pages/Saved';
import About from './pages/About';
import './App.css';

export default function App() {
  return (
    <Router>
      <CapsuleProvider>
        <div className="app">
          <svg
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              pointerEvents: 'none',
            }}
          >
            <filter id="crt-fisheye-warp">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.02"
                numOctaves="1"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="15"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </svg>

          <div className="crt-overlay"></div>
          <div className="film-grain"></div>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/capsule/:date/:mode" element={<Capsule />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </CapsuleProvider>
    </Router>
  );
}
