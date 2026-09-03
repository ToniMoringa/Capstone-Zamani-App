import React from 'react';
import TVFrame from '../components/TVFrame';

const Help = () => (
  <TVFrame brand="ZAMANI" model="OPERATOR MANUAL">
    <div className="about-container">
      <header className="about-header">
        <div className="about-record-line">
          <span>OPERATOR MANUAL // FIELD GUIDE</span>
          <span>TC-1984</span>
        </div>
        <h1>Help</h1>
      </header>

      <section className="about-section">
        <span className="about-section-index">01</span>
        <div className="about-section-body">
          <h2>Tune In</h2>
          <p>
            Pick a date on HOME. GLOBAL shows world events, KENYA shows the
            ZAMANI archive. CH (TUNE) surfs a random date.
          </p>
        </div>
      </section>

      <section className="about-section">
        <span className="about-section-index">02</span>
        <div className="about-section-body">
          <h2>Account</h2>
          <p>
            LOGIN to sign up or sign in. Open @username for Profile, Help and
            Logout. Logout always asks for confirmation.
          </p>
        </div>
      </section>

      <section className="about-section">
        <span className="about-section-index">03</span>
        <div className="about-section-body">
          <h2>Memories</h2>
          <p>
            + NEW MEMORY opens the notebook: date, story, private note.
            EDIT / DELETE work on your memories only. ☆ SAVE pins a date to
            your archive — pins can be viewed or removed, never edited.
          </p>
        </div>
      </section>

      <section className="about-section">
        <span className="about-section-index">04</span>
        <div className="about-section-body">
          <h2>Controls</h2>
          <p>
            CONTRAST switches high-contrast mode. VHS toggles picture effects.
          </p>
        </div>
      </section>
    </div>
  </TVFrame>
);

export default Help;