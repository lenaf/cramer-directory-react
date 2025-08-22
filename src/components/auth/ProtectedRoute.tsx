import React from 'react';
import { IonSpinner, IonContent } from '@ionic/react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthPage } from '../pages/AuthPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback: FallbackComponent = AuthPage 
}) => {
  const { auth, loading } = useAuth();

  if (loading) {
    return (
      <IonContent>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <IonSpinner />
        </div>
      </IonContent>
    );
  }

  if (!auth) {
    return <FallbackComponent />;
  }

  return <>{children}</>;
};