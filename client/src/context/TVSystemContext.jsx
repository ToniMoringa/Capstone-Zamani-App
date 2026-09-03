import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const TVSystemContext = createContext(null);

export const TVSystemProvider = ({ children }) => {
  const [powerState, setPowerState] = useState('off');
  const [vhsEnabled, setVhsEnabled] = useState(true);
  const bootTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (bootTimerRef.current) {
        window.clearTimeout(bootTimerRef.current);
      }
    };
  }, []);

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

  return (
    <TVSystemContext.Provider
      value={{ powerState, powerOn, powerOff, vhsEnabled, toggleVhs }}
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
