'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { setCookie } from '../lib';
import { redirect } from 'next/navigation';
import { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = Cookies.get('token');
    const storedRole = Cookies.get('role');
    if (storedRole) setRole(storedRole);
    if (storedToken) setToken(storedToken);
  }, []);

  const login = (newToken: string, role: string) => {
    setCookie('token', newToken);
    setCookie('role', role);
    setToken(newToken);
    setRole(role);
  };

  const logout = () => {
    Cookies.remove('token', { path: '/' });
    Cookies.remove('role', { path: '/' });
    setToken(null);
    setRole(null);
    redirect(window.location.pathname === '/' ? '/signin' : '/');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(token),
        token,
        role,
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
