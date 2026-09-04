import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthControls from './AuthControls';
import { useAuth } from '../context/AuthContext';
import { useTVSystem } from '../context/TVSystemContext';
import { getCapsules } from '../api/capsules';
import '../styles/tv.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faTowerBroadcast,
  faFloppyDisk,
  faCircleInfo,
  faFilm,
  faPowerOff,
} from '@fortawesome/free-solid-svg-icons';

const NAV_ITEMS = [
  { label: 'Home', path: '/', icon: faHouse },
  { label: 'Tune', path: '/', state: { focusDate: true }, icon: faTowerBroadcast },
  { label: 'Saved', path: '/saved', icon: faFloppyDisk },
  { label: 'About', path: '/about', icon: faCircleInfo },
];

const getPageLabel = (pathname) => {
  if (pathname.startsWith('/capsule/')) return 'TUNED ARCHIVE';
  if (pathname.startsWith('/saved')) return 'SAVED CAPSULES';
  if (pathname.startsWith('/profile')) return 'ARCHIVIST PROFILE';
  if (pathname.startsWith('/help')) return 'OPERATOR MANUAL';
  if (pathname.startsWith('/about')) return 'ABOUT';
  return 'HOME';
};

const TVFrame = ({ children, className = '', model = 'TIME CAPSULE' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const seedDatesRef = useRef(null);

  const {
    powerState,
    powerOn,
    powerOff,
    vhsEnabled,
    toggleVhs,
    highContrast,
    toggleHighContrast,
  } = useTVSystem();

  const isPoweredOn = powerState === 'on';
  const isBooting = powerState === 'booting';

  const isActive = (path, label) => {
    if (label === 'Tune') {
      return location.pathname.startsWith('/capsule/');
    }

    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname.startsWith(path);
  };

  const handleNav = (item) => {
    if (!isPoweredOn) return;
    navigate(item.path, { state: item.state });
  };

  const handleTune = async () => {
    if (!isPoweredOn) return;
    try {
      if (!seedDatesRef.current) {
        const all = await getCapsules();
        seedDatesRef.current = (all || []).map((c) => c.date);
      }
    } catch {
      seedDatesRef.current = [];
    }

    const seeds = seedDatesRef.current || [];
    const useSeed = seeds.length > 0 && Math.random() < 0.5;

    if (useSeed) {
      const date = seeds[Math.floor(Math.random() * seeds.length)];
      navigate(`/capsule/${date}/kenya`);
      return;
    }

    const start = new Date('1900-01-01').getTime();
    const date = new Date(start + Math.random() * (Date.now() - start))
      .toISOString()
      .split('T')[0];
    navigate(`/capsule/${date}/global`);
  };

  const handleBack = () => {
    if (!isPoweredOn) return;
    window.history.length > 1 ? navigate(-1) : navigate('/');
  };

  const handlePower = () => {
    if (isPoweredOn) {
      powerOff();
      return;
    }
    if (powerState === 'off') powerOn(() => navigate('/'));
  };

  return (
    <div className={`tv-perspective-container ${highContrast ? 'high-contrast' : ''}`}>
      <div className={`tv-frame tv-${powerState} ${className}`}>
        <div className="tv-cabinet-highlight" aria-hidden="true" />

        <div className="tv-model-row">
          <span className="tv-model-dot" aria-hidden="true" />
          <span>{model}</span>
          <span className="tv-model-number">TC-1984</span>
        </div>

        <div className="tv-screen-bezel">
          <div className={`tv-screen ${vhsEnabled ? 'vhs-enabled' : 'vhs-disabled'}`}>
            {powerState === 'off' && (
              <div className="tv-off-screen">
                <span className="standby-pixel" aria-hidden="true" />
                <p>STANDBY</p>
                <span>PRESS POWER TO START</span>
              </div>
            )}

            {isBooting && (
              <div className="tv-boot-sequence">
                <div className="boot-static" />
                <div className="boot-beam" />
                <div className="boot-copy">
                  <strong>ZAMANI</strong>
                  <span>TIME CAPSULE</span>
                  <small>WARMING UP SIGNAL...</small>
                </div>
              </div>
            )}

            {isPoweredOn && (
              <>
                <header className="tv-screen-header">
                  {location.pathname !== '/' && (
                    <button type="button" className="screen-back-button" onClick={handleBack} aria-label="Go back">
                      ←
                    </button>
                  )}
                  <span className="screen-page-label">{getPageLabel(location.pathname)}</span>
                  <AuthControls />
                  <button
                    type="button"
                    className={`contrast-toggle ${highContrast ? 'active' : ''}`}
                    onClick={toggleHighContrast}
                    aria-label="Toggle high contrast"
                    aria-pressed={highContrast}
                  >
                    <span className="contrast-icon" aria-hidden="true">◐</span>
                    <span className="contrast-label">CONTRAST</span>
                  </button>
                </header>

                <div className="tv-screen-glow" aria-hidden="true" />
                <div className="tv-content">{children}</div>

                {vhsEnabled && (
                  <div className="tv-vhs-effects" aria-hidden="true">
                    <div className="vhs-noise" />
                    <div className="vhs-tracking-line" />
                    <div className="vhs-scanlines" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="tv-console">
          <div className="tv-brand" aria-label="Zamani">ZAMANI</div>

          <nav className="tv-controls" aria-label="Time Capsule controls">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`tv-control-button ${isActive(item.path, item.label) ? 'active' : ''}`}
                onClick={() => (item.label === 'Tune' ? handleTune() : handleNav(item))}
                aria-label={item.label}
                aria-current={isPoweredOn && isActive(item.path, item.label) ? 'page' : undefined}
                disabled={!isPoweredOn || (item.label === 'Saved' && !isAuthenticated)}
              >
                <FontAwesomeIcon icon={item.icon} className="control-icon" />
                <span className="control-label">{item.label}</span>
              </button>
            ))}

            <button
              type="button"
              className={`tv-control-button tv-vhs-button ${vhsEnabled ? 'vhs-on' : ''}`}
              onClick={toggleVhs}
              aria-label={vhsEnabled ? 'Disable VHS effect' : 'Enable VHS effect'}
              aria-pressed={vhsEnabled}
              disabled={!isPoweredOn}
            >
              <FontAwesomeIcon icon={faFilm} className="control-icon" />
              <span className="control-label">VHS</span>
            </button>

            <div className="tv-status" aria-label={`Television ${powerState}`}>
              <span className={`status-light status-${powerState}`} />
              <span className="status-copy">{isBooting ? 'WAIT' : isPoweredOn ? 'ON' : 'OFF'}</span>
            </div>

            <button
              type="button"
              className={`tv-power-button ${isPoweredOn ? 'powered' : ''}`}
              aria-label={isPoweredOn ? 'Power off television' : 'Power on television'}
              onClick={handlePower}
              disabled={isBooting}
            >
              <FontAwesomeIcon icon={faPowerOff} />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TVFrame;