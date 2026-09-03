import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const TVSystemContext = createContext(null);

const getStoredContrastPreference = () => {
  try {
    return window.localStorage.getItem('zamani-high-contrast') === 'true';
  } catch {
    return false;
  }
};

export const TVSystemProvider = ({ children }) => {
  const [powerState, setPowerState] = useState('off');
  const [vhsEnabled, setVhsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(getStoredContrastPreference);
  const bootTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (bootTimerRef.current) {
        window.clearTimeout(bootTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('zamani-high-contrast', String(highContrast));
    } catch {
      // The preference is optional; the UI still works when storage is blocked.
    }
  }, [highContrast]);

  const powerOn = (onReady) => {
    if (powerState !== 'off') return;

    setPowerState('booting');
    bootTimerRef.current = window.setTimeout(() => {
      setPowerState('on');
      onReady?.();
    }, 1650);
  };

  const powerOff = () => {
    if (bootTimerRef.current) {
      window.clearTimeout(bootTimerRef.current);
      bootTimerRef.current = null;
    }
    setPowerState('off');
  };

  const toggleVhs = () => {
    setVhsEnabled((enabled) => !enabled);
  };

  const toggleHighContrast = () => {
    setHighContrast((enabled) => !enabled);
  };

  return (
    <TVSystemContext.Provider
      value={{
        powerState,
        powerOn,
        powerOff,
        vhsEnabled,
        toggleVhs,
        highContrast,
        toggleHighContrast,
      }}
    >
      {children}
    </TVSystemContext.Provider>
  );
};

export const useTVSystem = () => {
  const context = useContext(TVSystemContext);

  if (!context) {
    throw new Error('useTVSystem must be used within TVSystemProvider');
  }

  return context;
};
