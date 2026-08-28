import { useEffect, useRef } from 'react';

// Using reliable CC0 sound sources from Freesound/ZapSplat archives
const SOUNDS = {
  click: 'https://assets.mixkit.co/sfx/preview/mixkit-mechanical-keyboard-typing-1387.mp3',
  hover: 'https://assets.mixkit.co/sfx/preview/mixkit-ui-button-hover-click-1142.mp3',
  tune: 'https://assets.mixkit.co/sfx/preview/mixkit-old-radio-tuning-static-2675.mp3'
};

export const useRetroAudio = () => {
  const audioRefs = useRef({});

  useEffect(() => {
    // Preload all sounds on mount for instant playback
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = 0.4; // Keep it subtle so it doesn't overpower content
      audioRefs.current[key] = audio;
    });

    return () => {
      // Cleanup on unmount
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  const playSound = (type) => {
    const audio = audioRefs.current[type];
    if (audio) {
      // Clone node allows overlapping rapid clicks without cutting off previous sound
      const clone = audio.cloneNode();
      clone.volume = 0.4;
      clone.play().catch(() => {}); // Catch autoplay policy errors gracefully
    }
  };

  return { playSound };
};