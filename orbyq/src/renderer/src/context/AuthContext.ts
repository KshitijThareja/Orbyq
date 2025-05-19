import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    callBackend: <T>(endpoint: string, method?: string, data?: any) => Promise<T>;
    isValidating: boolean;
}

const defaultContextValue: AuthContextType = {
    token: null,
    login: async () => { throw new Error('AuthContext not initialized'); },
    register: async () => { throw new Error('AuthContext not initialized'); },
    logout: () => { throw new Error('AuthContext not initialized'); },
    isAuthenticated: false,
    callBackend: async () => { throw new Error('AuthContext not initialized'); },
    isValidating: false
};

interface ElectronStore {
    set: (key: string, value: any) => void;
    get: (key: string) => any;
    delete: (key: string) => void;
}

declare global {
    interface Window {
        electronStore: ElectronStore;
    }
}

export const AuthContext = createContext<AuthContextType>(defaultContextValue);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [token, setToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isValidating, setIsValidating] = useState<boolean>(true);
    const navigate = useNavigate();

    const navigateTo = useCallback(
        (path: string) => {
            navigate(path);
        },
        [navigate]
    );

  const logout = useCallback(() => {
    window.electronStore.delete('token');
    window.electronStore.delete('refreshToken');
    setToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    navigateTo('/login');
  }, [navigateTo]);

  useEffect(() => {
    let isMounted = true;
    const validateToken = async () => {
      if (!isMounted) return;
      if (isAuthenticated) {
        setIsValidating(false);
        return;
      }
      setIsValidating(true);
      try {
        const savedToken = window.electronStore.get('token');
        const savedRefreshToken = window.electronStore.get('refreshToken');

        if (!savedToken || !savedRefreshToken) {
          setIsValidating(false);
          return;
        }

        try {
          // @ts-ignore
          await window.api.callBackend('auth/validate', 'GET', null, savedToken);
          if (isMounted) {
            setToken(savedToken);
            setRefreshToken(savedRefreshToken);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          if (isMounted) {
            window.electronStore.delete('token');
            window.electronStore.delete('refreshToken');
            navigateTo('/login');
          }
        }
      } catch (error) {
        console.error('Error during token validation:', error);
        if (isMounted) navigateTo('/login');
      } finally {
        if (isMounted) {
          setIsValidating(false);
        }
      }
    };

    validateToken();
    return () => {
      isMounted = false;
    };
  }, [navigateTo, isAuthenticated]);

  const login = async (email: string, password: string) => {
    try {
      // @ts-ignore
      const response = await window.api.callBackend<{ token: string; refreshToken: string }>(
        'auth/login',
        'POST',
        { email, password }
      );

      window.electronStore.set('token', response.token);
      window.electronStore.set('refreshToken', response.refreshToken);
      setToken(response.token);
      setRefreshToken(response.refreshToken);
      setIsAuthenticated(true);
      navigateTo('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    }
  };

  const register = async (email: string, password: string) => {
    try {
      // @ts-ignore
      const response = await window.api.callBackend<{ token: string; refreshToken: string }>(
        'auth/register',
        'POST',
        { email, password }
      );

      window.electronStore.set('token', response.token);
      window.electronStore.set('refreshToken', response.refreshToken);
      setToken(response.token);
      setRefreshToken(response.refreshToken);
      setIsAuthenticated(true);
      navigateTo('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Registration failed');
    }
  };

  const callBackend = async <T,>(endpoint: string, method: string = 'GET', data?: any): Promise<T> => {
    try {
      // @ts-ignore
      return await window.api.callBackend<T>(endpoint, method, data, token);
    } catch (error: any) {
      if (error?.status === 401 && refreshToken) {
        try {
          // @ts-ignore
          const refreshResponse = await window.api.callBackend<{ token: string; refreshToken: string }>(
            'auth/refresh',
            'POST',
            { refreshToken }
          );

          window.electronStore.set('token', refreshResponse.token);
          window.electronStore.set('refreshToken', refreshResponse.refreshToken);
          setToken(refreshResponse.token);
          setRefreshToken(refreshResponse.refreshToken);

          // @ts-ignore
          return await window.api.callBackend<T>(endpoint, method, data, refreshResponse.token);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          logout();
          throw new Error('Session expired. Please log in again.');
        }
      }
      throw error;
    }
  };

    const contextValue: AuthContextType = {
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        callBackend,
        isValidating
    };

    return React.createElement(
        AuthContext.Provider,
        { value: contextValue },
        children
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}