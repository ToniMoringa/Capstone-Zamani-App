import React from 'react';

const TECH_ARCHIVE = [
  {
    code: 'A-01',
    title: 'Interface Layer',
    description: 'The broadcast surface users tune into.',
    items: ['React 18', 'React Router', 'Custom CSS'],
  },
  {
    code: 'A-02',
    title: 'Memory Layer',
    description: 'Keeps application state and personal archive references close at hand.',
    items: ['Context API', 'localStorage'],
  },
  {
    code: 'A-03',
    title: 'Archive Sources',
    description: 'External collections that supply historical context and visual records.',
    items: ['Wikipedia API', 'NASA APOD'],
  },
  {
    code: 'A-04',
    title: 'Time Controls',
    description: 'The tuning mechanism that turns a calendar date into an archive journey.',
    items: ['React Datepicker'],
  },
];

const TechStackArchive = () => (
  <div className="tech-archive" aria-label="ZAMANI technology archive">
    <div className="tech-archive-register">
      <span>SYSTEM REGISTER / TC-1984</span>
      <span>08 MODULES CATALOGUED</span>
    </div>

    <div className="tech-archive-grid">
      {TECH_ARCHIVE.map((group) => (
        <article className="tech-archive-card" key={group.code}>
          <div className="tech-card-spine" aria-hidden="true">
            <span>{group.code}</span>
          </div>

          <div className="tech-card-content">
            <div className="tech-card-heading">
              <div>
                <span className="tech-card-kicker">CATALOGUE {group.code}</span>
                <h3>{group.title}</h3>
              </div>
              <span className="tech-card-stamp">PRESERVED</span>
            </div>

            <p>{group.description}</p>

            <ul className="tech-module-list">
              {group.items.map((item) => (
                <li key={item}>
                  <span className="tech-module-marker" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  </div>
);

export default TechStackArchive;
