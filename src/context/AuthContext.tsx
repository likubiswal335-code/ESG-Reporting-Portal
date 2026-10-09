/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api, AuthUser } from '../services/api';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (userId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (curr: string, next: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(api.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(api.isAuthenticated());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  };

  const logout = useCallback(async () => {
    clearInactivityTimer();
    try {
      await api.logout();
    } catch (e) {
      console.warn('Logout request completed with warning:', e);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (!isAuthenticated) return;
    clearInactivityTimer();
    inactivityTimerRef.current = setTimeout(() => {
      setError('Your session has expired. Please sign in again.');
      logout();
    }, INACTIVITY_TIMEOUT_MS);
  }, [isAuthenticated, logout]);

  // Initial session check on mount
  useEffect(() => {
    api.setOnUnauthorized(() => {
      setUser(null);
      setIsAuthenticated(false);
      setError('Your session has expired. Please sign in again.');
    });

    const initAuth = async () => {
      setIsLoading(true);
      try {
        const session = await api.checkSession();
        if (session.authenticated && session.user && session.user.role === 'MANAGEMENT_ADMIN') {
          setUser(session.user);
          setIsAuthenticated(true);
          resetInactivityTimer();
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err: any) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      clearInactivityTimer();
    };
  }, [resetInactivityTimer]);

  // Activity listeners for session sliding
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    resetInactivityTimer();

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      clearInactivityTimer();
    };
  }, [isAuthenticated, resetInactivityTimer]);

  const login = async (userId: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await api.login(userId, password);
      if (response.user.role !== 'MANAGEMENT_ADMIN') {
        throw new Error('Unauthorized Management Access.');
      }
      setUser(response.user);
      setIsAuthenticated(true);
      resetInactivityTimer();
    } catch (err: any) {
      setUser(null);
      setIsAuthenticated(false);
      setError(err.message || 'Invalid Management credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (curr: string, next: string) => {
    await api.changePassword(curr, next);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        changePassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
