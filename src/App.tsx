import React from 'react';
import { setupIonicReact } from '@ionic/react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';

import '@ionic/react/css/core.css';

import { FirebaseProvider } from './contexts/FirebaseContext';
import { AuthProvider } from './contexts/AuthContext';
import { NavigationProvider } from './contexts/NavigationContext';
import TabsLayout from './components/TabsLayout';

import './theme/variables.scss';
import './global.scss';

setupIonicReact();

function App() {
  return (
    <IonApp>
      <FirebaseProvider>
        <AuthProvider>
          <NavigationProvider>
            <IonReactRouter>
              <IonRouterOutlet>
                <Route path="/tabs" render={() => <TabsLayout />} />
                <Route exact path="/" render={() => <Redirect to="/tabs/home" />} />
              </IonRouterOutlet>
            </IonReactRouter>
          </NavigationProvider>
        </AuthProvider>
      </FirebaseProvider>
    </IonApp>
  );
}

export default App;