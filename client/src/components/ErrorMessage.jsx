import React from 'react';
import '../styles/error.css';

const ErrorMessage = ({ message, onRetry }) => (
  <div className="error-container">
    <div className="error-icon">⚠️</div>
    <h2>SIGNAL LOST</h2>
    <p>{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="retry-btn">
        RETUNE CHANNEL
      </button>
    )}
  </div>
);

export default ErrorMessage;