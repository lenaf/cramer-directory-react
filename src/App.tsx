import React from "react";
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonListHeader,
  IonMenuToggle,
  IonRouterOutlet,
  IonSplitPane,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
  setupIonicReact,
} from "@ionic/react";
import {
  IonApp,
  IonMenu,
  IonContent,
  IonImg,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
} from "@ionic/react";
import { home, menu } from "ionicons/icons";

import { IonReactRouter } from "@ionic/react-router";

import "@ionic/react/css/core.css";

import { AuthProvider } from "./contexts/AuthContext";

import "./theme/variables.scss"; // must be imported after ionic core for precedence
import "./global.scss";
import { Redirect, Route, useLocation } from "react-router-dom";
import { ROUTES } from "./routes";

setupIonicReact();

const AppContent: React.FC = () => {
  const location = useLocation();
  const currentRoute =
    ROUTES.find((t) => t.path === location.pathname) || ROUTES[0];

  return (
    <IonSplitPane when="sm" contentId="split-plane-content">
      {/* SIDE MENU */}

      <IonMenu contentId="split-plane-content">
        <IonHeader className="bg-secondary h-16 flex px-8 py-2">
          <IonImg src="/assets/branding/logo.png" alt="logo" />
        </IonHeader>

        <IonContent>
          <IonList>
            <IonListHeader>Navigate</IonListHeader>
            {ROUTES.map((route) => (
              <IonMenuToggle key={route.id} autoHide={false}>
                <IonItem button routerLink={route.path}>
                  <IonIcon slot="start" icon={route.icon} />
                  <IonLabel>{route.label}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            ))}
          </IonList>
        </IonContent>
      </IonMenu>

      {/* MAIN */}
      <div className="ion-page" id="split-plane-content">
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
              <Route exact path="/" render={() => <Redirect to="/home" />} />
            </IonRouterOutlet>

            <IonTabBar slot="bottom" color="secondary">
              {ROUTES.map((route) => (
                <IonTabButton key={route.id} tab={route.id} href={route.path}>
                  <IonIcon icon={route.icon} />
                  <IonLabel>{route.label}</IonLabel>
                </IonTabButton>
              ))}
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
