import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  User,
  login as apiLogin,
  register as apiRegister,
  getMe,
  LoginData,
  RegisterData,
  deleteAccount as apiDeleteAccount,
  refreshToken,
} from "@/lib/api/auth";

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
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  const fetchUser = useCallback(async () => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");

    if (!access) {
      setLoading(false);
      return;
    }

    try {
      const userData = await getMe();
      setUser(userData);
    } catch (error: any) {
      console.warn("Access token expired, refreshing…");

      if (refresh) {
        try {
          const newTokens = await refreshToken(refresh);
          localStorage.setItem("access", newTokens.access);

          const userData = await getMe();
          setUser(userData);
        } catch (e) {
          console.error("Refresh token failed:", e);
          clearAuth();
        }
      } else {
        clearAuth();
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (data: LoginData) => {
    const tokens = await apiLogin(data);
    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);

    const userData = await getMe();
    setUser(userData);
  };

  const register = async (data: RegisterData) => {
    await apiRegister(data);
    await login({ username: data.username, password: data.password });
  };

  const logout = () => clearAuth();

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
      value={{ user, loading, login, register, logout, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
};
