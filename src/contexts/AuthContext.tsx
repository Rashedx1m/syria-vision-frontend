'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '@/lib/api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    username: string;
    password: string;
    password_confirm: string;
    full_name?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const token = Cookies.get('access_token');
      if (token) {
        const response = await authAPI.getMe();
        setUser(response.data);
      }
    } catch (error) {
      setUser(null);
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      await refreshUser();
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    const { access, refresh } = response.data;

    Cookies.set('access_token', access, { expires: 1 });
    Cookies.set('refresh_token', refresh, { expires: 7 });

    await refreshUser();
  };

  const register = async (data: {
    email: string;
    username: string;
    password: string;
    password_confirm: string;
    full_name?: string;
  }) => {
    const response = await authAPI.register(data);
    const { tokens } = response.data;

    Cookies.set('access_token', tokens.access, { expires: 1 });
    Cookies.set('refresh_token', tokens.refresh, { expires: 7 });

    await refreshUser();
  };

//   const logout = async () => {
//   try {
//     const refresh = Cookies.get('refresh_token');
//     if (refresh) {
//       await authAPI.logout(refresh).catch(() => {});
//     }
//   } finally {
//     Cookies.remove('access_token');
//     Cookies.remove('refresh_token');
//     setUser(null);
//   }
// };
const logout = async () => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  setUser(null);
};
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
