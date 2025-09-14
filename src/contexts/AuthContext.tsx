import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../utils/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const guestMode = localStorage.getItem('guestMode');
        
        if (token) {
          // Validate token with backend
          const userData = await authAPI.getProfile(token);
          setUser(userData.data.user);
        } else if (guestMode === 'true') {
          setIsGuest(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        // If token validation fails, allow guest access
        setIsGuest(true);
        localStorage.setItem('guestMode', 'true');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const data = await authAPI.login(email, password);
      localStorage.setItem('token', data.data.token);
      setUser(data.data.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    try {
      setLoading(true);
      const data = await authAPI.register(email, password, name);
      localStorage.setItem('token', data.data.token);
      setUser(data.data.user);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (token) {
        await authAPI.logout(token);
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('guestMode');
      setUser(null);
      setIsGuest(true); // Continue as guest after logout
      localStorage.setItem('guestMode', 'true');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if server request fails
      localStorage.removeItem('token');
      localStorage.removeItem('guestMode');
      setUser(null);
      setIsGuest(true);
      localStorage.setItem('guestMode', 'true');
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = (): void => {
    setIsGuest(true);
    localStorage.setItem('guestMode', 'true');
    setLoading(false);
  };

  const value: AuthContextType = {
    user,
    isGuest,
    login,
    register,
    logout,
    continueAsGuest,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;