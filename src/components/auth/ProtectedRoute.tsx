import React from "react";
import { Route, Redirect, RouteComponentProps } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { IonContent, IonPage, IonSpinner } from "@ionic/react";

interface ProtectedRouteProps {
  component: React.ComponentType<RouteComponentProps<any>>;
  exact?: boolean;
  path: string;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  requireAdmin = false,
  ...rest
}) => {
  const { user, loading, isAdmin } = useAuthContext();

  if (loading) {
    return (
      <IonPage>
        <IonContent className="flex items-center justify-center">
          <IonSpinner name="crescent" />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!user) {
          return <Redirect to="/login" />;
        }

        if (requireAdmin && !isAdmin) {
          return <Redirect to="/people" />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
