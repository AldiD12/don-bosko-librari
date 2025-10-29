import React, { useState, useEffect } from 'react';
import AdminLogin from '../components/AdminLogin';
import AdminPanel from '../components/AdminPanel';
import NotificationSystem from '../components/NotificationSystem';
import { getLibraryData, LibraryData } from '../utils/dataManager';
import { saveLibraryDataProduction, isProductionMode } from '../utils/productionDataManager';
import './AdminPage.css';



const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [libraryData, setLibraryData] = useState<LibraryData>(getLibraryData());

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authData = localStorage.getItem('donBosko_admin_auth');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          if (parsed.expires > Date.now()) {
            setIsAuthenticated(true);
            return;
          } else {
            // Token expired
            localStorage.removeItem('donBosko_admin_auth');
          }
        } catch (error) {
          localStorage.removeItem('donBosko_admin_auth');
        }
      }
      setIsAuthenticated(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (authenticated: boolean) => {
    setIsAuthenticated(authenticated);
  };

  const handleDataUpdate = async (newData: LibraryData) => {
    setLibraryData(newData);
    
    if (isProductionMode()) {
      // Use production save (GitHub integration)
      await saveLibraryDataProduction(newData);
    } else {
      // Use development save (localStorage)
      const { saveLibraryData } = await import('../utils/dataManager');
      saveLibraryData(newData);
    }
  };

  const handleBackToLibrary = () => {
    window.location.href = '/';
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="admin-background">
          <div className="admin-content">
            <AdminLogin onLogin={handleLogin} onClose={handleBackToLibrary} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <NotificationSystem />
      <div className="admin-background">
        <div className="admin-content">
          <AdminPanel 
            libraryData={libraryData}
            onDataUpdate={handleDataUpdate}
            isFullPage={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;