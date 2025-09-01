// components/AccountLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import UserSidebar from '../../../pages/user/UserSidebar';

const AccountLayout: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowSidebar(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Show sidebar on mobile when navigating to base account route
  useEffect(() => {
    if (isMobile && location.pathname === '/account') {
      setShowSidebar(true);
    }
  }, [location.pathname, isMobile]);

  // Hide sidebar when navigating to a sub-route on mobile
  useEffect(() => {
    if (isMobile && location.pathname !== '/account') {
      setShowSidebar(false);
    }
  }, [location.pathname, isMobile]);

  const handleBackToSidebar = () => {
    setShowSidebar(true);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Mobile Header */}
        {isMobile && !showSidebar && (
          <div className="mb-6 flex items-center">
            <button
              onClick={handleBackToSidebar}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 bg-gray-800 px-4 py-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Menu</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar - Show/Hide based on state on mobile */}
          <div className={`md:col-span-1 ${isMobile && !showSidebar ? 'hidden' : 'block'}`}>
            <UserSidebar onNavigate={() => isMobile && setShowSidebar(false)} />
          </div>
          {/* Main Content - Hide on mobile when sidebar is shown */}
          <div className={`md:col-span-3 ${isMobile && showSidebar ? 'hidden' : 'block'}`}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;