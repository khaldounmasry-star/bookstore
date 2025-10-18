'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { setCookie } from '../lib';
import { redirect } from 'next/navigation';
import { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = Cookies.get('token');
    if (storedToken) setToken(storedToken);
  }, []);

  const login = (newToken: string, role: string) => {
    setCookie('token', newToken);
    setCookie('role', role);
    setToken(newToken);
  };

  const logout = () => {
    Cookies.remove('token', { path: '/' });
    Cookies.remove('role', { path: '/' });
    setToken(null);
    redirect('/');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(token),
        token,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
