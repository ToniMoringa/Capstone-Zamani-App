import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTVSystem } from '../context/TVSystemContext';
import '../styles/tv.css';

const NAV_ITEMS = [
  { label: 'Home', shortLabel: 'HM', path: '/' },
  { label: 'Tune', shortLabel: 'CH', path: '/', state: { focusDate: true } },
  { label: 'Saved', shortLabel: 'SV', path: '/saved' },
  { label: 'About', shortLabel: 'IN', path: '/about' },
];

const getPageLabel = (pathname) => {
  if (pathname.startsWith('/capsule/')) return 'TUNED ARCHIVE';
  if (pathname.startsWith('/saved')) return 'SAVED CAPSULES';
  if (pathname.startsWith('/about')) return 'ABOUT';
  return 'HOME';
};

const TVFrame = ({ children, className = '', model = 'TIME CAPSULE' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { powerState, powerOn, powerOff, vhsEnabled, toggleVhs } = useTVSystem();
  const isPoweredOn = powerState === 'on';
  const isBooting = powerState === 'booting';

  const isActive = (path, label) => {
    if (label === 'Tune') return location.pathname.startsWith('/capsule/');
    if (path === '/') return location.pathname === '/' && label === 'Home';
    return location.pathname.startsWith(path);
  };

  const handleNav = (item) => {
    if (!isPoweredOn) return;
    navigate(item.path, { state: item.state });
  };

  const handleBack = () => {
    if (!isPoweredOn) return;

    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handlePower = () => {
    if (isPoweredOn) {
      powerOff();
      return;
    }

    if (powerState === 'off') {
      powerOn(() => navigate('/'));
    }
  };

  return (
    <div className="tv-perspective-container">
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
              <div className="tv-off-screen" aria-live="polite">
                <span className="standby-pixel" aria-hidden="true" />
                <p>STANDBY</p>
                <span>PRESS POWER TO START</span>
              </div>
            )}

            {isBooting && (
              <div className="tv-boot-sequence" aria-live="polite">
                <div className="boot-static" aria-hidden="true" />
                <div className="boot-beam" aria-hidden="true" />
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
                    <button
                      type="button"
                      className="screen-back-button"
                      onClick={handleBack}
                      aria-label="Go back"
                    >
                      <span aria-hidden="true">←</span>
                    </button>
                  )}
                  <span className="screen-page-label">{getPageLabel(location.pathname)}</span>
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
          <div className="tv-brand" aria-label="Project name">ZAMANI</div>

          <nav className="tv-controls" aria-label="Time Capsule controls">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`tv-control-button ${isActive(item.path, item.label) ? 'active' : ''}`}
                onClick={() => handleNav(item)}
                aria-label={item.label}
                aria-current={isPoweredOn && isActive(item.path, item.label) ? 'page' : undefined}
                disabled={!isPoweredOn}
              >
                <span className="control-short">{item.shortLabel}</span>
                <span className="control-label">{item.label}</span>
              </button>
            ))}

            <button
              type="button"
              className={`tv-control-button tv-vhs-button ${vhsEnabled ? 'active' : ''}`}
              onClick={toggleVhs}
              aria-label={`${vhsEnabled ? 'Disable' : 'Enable'} VHS effect`}
              aria-pressed={vhsEnabled}
              disabled={!isPoweredOn}
            >
              <span className="control-short">VHS</span>
              <span className="control-label">FX</span>
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
              <span aria-hidden="true">⏻</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TVFrame;
