import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { 
  login as loginService, 
  register as registerService
} from '../services/auth';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  age?: number | '';
  gender?: string;
  height?: number | '';
  weight?: number | '';
  activityLevel?: string;
  healthGoal?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  loginWithGoogle: (data: any) => Promise<void>;
  loginWithFacebook: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<any>(token);
        setUser({
          id: decoded.sub || '1',
          name: decoded.name || 'User',
          email: decoded.email || '',
          picture: decoded.picture || ''
        });
      } catch (err) {
        console.error("Invalid token found in storage:", err);
        setToken(null);
        localStorage.removeItem('auth_token');
      }
    }
    setIsLoading(false);
  }, [token]);

  const login = async (credentials: any) => {
    const data = await loginService(credentials);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('auth_token', data.token);
  };

  const register = async (userData: any) => {
    const data = await registerService(userData);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('auth_token', data.token);
  };

  const loginWithGoogle = async (credential: string) => {
    try {
      const decoded = jwtDecode<any>(credential);
      
      // MOCK BACKEND LOGIN
      // (Bypasses the python backend to avoid Uvicorn timeouts/deadlocks)
      const mock_access_token = credential; // Just use Google JWT as the app token for mock
      
      const userObj = {
        id: decoded.sub || 'g1',
        name: decoded.name || 'Google User',
        email: decoded.email || '',
        picture: decoded.picture || ''
      };
      
      setToken(mock_access_token);
      setUser(userObj);
      localStorage.setItem('auth_token', mock_access_token);
    } catch (err) {
      console.error("Mock Google Login failed", err);
      throw err;
    }
  };

  const loginWithFacebook = async (tokenData: any) => {
    // For local frontend handling, we just mock auth response here
    // In production, send this to backend.
    setToken(tokenData.access_token);
    localStorage.setItem('auth_token', tokenData.access_token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated: !!token, 
      isLoading, 
      login, 
      register, 
      loginWithGoogle,
      loginWithFacebook,
      logout, 
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
