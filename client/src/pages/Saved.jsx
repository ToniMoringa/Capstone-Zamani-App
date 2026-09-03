import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import TVFrame from '../components/TVFrame';

import {
  getMyCapsules,
  createCapsule,
  updateCapsule,
  deleteCapsule,
} from '../api/capsules';

import { formatDate } from '../utils/helpers';

import '../styles/saved.css';

const EMPTY_FORM = {
  title: '',
  date: '',
  description: '',
  personal_note: '',
};

const Saved = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const loadCapsules = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getMyCapsules();
      setCapsules(data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Could not load your personal capsules.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCapsules();
  }, []);

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      openCreateForm();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

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
      personal_note: capsule.personal_note || '',
    });

    setEditingId(capsule.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError('');

    try {
      if (editingId) {
        const updated = await updateCapsule(editingId, form);

        setCapsules((prev) =>
          prev.map((capsule) =>
            capsule.id === editingId ? updated : capsule
          )
        );
      } else {
        const created = await createCapsule({
          ...form,
          category: 'personal_memory',
        });

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
      setCapsules((prev) => prev.filter((capsule) => capsule.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Could not delete capsule.');
    }
  };

  return (
    <TVFrame model="PERSONAL CAPSULES">
      <div className="saved-container">
        <header className="saved-header">
          <h1>My Capsules</h1>
          <p>{capsules.length} personal archive entries</p>
        </header>

        <div className="saved-toolbar">
          <button type="button" className="quick-btn" onClick={openCreateForm}>
            + NEW MEMORY
          </button>

          <button type="button" className="quick-btn" onClick={loadCapsules}>
            REFRESH
          </button>
        </div>

        {error && (
          <div className="error-container">
            <p>{error}</p>
          </div>
        )}

        {showForm && (
          <form className="saved-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Capsule title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="What happened on this date?"
              value={form.description}
              onChange={handleChange}
              required
            />

            <textarea
              name="personal_note"
              placeholder="Personal note, optional"
              value={form.personal_note}
              onChange={handleChange}
            />

            <div className="saved-form-actions">
              <button
                type="submit"
                className="mode-btn active"
                disabled={saving}
              >
                {saving ? 'SAVING...' : editingId ? 'UPDATE' : 'CREATE'}
              </button>

              <button
                type="button"
                className="mode-btn"
                onClick={closeForm}
              >
                CANCEL
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p>LOADING PERSONAL ARCHIVE...</p>
        ) : capsules.length === 0 ? (
          <div className="empty-archive">
            <p>No personal capsules yet.</p>
            <button
              type="button"
              className="browse-link"
              onClick={openCreateForm}
            >
              Create your first capsule
            </button>
          </div>
        ) : (
          <div className="saved-grid">
            {capsules.map((capsule) => (
              <article key={capsule.id} className="saved-card">
                <span className="saved-mode">PERSONAL</span>

                <h2>{capsule.title}</h2>

                <span className="saved-date">
                  {formatDate(capsule.date, 'full')}
                </span>

                <p>{capsule.description}</p>

                {capsule.personal_note && (
                  <p>
                    <strong>Note:</strong> {capsule.personal_note}
                  </p>
                )}

                <div className="saved-card-actions">
                  <button
                    type="button"
                    onClick={() => openEditForm(capsule)}
                  >
                    EDIT
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(capsule.id)}
                  >
                    DELETE
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </TVFrame>
  );
};

export default Saved;