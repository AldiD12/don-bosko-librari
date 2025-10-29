import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook } from '@fortawesome/free-solid-svg-icons';
import './NotFound.css';

const NotFound: React.FC = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-icon">
          <FontAwesomeIcon icon={faBook} />
        </div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist in our library.</p>
        <button onClick={handleGoHome} className="home-btn">
          <FontAwesomeIcon icon={faHome} />
          Return to Library
        </button>
      </div>
    </div>
  );
};

export default NotFound;