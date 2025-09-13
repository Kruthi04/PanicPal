import React, { useState } from 'react';
import { Menu, X, Home, BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage = 'dashboard', onNavigate }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsDrawerOpen(false);
    }
  };

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
    navigate(`/${page}`);
    setIsDrawerOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    { id: '', label: 'Home', icon: Home },
    { id: 'journal', label: 'Mood Journal', icon: BookOpen },
  ];

  return (
    <>
      {/* Menu Button for Integration into Existing Headers */}
      <button
        onClick={toggleDrawer}
        className="p-2 text-forest-200 hover:text-forest-100 hover:bg-forest-800/30 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-forest-accent/50"
        aria-label="Open navigation menu"
        aria-expanded={isDrawerOpen}
        aria-controls="navigation-drawer"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Right Slide-out Drawer */}
      <div 
        id="navigation-drawer"
        className={`fixed top-0 right-0 w-80 h-full bg-forest-900/98 backdrop-blur-md border-l border-forest-700 transform transition-transform duration-300 ease-in-out z-50 ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onKeyDown={handleKeyDown}
        role="navigation"
        aria-label="Main navigation menu"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-forest-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-forest-400 to-forest-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-forest-900 rounded-full opacity-60"></div>
            </div>
            <span className="text-forest-100 font-medium font-inter">PanicPal</span>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 text-forest-300 hover:text-forest-100 hover:bg-forest-800/30 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-forest-accent/50"
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Navigation Items */}
        <div className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-inter ${
                    currentPage === item.id
                      ? 'bg-forest-700/50 text-forest-100'
                      : 'text-forest-200 hover:bg-forest-800/30 hover:text-forest-100'
                  }`}
                >
                  <IconComponent size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Drawer Footer with Logout */}
        <div className="p-4 border-t border-forest-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-inter text-forest-300 hover:bg-forest-800/30 hover:text-forest-100"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;