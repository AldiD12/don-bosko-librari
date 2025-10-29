import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import './NotificationSystem.css';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const handleNotification = (event: CustomEvent) => {
      const { message, type, duration = 5000 } = event.detail;
      const id = Date.now().toString();
      
      const notification: Notification = { id, message, type, duration };
      setNotifications(prev => [...prev, notification]);
      
      // Auto remove after duration
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    };

    window.addEventListener('showNotification', handleNotification as EventListener);
    
    return () => {
      window.removeEventListener('showNotification', handleNotification as EventListener);
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return faCheckCircle;
      case 'error': return faExclamationTriangle;
      case 'warning': return faExclamationTriangle;
      default: return faCheckCircle;
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-content">
            <FontAwesomeIcon 
              icon={getIcon(notification.type)} 
              className="notification-icon" 
            />
            <span className="notification-message">{notification.message}</span>
          </div>
          <button 
            onClick={() => removeNotification(notification.id)}
            className="notification-close"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;