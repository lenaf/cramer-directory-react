import React, { useEffect } from "react";
import { setupIonicReact } from "@ionic/react";
import {
  IonApp,
  IonMenu,
  IonContent,
  IonImg,
  IonList,
  IonItemGroup,
  IonItem,
  IonLabel,
  IonIcon,
} from "@ionic/react";

import { IonReactRouter } from "@ionic/react-router";

import { Browser } from "@capacitor/browser";
import { menuController } from "@ionic/core/components";

import "@ionic/react/css/core.css";

import { AuthProvider } from "./contexts/AuthContext";
import { NavigationProvider } from "./contexts/NavigationContext";
import TabsLayout from "./components/TabsLayout";
import { useNavigation } from "./hooks/useNavigation";

import "./theme/variables.scss"; // must be imported after ionic core for precedence
import "./global.scss";

setupIonicReact();

const AppContent: React.FC = () => {
  const { data: navigation } = useNavigation();

  useEffect(() => {
    const waitForTabs = () => {
      const tabs = document.querySelector("ion-tabs");
      if (tabs) {
        tabs.id = "main-content";
        // Wait a bit more to ensure the element is fully ready
        setTimeout(() => {
          menuController.enable(true, "main-menu");
        }, 100);
      } else {
        // Keep checking until tabs are found
        setTimeout(waitForTabs, 100);
      }
    };
    waitForTabs();
  }, []);

  const handleNavigationClick = async (item: any) => {
    if (item.isExternalLink) {
      await Browser.open({ url: item.link });
    }
  };

  return (
    <>
      <IonMenu contentId="main-content" menuId="main-menu" type="overlay">
        <IonContent>
          <IonImg
            src="/assets/branding/logo.png"
            alt="The Wisconsin State Capitol building in Madison, WI at night"
            style={{ padding: "32px 96px" }}
          />
          <IonList>
            {navigation && (
              <IonItemGroup>
                {navigation.map((item, index) => (
                  <IonItem
                    key={index}
                    onClick={() => handleNavigationClick(item)}
                  >
                    <IonLabel>{item.title}</IonLabel>
                    {item.isExternalLink && (
                      <IonIcon name="open-outline" slot="end" />
                    )}
                  </IonItem>
                ))}
              </IonItemGroup>
            )}
          </IonList>
        </IonContent>
      </IonMenu>
      <TabsLayout />
    </>
  );
};

function App() {
  return (
    <IonApp>
      <AuthProvider>
        <NavigationProvider>
          <IonReactRouter>
            <AppContent />
          </IonReactRouter>
        </NavigationProvider>
      </AuthProvider>
    </IonApp>
  );
}

export default App;
