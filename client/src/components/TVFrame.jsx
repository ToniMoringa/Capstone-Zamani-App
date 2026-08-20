import React from 'react';
import '../styles/tv.css';

const TVFrame = ({ children, className = '', brand = 'ZAMANI' }) => {
  return (
    <div className="tv-perspective-container">
      <div className={`tv-frame ${className}`}>
        {/* Outer glow effect */}
        <div className="tv-glow" aria-hidden="true" />

        {/* TV Screen */}
        <div className="tv-screen">
          {/* Content area */}
          <div className="tv-content">{children}</div>
        </div>

        {/* Brand label below screen */}
        {brand && (
          <div className="tv-brand" aria-label="TV brand">
            {brand}
          </div>
        )}
      </div>
    </div>
  );
};

export default TVFrame;