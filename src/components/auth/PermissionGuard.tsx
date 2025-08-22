import React, { useEffect, useState } from 'react';
import { IonText, IonSpinner } from '@ionic/react';
import { useAuth } from '../../contexts/AuthContext';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requireAll?: boolean;
  fallback?: React.ComponentType;
}

const UnauthorizedFallback: React.FC = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px',
    flexDirection: 'column' 
  }}>
    <IonText color="danger">
      <h3>Access Denied</h3>
      <p>You don't have permission to view this content.</p>
    </IonText>
  </div>
);

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermission,
  requiredPermissions = [],
  requireAll = false,
  fallback: FallbackComponent = UnauthorizedFallback
}) => {
  const { auth, authService } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (!auth) {
      setHasPermission(false);
      return;
    }

    const permissions = requiredPermission 
      ? [requiredPermission] 
      : requiredPermissions;

    if (permissions.length === 0) {
      setHasPermission(true);
      return;
    }

    if (requireAll) {
      // Check if user has ALL required permissions
      const subscriptions = permissions.map(permission =>
        authService.hasPermission(permission).subscribe(result => {
          // Only update if we don't have permission for any required permission
          if (!result) {
            setHasPermission(false);
          }
        })
      );

      // Check if user has all permissions
      Promise.all(
        permissions.map(permission => 
          new Promise<boolean>(resolve => {
            const sub = authService.hasPermission(permission).subscribe(result => {
              resolve(result);
              sub.unsubscribe();
            });
          })
        )
      ).then(results => {
        setHasPermission(results.every(result => result));
      });

      return () => subscriptions.forEach(sub => sub.unsubscribe());
    } else {
      // Check if user has ANY of the required permissions
      const subscription = authService.hasAnyPermission(permissions).subscribe(result => {
        setHasPermission(result);
      });

      return () => subscription.unsubscribe();
    }
  }, [auth, authService, requiredPermission, requiredPermissions, requireAll]);

  if (hasPermission === null) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100px' 
      }}>
        <IonSpinner />
      </div>
    );
  }

  if (!hasPermission) {
    return <FallbackComponent />;
  }

  return <>{children}</>;
};