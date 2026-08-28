import React from 'react';
import { useOrbCursor } from '../hooks/useOrbCursor';

const OrbCursor = () => {
  const { isEnabled } = useOrbCursor();
  if (!isEnabled) return null;

  return (
    <div
      id="zamani-orb"
      style={{
        position: 'fixed', top: 0, left: 0, width: '32px', height: '32px',
        borderRadius: '50%', 
        border: '2px solid rgba(0, 255, 255, 0.9)',
        background: 'radial-gradient(circle, rgba(0,255,255,0.2) 0%, transparent 70%)',
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.6), inset 0 0 12px rgba(0, 255, 255, 0.3)',
        pointerEvents: 'none', zIndex: 9999, opacity: 0, willChange: 'transform',
        transition: 'transform 0.1s ease-out, border-color 0.2s ease',
      }}
    />
  );
};

export default OrbCursor;