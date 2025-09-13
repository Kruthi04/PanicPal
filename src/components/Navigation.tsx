import React, { useState } from 'react';
import { Menu, X, Home, User, Settings, Music, Heart, BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage = 'dashboard', onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
    setIsMenuOpen(false);
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
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'journal', label: 'Mood Journal', icon: BookOpen },
    { id: 'sessions', label: 'Audio Sessions', icon: Music },
    { id: 'wellness', label: 'Wellness', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const bottomNavItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'journal', icon: BookOpen, label: 'Journal' },
    { id: 'sessions', icon: Music, label: 'Audio' },
    { id: 'wellness', icon: Heart, label: 'Wellness' },
  ];

  return (
    <>
      {/* Top Navigation with Hamburger Menu */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-forest-900/95 backdrop-blur-sm border-b border-forest-700">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg bg-forest-800/50 text-forest-100 hover:bg-forest-700/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-forest-400 to-forest-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-forest-900 rounded-full opacity-60"></div>
            </div>
            <span className="text-forest-100 font-medium font-inter">PanicPal</span>
          </div>
          
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Slide-out Menu */}
        <div className={`absolute top-full left-0 w-64 bg-forest-900/98 backdrop-blur-md border-r border-forest-700 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-4 space-y-2">
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
            
            {/* Logout Button */}
            <div className="pt-4 border-t border-forest-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-inter text-forest-300 hover:bg-forest-800/30 hover:text-forest-100"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-forest-900/95 backdrop-blur-sm border-t border-forest-700">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors font-inter ${
                  currentPage === item.id
                    ? 'text-forest-400'
                    : 'text-forest-300 hover:text-forest-200'
                }`}
              >
                <IconComponent size={20} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;