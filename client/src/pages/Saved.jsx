import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import TVFrame from '../components/TVFrame';
import { getMyCapsules, createCapsule, updateCapsule, deleteCapsule } from '../api/capsules';
import { formatDate } from '../utils/helpers';
import '../styles/saved.css';

const EMPTY_FORM = { title: '', date: '', description: '', personal_note: '' };

const Saved = () => {
  // --- STATE FOR PERSONAL CAPSULES (DATABASE) ---
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // --- STATE FOR SAVED HISTORY (LOCALSTORAGE) ---
  // We read directly from localStorage to avoid Context sync issues
  const [savedHistory, setSavedHistory] = useState([]);

  // Load Personal Capsules from Backend
  const loadCapsules = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMyCapsules();
      setCapsules(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load personal capsules.');
    } finally {
      setLoading(false);
    }
  };

  // Load Saved History from LocalStorage
  const loadHistory = () => {
    try {
      const stored = localStorage.getItem('zamani_saved_capsules');
      if (stored) {
        setSavedHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse saved history", e);
    }
  };

  useEffect(() => {
    loadCapsules();
    loadHistory(); // Load history on mount
  }, []);

  // Handle "New Memory" param from URL
  useEffect(() => {
    if (searchParams.get('new') === '1') {
      openCreateForm();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const openCreateForm = () => { 
    setForm(EMPTY_FORM); 
    setEditingId(null); 
    setShowForm(true); 
  };
  
  const openEditForm = (capsule) => {
    setForm({ 
      title: capsule.title, 
      date: capsule.date, 
      description: capsule.description, 
      personal_note: capsule.personal_note || '' 
    });
    setEditingId(capsule.id);
    setShowForm(true);
  };
  
  const closeForm = () => { 
    setShowForm(false); 
    setEditingId(null); 
    setForm(EMPTY_FORM); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        const updated = await updateCapsule(editingId, form);
        setCapsules((prev) => prev.map((c) => c.id === editingId ? updated : c));
      } else {
        const created = await createCapsule({ ...form, category: 'personal_memory' });
        setCapsules((prev) => [created, ...prev]);
      }
      closeForm();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save capsule.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this personal capsule?')) return;
    try {
      await deleteCapsule(id);
      setCapsules((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Could not delete capsule.');
    }
  };

  // Remove from LocalStorage History
  const handleRemoveHistory = (date, mode) => {
    const stored = localStorage.getItem('zamani_saved_capsules');
    if (stored) {
      const list = JSON.parse(stored);
      const newList = list.filter(item => !(item.date === date && item.mode === mode));
      localStorage.setItem('zamani_saved_capsules', JSON.stringify(newList));
      setSavedHistory(newList); // Update UI immediately
    }
  };

  return (
    <TVFrame brand="ZAMANI ARCHIVE" model="PERSONAL CAPSULES">
      <div className="saved-container">
        <header className="saved-header">
          <h1>My Capsules</h1>
          <p>{capsules.length} personal entries • {savedHistory.length} archived dates</p>
        </header>

        <div className="saved-toolbar">
          <button type="button" className="quick-btn" onClick={openCreateForm}>+ NEW MEMORY</button>
          <button type="button" className="quick-btn" onClick={() => { loadCapsules(); loadHistory(); }}>REFRESH</button>
        </div>

        {error && <div className="error-container"><p>{error}</p></div>}

        {showForm && (
          <form className="saved-form" onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder="Capsule title" value={form.title} onChange={handleChange} required />
            <input type="date" name="date" value={form.date} onChange={handleChange} required />
            <textarea name="description" placeholder="What happened on this date?" value={form.description} onChange={handleChange} required />
            <textarea name="personal_note" placeholder="Personal note (optional)" value={form.personal_note} onChange={handleChange} />
            <div className="saved-form-actions">
              <button type="submit" className="mode-btn active" disabled={saving}>{saving ? 'SAVING...' : editingId ? 'UPDATE' : 'CREATE'}</button>
              <button type="button" className="mode-btn" onClick={closeForm}>CANCEL</button>
            </div>
          </form>
        )}

        {loading ? (
          <p>LOADING PERSONAL ARCHIVE...</p>
        ) : (
          <>
            {/* SECTION 1: PERSONAL CAPSULES (DATABASE) */}
            {capsules.length > 0 && (
              <div className="saved-grid">
                {capsules.map((capsule) => (
                  <article key={capsule.id} className="saved-card">
                    <span className="saved-mode">PERSONAL</span>
                    <h2>{capsule.title}</h2>
                    <span className="saved-date">{formatDate(capsule.date, 'full')}</span>
                    <p>{capsule.description}</p>
                    {capsule.personal_note && <p><strong>Note:</strong> {capsule.personal_note}</p>}
                    <div className="saved-card-actions">
                      <button type="button" onClick={() => openEditForm(capsule)}>EDIT</button>
                      <button type="button" className="danger" onClick={() => handleDelete(capsule.id)}>DELETE</button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* SECTION 2: SAVED HISTORY (LOCALSTORAGE) */}
            <h2 className="saved-section-title" style={{ marginTop: '2rem', borderBottom: '1px solid var(--ui-border)', paddingBottom: '0.5rem' }}>
              📌 SAVED FROM ARCHIVE ({savedHistory.length})
            </h2>
            
            {savedHistory.length === 0 ? (
              <p className="saved-hint">No archived dates yet. Go to Home, pick a date, and click ★ SAVE.</p>
            ) : (
              <div className="saved-grid">
                {savedHistory.map((item, idx) => (
                  <article key={`${item.date}-${idx}`} className="saved-card" style={{ borderLeftColor: '#D6A14A' }}>
                    <span className="saved-mode">{item.mode === 'kenya' ? '🇰🇪 KENYA' : '🌍 GLOBAL'}</span>
                    <h2>{formatDate(item.date, 'full')}</h2>
                    <p>{item.title || 'Historical Archive Entry'}</p>
                    <div className="saved-card-actions">
                      <Link to={`/capsule/${item.date}/${item.mode}`} className="mode-btn">VIEW</Link>
                      <button type="button" className="danger" onClick={() => handleRemoveHistory(item.date, item.mode)}>REMOVE</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </TVFrame>
  );
};

export default Saved;