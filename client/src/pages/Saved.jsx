import React from 'react';
import { Link } from 'react-router-dom';
import TVFrame from '../components/TVFrame';
import { useCapsuleContext } from '../context/CapsuleContext';
import { formatDate } from '../utils/helpers';
import '../styles/saved.css';

const Saved = () => {
  const { savedCapsules } = useCapsuleContext();

  return (
    <TVFrame brand="ZAMANI ARCHIVE">
      <div className="saved-container">
        <header className="saved-header">
          <h1>Saved Capsules</h1>
          <p>{savedCapsules.length} entries in your archive</p>
        </header>

        {savedCapsules.length === 0 ? (
          <div className="empty-archive">
            <p>No saved capsules yet.</p>
            <Link to="/" className="browse-link">
              Browse History →
            </Link>
          </div>
        ) : (
          <div className="saved-grid">
            {savedCapsules.map((capsule, idx) => (
              <Link
                key={idx}
                to={`/capsule/${capsule.date}/${capsule.mode}`}
                className="saved-card"
              >
                <span className="saved-mode">
                  {capsule.mode === 'global' ? '🌐 GLOBAL' : '🇰🇪 KENYA'}
                </span>
                <h2>{formatDate(capsule.date, 'full')}</h2>
                <span className="saved-date">
                  {new Date(capsule.savedAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </TVFrame>
  );
};

export default Saved;
