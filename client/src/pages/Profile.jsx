import React, { useState } from 'react';
import TVFrame from '../components/TVFrame';
import { useAuth } from '../context/AuthContext';
import { loadAvatar, saveAvatarFromFile, removeAvatar } from '../utils/avatar';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [avatar, setAvatar] = useState(() => loadAvatar());
  const [username, setUsername] = useState(user?.username || '');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setErr('');
    try {
      setAvatar(await saveAvatarFromFile(file));
      setMsg('Profile picture saved to this browser.');
    } catch {
      setErr('Could not read that image. Try a JPG/PNG.');
    }
  };

  const handleRemove = () => {
    removeAvatar();
    setAvatar(null);
    setMsg('Profile picture removed.');
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(''); setErr('');
    try {
      await updateProfile({ username: username.trim() });
      setMsg('Username updated.');
    } catch (error) {
      setErr(error.response?.data?.error || 'Could not update username.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <TVFrame brand="ZAMANI" model="PERSONNEL FILE">
      <div className="about-container">
        <header className="about-header">
          <div className="about-record-line">
            <span>PERSONNEL FILE // {user?.username}</span>
            <span>TC-1984</span>
          </div>
          <h1>Archivist Profile</h1>
        </header>

        <section className="about-section">
          <span className="about-section-index">01</span>
          <div className="about-section-body">
            <h2>Profile Picture</h2>
            <p>Stored in browser sessions.</p>
            <div className="profile-avatar-box">
              {avatar ? (
                <img src={avatar} alt={`${user?.username} profile`} />
              ) : (
                <span className="profile-avatar-placeholder">
                  NO PROFILE PICTURE ON FILE<br />UPLOAD A PHOTO BELOW
                </span>
              )}
            </div>
            <div className="profile-avatar-actions">
              <label className="quick-btn">
                UPLOAD IMAGE
                <input type="file" accept="image/*" onChange={handleUpload} hidden />
              </label>
              {avatar && (
                <button type="button" className="quick-btn" onClick={handleRemove}>
                  REMOVE
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="about-section">
          <span className="about-section-index">02</span>
          <div className="about-section-body">
            <h2>Username</h2>
            <p>Change the username shown across the archive.</p>
            <form className="profile-name-form" onSubmit={handleSaveName}>
              <input
                type="text"
                value={username}
                minLength={3}
                maxLength={30}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <button type="submit" className="quick-btn active" disabled={saving}>
                {saving ? 'SAVING...' : 'SAVE'}
              </button>
            </form>
            {msg && <p className="profile-msg">{msg}</p>}
            {err && <p className="auth-error">{err}</p>}
          </div>
        </section>

        <section className="about-section">
          <span className="about-section-index">03</span>
          <div className="about-section-body">
            <h2>Record</h2>
            <p>
              Email on file: <strong>{user?.email}</strong><br />
              Archivist since: {new Date(user?.created_at).toLocaleDateString()}
            </p>
          </div>
        </section>
      </div>
    </TVFrame>
  );
};

export default Profile;