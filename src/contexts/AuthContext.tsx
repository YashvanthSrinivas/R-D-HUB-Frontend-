import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  User, 
  login as apiLogin, 
  register as apiRegister, 
  getMe, 
  LoginData, 
  RegisterData,
  deleteAccount as apiDeleteAccount
} from '@/lib/api/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  deleteAccount: () => Promise<void>;   
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  }, []);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await getMe();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [clearAuth]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (data: LoginData) => {
    const tokens = await apiLogin(data);
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);

    const userData = await getMe();
    setUser(userData);
  };

  const register = async (data: RegisterData) => {
    await apiRegister(data);
    await login({ username: data.username, password: data.password });
  };

  const logout = () => {
    clearAuth();
  };

  //DELETE ACCOUNT FUNCTION
  const deleteAccount = async () => {
    try {
      await apiDeleteAccount();
    } catch (e) {
      console.error("Delete account failed:", e);
    } finally {
      clearAuth();
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        register, 
        logout, 
        deleteAccount    
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
