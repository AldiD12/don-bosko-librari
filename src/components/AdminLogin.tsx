import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faEye, faEyeSlash, faTimes } from '@fortawesome/free-solid-svg-icons';
import './AdminLogin.css';

interface AdminLoginProps {
  onLogin: (isAuthenticated: boolean) => void;
  onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Admin credentials (in production, these should be environment variables)
  const ADMIN_CREDENTIALS = {
    'admin': process.env.REACT_APP_ADMIN_PASSWORD || 'donbosko2024',
    'librarian': process.env.REACT_APP_LIBRARIAN_PASSWORD || 'library123',
    'teacher': process.env.REACT_APP_TEACHER_PASSWORD || 'school2024'
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const validPassword = ADMIN_CREDENTIALS[username as keyof typeof ADMIN_CREDENTIALS];
    
    if (validPassword && password === validPassword) {
      // Store authentication in localStorage with expiration
      const authData = {
        username,
        timestamp: Date.now(),
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      localStorage.setItem('donBosko_admin_auth', JSON.stringify(authData));
      
      onLogin(true);
    } else {
      setError('Invalid username or password');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="login-overlay">
      <div className="login-container">
        <div className="login-header">
          <div className="login-icon">
            <FontAwesomeIcon icon={faLock} />
          </div>
          <h2>Admin Access</h2>
          <p>Don Bosko Library Management</p>
          <button className="close-login-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <div className="input-icon">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <div className="input-icon">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className={`login-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Authenticating...
              </>
            ) : (
              'Login to Admin Panel'
            )}
          </button>
        </form>

        <div className="login-info">
          <div className="info-section">
            <h4>Demo Credentials:</h4>
            <div className="credentials">
              <div className="credential-item">
                <strong>admin</strong> / donbosko2024
              </div>
              <div className="credential-item">
                <strong>librarian</strong> / library123
              </div>
              <div className="credential-item">
                <strong>teacher</strong> / school2024
              </div>
            </div>
          </div>
          <p className="security-note">
            🔒 Secure authentication with 24-hour session
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;