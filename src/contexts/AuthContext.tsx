import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { auth, db } from '../lib/firebase';
import { AuthService } from '../services/AuthService';
import { FirestoreService } from '../services/FirestoreService';
import { Auth } from '../types/Auth';

interface AuthContextType {
  auth: Auth | null;
  authService: AuthService;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authData, setAuthData] = useState<Auth | null>(null);
  const [loading, setLoading] = useState(true);

  const authService = useMemo(() => {
    const firestoreService = new FirestoreService(db);
    return new AuthService(auth, firestoreService);
  }, []);

  useEffect(() => {
    const subscription = authService.auth$.subscribe({
      next: (authData) => {
        setAuthData(authData);
        setLoading(false);
      },
      error: (error) => {
        console.error('Auth error:', error);
        setAuthData(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [authService]);

  return (
    <AuthContext.Provider value={{ auth: authData, authService, loading }}>
      {children}
    </AuthContext.Provider>
  );
};