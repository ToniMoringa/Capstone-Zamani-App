import React from 'react';
import { useOrbCursor } from '../hooks/useOrbCursor';
import { useTVSystem } from '../context/TVSystemContext';

const OrbCursor = () => {
  const { isEnabled } = useOrbCursor();
  const { highContrast } = useTVSystem();
  if (!isEnabled) return null;

  const accent = highContrast ? '#FFBE5C' : '#C76A3A';
  const glow = highContrast ? 'rgba(255, 190, 92, 0.30)' : 'rgba(199, 106, 58, 0.24)';

  return (
    <div
      id="zamani-orb"
      style={{
        position: 'fixed', top: 0, left: 0, width: '32px', height: '32px',
        borderRadius: '50%',
        border: `2px solid ${accent}`,
        background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
        boxShadow: `0 0 20px ${glow}, inset 0 0 12px ${glow}`,
        pointerEvents: 'none', zIndex: 9999, opacity: 0, willChange: 'transform',
        transition: 'transform 0.1s ease-out, border-color 0.2s ease',
      }}
    />
  );
};

export default OrbCursor;
