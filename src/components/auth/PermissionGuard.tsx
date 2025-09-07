import React, { useEffect, useState } from "react";
import { IonText, IonSpinner } from "@ionic/react";
import { useAuthContext } from "../../contexts/AuthContext";

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requireAll?: boolean;
  fallback?: React.ComponentType;
}

const UnauthorizedFallback: React.FC = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
      flexDirection: "column",
    }}
  >
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
  fallback: FallbackComponent = UnauthorizedFallback,
}) => {
  const { user } = useAuthContext();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
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

    const userPermissions = user.role?.permissionIds || [];

    if (requireAll) {
      // Check if user has ALL required permissions
      const hasAllPermissions = permissions.every((permission) =>
        userPermissions.includes(permission)
      );
      setHasPermission(hasAllPermissions);
    } else {
      // Check if user has ANY of the required permissions
      const hasAnyPermission = permissions.some((permission) =>
        userPermissions.includes(permission)
      );
      setHasPermission(hasAnyPermission);
    }
  }, [user, requiredPermission, requiredPermissions, requireAll]);

  if (hasPermission === null) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
        }}
      >
        <IonSpinner />
      </div>
    );
  }

  if (!hasPermission) {
    return <FallbackComponent />;
  }

  return <>{children}</>;
};
