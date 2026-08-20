import React from 'react';
import { Link } from 'react-router-dom';
import TVFrame from '../components/TVFrame';
import TechStackPhysics from '../components/TechStackPhysics';
import '../styles/about.css';

const About = () => {
  return (
    <TVFrame brand="ZAMANI BROADCAST">
      <div className="about-container">
        <header className="about-header">
          <h1>ABOUT ZAMANI</h1>
          <p className="subtitle">Kenya's Time Capsule</p>
        </header>

        <section className="about-section">
          <h2>The Mission</h2>
          <p>
            ZAMANI is a digital time capsule that lets you tune into history.
            Select any date to explore global events, notable births, NASA's
            Astronomy Picture of the Day, or curated Kenyan historical moments.
            Built as a tribute to our past and a tool for future discovery.
          </p>
        </section>

        <section className="about-section">
          <h2>Tech Stack</h2>
          <p
            style={{
              fontSize: '0.9rem',
              color: '#e7b07c',
              marginBottom: '1rem',
            }}
          >
            DRAG & THROW — EVERY TAG HERE RUNS IN PRODUCTION
          </p>

          <TechStackPhysics />
        </section>

        <section className="about-section">
          <h2>Phase Roadmap</h2>
          <div className="phase-timeline">
            <div className="phase-item active">
              <span className="phase-tag">PHASE 1</span>
              <p>React Frontend + External APIs</p>
            </div>
            <div className="phase-item">
              <span className="phase-tag">PHASE 2</span>
              <p>Flask Backend + PostgreSQL Database</p>
            </div>
            <div className="phase-item">
              <span className="phase-tag">PHASE 3</span>
              <p>User Authentication + Personal Capsules</p>
            </div>
          </div>
        </section>

        <div className="about-footer">
          <Link to="/" className="back-link">
            ← RETURN TO BROADCAST
          </Link>
        </div>
      </div>
    </TVFrame>
  );
};

export default About;
