import React from 'react';
import { useCapsuleContext } from '../context/CapsuleContext';

const SaveButton = ({ date, mode }) => {
  const { isSaved, addSavedCapsule, removeSavedCapsule } = useCapsuleContext();
  const saved = isSaved(date, mode);

  const toggleSave = () => {
    if (saved) {
      removeSavedCapsule(date, mode);
    } else {
      addSavedCapsule(date, mode);
    }
  };

  return (
    <button
      className={`save-btn ${saved ? 'saved' : ''}`}
      onClick={toggleSave}
      aria-label={saved ? 'Remove from saved' : 'Save to favorites'}
    >
      {saved ? '★ SAVED' : '☆ SAVE'}
    </button>
  );
};

export default SaveButton;
