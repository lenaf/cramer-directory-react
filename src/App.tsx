import React from "react";
import {
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonApp, IonContent, IonLabel, IonIcon } from "@ionic/react";

import { IonReactRouter } from "@ionic/react-router";

import "@ionic/react/css/core.css";

import { AuthProvider } from "./contexts/AuthContext";

import "./theme/variables.scss"; // must be imported after ionic core for precedence
import "./global.scss";
import { Redirect, Route, useLocation } from "react-router-dom";
import { NAV_ROUTES } from "./routes";
import CompanyDetailPage from "./components/pages/CompanyDetailPage";
import PersonDetailPage from "./components/pages/PersonDetailPage";
import LoginPage from "./components/auth/LoginPage";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import SignupPage from "./components/auth/SignupPage";

setupIonicReact();
export const SPLIT_PLANE_CONTENT_ID = "split-plane-content";

const AppContent: React.FC = () => {
  const location = useLocation();
  const currentRoute =
    NAV_ROUTES.find((t) => t.path === location.pathname) || NAV_ROUTES[0];

  return (
    <div className="ion-page">
      {/* ROUTING AND MAIN CONTENT */}
      <IonContent className="ion-padding">
        <IonTabs>
          <IonRouterOutlet>
            {NAV_ROUTES.map((route) => (
              <Route
                key={route.id}
                exact
                path={route.path}
                component={route.component}
              />
            ))}
            <Route exact path="/company/:id" component={CompanyDetailPage} />
            <Route exact path="/people/:id" component={PersonDetailPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route
              exact
              path="/forgot-password"
              component={ForgotPasswordPage}
            />
            <Route exact path="/signup" component={SignupPage} />

            <Route exact path="/" render={() => <Redirect to="/home" />} />
          </IonRouterOutlet>

          <IonTabBar slot="bottom" color="secondary">
            {NAV_ROUTES.map((route) => {
              const isActive = currentRoute.path === route.path;
              return (
                <IonTabButton
                  key={route.id}
                  tab={route.id}
                  href={route.path}
                  className={isActive ? "bg-white bg-opacity-20 font-bold" : ""}
                >
                  <IonIcon
                    icon={route.icon}
                    className={isActive ? "text-white" : ""}
                  />
                  <IonLabel className={isActive ? "text-white font-bold" : ""}>
                    {route.label}
                  </IonLabel>
                </IonTabButton>
              );
            })}
          </IonTabBar>
        </IonTabs>
      </IonContent>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <IonApp>
      <AuthProvider>
        <IonReactRouter>
          <AppContent />
        </IonReactRouter>
      </AuthProvider>
    </IonApp>
  );
};

export default App;
