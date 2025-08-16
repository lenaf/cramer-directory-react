import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { home, business, people, grid, person } from 'ionicons/icons';

import HomePage from './pages/HomePage';
import CompanyPage from './pages/CompanyPage';
import PeoplePage from './pages/PeoplePage';
import CategoryPage from './pages/CategoryPage';
import ProfilePage from './pages/ProfilePage';

const TabsLayout: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/home" component={HomePage} />
        <Route exact path="/tabs/company" component={CompanyPage} />
        <Route exact path="/tabs/people" component={PeoplePage} />
        <Route exact path="/tabs/category" component={CategoryPage} />
        <Route exact path="/tabs/profile" component={ProfilePage} />
        <Route exact path="/tabs" render={() => <Redirect to="/tabs/home" />} />
      </IonRouterOutlet>
      
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/tabs/home">
          <IonIcon icon={home} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        
        <IonTabButton tab="company" href="/tabs/company">
          <IonIcon icon={business} />
          <IonLabel>Companies</IonLabel>
        </IonTabButton>
        
        <IonTabButton tab="people" href="/tabs/people">
          <IonIcon icon={people} />
          <IonLabel>People</IonLabel>
        </IonTabButton>
        
        <IonTabButton tab="category" href="/tabs/category">
          <IonIcon icon={grid} />
          <IonLabel>Categories</IonLabel>
        </IonTabButton>
        
        <IonTabButton tab="profile" href="/tabs/profile">
          <IonIcon icon={person} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabsLayout;