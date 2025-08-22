import React, { useEffect } from 'react';
import { setupIonicReact } from '@ionic/react';
import { 
  IonApp, 
  IonSplitPane, 
  IonMenu, 
  IonContent, 
  IonImg, 
  IonList, 
  IonItemGroup, 
  IonItem, 
  IonLabel, 
  IonIcon,
  IonSpinner 
} from '@ionic/react';
import { menuController } from '@ionic/core/components';
import { IonReactRouter } from '@ionic/react-router';
import { openOutline } from 'ionicons/icons';
import { Browser } from '@capacitor/browser';

import '@ionic/react/css/core.css';

import { AuthProvider } from './contexts/AuthContext';
import { NavigationProvider } from './contexts/NavigationContext';
import TabsLayout from './components/TabsLayout';
import { useNavigation } from './hooks/useNavigation';

import './theme/variables.scss';
import './global.scss';

setupIonicReact();

const AppContent: React.FC = () => {
  const { data: navigation, loading } = useNavigation();

  useEffect(() => {
    // Enable the menu when the component mounts
    menuController.enable(true, 'main-menu');
  }, []);

  const handleNavigationClick = async (item: any) => {
    if (item.isExternalLink) {
      await Browser.open({ url: item.link });
    }
  };

  return (
    <IonSplitPane contentId="main-content" when="lg">
      <IonMenu contentId="main-content" menuId="main-menu" type="overlay">
        <IonContent>
          <IonImg
            src="/assets/branding/logo.png"
            alt="Logo"
          />

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <IonSpinner />
            </div>
          ) : (
            <IonList>
              <IonItemGroup>
                {navigation.map((item, index) => (
                  <IonItem key={item.id || index} button onClick={() => handleNavigationClick(item)}>
                    <IonLabel>{item.title}</IonLabel>
                    {item.isExternalLink && (
                      <IonIcon icon={openOutline} slot="end" />
                    )}
                  </IonItem>
                ))}
              </IonItemGroup>
            </IonList>
          )}
        </IonContent>
      </IonMenu>

      <TabsLayout />
    </IonSplitPane>
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