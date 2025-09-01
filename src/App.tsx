import React from "react";
import {
  IonRouterOutlet,
  IonSplitPane,
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
import { ROUTES } from "./routes";
import SideMenu from "./components/SideMenu";
import CompanyDetailPage from "./components/pages/CompanyDetailPage";

setupIonicReact();
export const SPLIT_PLANE_CONTENT_ID = "split-plane-content";

const AppContent: React.FC = () => {
  const location = useLocation();
  const currentRoute =
    ROUTES.find((t) => t.path === location.pathname) || ROUTES[0];

  return (
    <IonSplitPane when="sm" contentId={SPLIT_PLANE_CONTENT_ID}>
      <SideMenu />
      {/* MAIN */}
      <div className="ion-page" id={SPLIT_PLANE_CONTENT_ID}>
        {/* ROUTING AND MAIN CONTENT */}
        <IonContent className="ion-padding">
          <IonTabs>
            <IonRouterOutlet>
              {ROUTES.map((route) => (
                <Route
                  key={route.id}
                  exact
                  path={route.path}
                  component={route.component}
                />
              ))}
              <Route exact path="/company/:id" component={CompanyDetailPage} />
              <Route exact path="/" render={() => <Redirect to="/home" />} />
            </IonRouterOutlet>

            <IonTabBar slot="bottom" color="secondary">
              {ROUTES.map((route) => {
                const isActive = currentRoute.path === route.path;
                return (
                  <IonTabButton
                    key={route.id}
                    tab={route.id}
                    href={route.path}
                    className={
                      isActive ? "bg-white bg-opacity-20 font-bold" : ""
                    }
                  >
                    <IonIcon
                      icon={route.icon}
                      className={isActive ? "text-white" : ""}
                    />
                    <IonLabel
                      className={isActive ? "text-white font-bold" : ""}
                    >
                      {route.label}
                    </IonLabel>
                  </IonTabButton>
                );
              })}
            </IonTabBar>
          </IonTabs>
        </IonContent>
      </div>
    </IonSplitPane>
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
