import React from 'react';
import '../styles/loading.css';

const LoadingSpinner = () => (
  <div className="spinner-container" aria-label="Loading content">
    <div className="crt-spinner"></div>
  </div>
);

export default LoadingSpinner;