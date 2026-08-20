import React, { createContext, useState, useContext, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

const CapsuleContext = createContext();

export const useCapsuleContext = () => useContext(CapsuleContext);

export const CapsuleProvider = ({ children }) => {
  const [savedCapsules, setSavedCapsules] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_CAPSULES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load saved capsules:', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.SAVED_CAPSULES,
      JSON.stringify(savedCapsules),
    );
  }, [savedCapsules]);

  const addSavedCapsule = (date, mode) => {
    setSavedCapsules((prev) => {
      if (prev.some((c) => c.date === date && c.mode === mode)) return prev;
      return [...prev, { date, mode, savedAt: new Date().toISOString() }];
    });
  };

  const removeSavedCapsule = (date, mode) => {
    setSavedCapsules((prev) =>
      prev.filter((c) => !(c.date === date && c.mode === mode)),
    );
  };

  const isSaved = (date, mode) => {
    return savedCapsules.some((c) => c.date === date && c.mode === mode);
  };

  return (
    <CapsuleContext.Provider
      value={{
        savedCapsules,
        addSavedCapsule,
        removeSavedCapsule,
        isSaved,
      }}
    >
      {children}
    </CapsuleContext.Provider>
  );
};