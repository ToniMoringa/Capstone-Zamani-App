import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCapsules, deleteCapsule } from '../api/capsules';
import TVFrame from '../components/TVFrame';
import { formatDate } from '../utils/helpers';
import '../styles/saved.css';

const Saved = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCapsules = async () => {
      try {
        setLoading(true);
        const data = await getCapsules();
        setCapsules(data);
      } catch (err) {
        console.error('Failed to fetch capsules:', err);
        setError('No signal detected. Backend may be offline.');
      } finally {
        setLoading(false);
      }
    };
    loadCapsules();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this capsule?')) return;
    try {
      await deleteCapsule(id);
      setCapsules(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete capsule');
    }
  };

  if (loading) {
    return (
      <TVFrame brand="ZAMANI ARCHIVE">
        <div className="saved-container">
          <p>Loading archive...</p>
        </div>
      </TVFrame>
    );
  }

  if (error) {
    return (
      <TVFrame brand="ZAMANI ARCHIVE">
        <div className="saved-container">
          <p>{error}</p>
        </div>
      </TVFrame>
    );
  }

  return (
    <TVFrame brand="ZAMANI ARCHIVE">
      <div className="saved-container">
        <header className="saved-header">
          <h1>Saved Capsules</h1>
          <p>{capsules.length} entries in your archive</p>
        </header>

        {capsules.length === 0 ? (
          <div className="empty-archive">
            <p>No saved capsules yet.</p>
            <Link to="/" className="browse-link">
              Browse History →
            </Link>
          </div>
        ) : (
          <div className="saved-grid">
            {capsules.map((capsule) => (
              <div key={capsule.id} className="saved-card-wrapper" style={{ position: 'relative' }}>
                <Link
                  to={`/capsule/${capsule.date}/${capsule.category === 'event' ? 'kenya' : 'global'}`}
                  className="saved-card"
                >
                  <span className="saved-mode">
                    {capsule.category === 'event' ? '🇰🇪 KENYA' : '🌐 GLOBAL'}
                  </span>
                  <h2>{formatDate(capsule.date, 'full')}</h2>
                  <p>{capsule.title}</p>
                  <span className="saved-date">
                    {new Date(capsule.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </Link>
                <button
                  onClick={() => handleDelete(capsule.id)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(255,0,0,0.2)',
                    border: '1px solid red',
                    color: 'red',
                    padding: '0.25rem 0.5rem',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    zIndex: 2
                  }}
                >
                  DELETE
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </TVFrame>
  );
};

export default Saved;