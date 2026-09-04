import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loadAvatar } from '../utils/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const AuthControls = () => {
  const { user, isAuthenticated, loading, login, signup, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const isSavedPage = location.pathname.startsWith('/saved');

  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const avatar = loadAvatar();

  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const handleOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
        setConfirmLogout(false);
      }
    };

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setConfirmLogout(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    setAuthOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!authOpen) {
      return undefined;
    }

    const onKey = (event) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        setAuthOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, [authOpen]);

  if (loading) {
    return null;
  }

  const openAuth = (nextMode) => {
    setMode(nextMode);
    setError('');
    setAuthOpen(true);
  };

  const closeAuth = () => {
    setAuthOpen(false);
    setError('');
  };

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await login({
          username: form.username,
          password: form.password,
        });
      } else {
        await signup(form);
      }

      setForm({
        username: '',
        email: '',
        password: '',
      });

      closeAuth();
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      closeAuth();
    }
  };

  return (
    <>
      {/* ACCOUNT & ACTIONS */}
      <div className="auth-cluster-right">
        {isAuthenticated && (
          <div className="user-menu" ref={menuRef}>
            <button
              type="button"
              className="auth-btn user-chip"
              onClick={() => {
                setMenuOpen((open) => !open);
                setConfirmLogout(false);
              }}
              aria-label="Open account menu"
              aria-expanded={menuOpen}
            >
              <FontAwesomeIcon
                icon={faUser}
                className="auth-user-icon"
                aria-hidden="true"
              />

              <span className="auth-username">@{user?.username}</span>

              <span className="auth-chevron" aria-hidden="true">
                ▾
              </span>
            </button>

            {menuOpen && (
              <div className="user-dropdown" role="menu">
                <div className="user-dropdown-head">
                  {avatar && (
                    <img className="dropdown-avatar" src={avatar} alt="" />
                  )}

                  <span className="user-dropdown-email">{user?.email}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/profile');
                  }}
                >
                  PROFILE
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/help');
                  }}
                >
                  HELP
                </button>

                {confirmLogout ? (
                  <div className="logout-confirm">
                    <p>Sure you want to log out?</p>

                    <div className="logout-confirm-actions">
                      <button
                        type="button"
                        className="danger"
                        onClick={() => {
                          setMenuOpen(false);
                          setConfirmLogout(false);
                          logout();
                        }}
                      >
                        YES
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirmLogout(false)}
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="danger"
                    onClick={() => setConfirmLogout(true)}
                  >
                    LOGOUT
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {!isAuthenticated && (
          <button
            type="button"
            className="auth-btn primary"
            onClick={() => openAuth('login')}
          >
            LOGIN
          </button>
        )}

        {isAuthenticated && isSavedPage && (
          <button
            type="button"
            className="auth-btn primary new-memory-btn"
            onClick={() => navigate('/saved?new=1')}
          >
            <span className="btn-full">+ NEW MEMORY</span>
            <span className="btn-mini">+</span>
          </button>
        )}
      </div>

      {/* AUTH MODAL */}
      {authOpen &&
        createPortal(
          <div className="auth-modal-overlay" onClick={handleBackdropClick}>
            <div
              className="auth-panel"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="auth-tabs">
                <button
                  type="button"
                  className={mode === 'login' ? 'active' : ''}
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                >
                  LOG IN
                </button>

                <button
                  type="button"
                  className={mode === 'signup' ? 'active' : ''}
                  onClick={() => {
                    setMode('signup');
                    setError('');
                  }}
                >
                  SIGN UP
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <input
                  name="username"
                  type="text"
                  placeholder={
                    mode === 'signup' ? 'Username' : 'Username or email'
                  }
                  value={form.username}
                  onChange={handleChange}
                  required
                />

                {mode === 'signup' && (
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                )}

                <input
                  name="password"
                  type="password"
                  placeholder="Password (min 6)"
                  value={form.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                />

                {error && <p className="auth-error">{error}</p>}

                <button
                  type="submit"
                  className="auth-btn primary auth-submit"
                  disabled={submitting}
                >
                  {submitting
                    ? 'PLEASE WAIT...'
                    : mode === 'login'
                      ? 'SUBMIT'
                      : 'CREATE ACCOUNT'}
                </button>
              </form>

              <p className="auth-hint">Tap outside or press ESC to close.</p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default AuthControls;
