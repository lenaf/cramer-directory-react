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
      <IonRouterOutlet id="main-content">
        <Route exact path="/home" component={HomePage} />
        <Route exact path="/people" component={PeoplePage} />
        <Route exact path="/company" component={CompanyPage} />
        <Route exact path="/category" component={CategoryPage} />
        <Route exact path="/profile" component={ProfilePage} />
        <Route exact path="/" render={() => <Redirect to="/home" />} />
      </IonRouterOutlet>
      
      <IonTabBar slot="bottom" color="secondary">
        <IonTabButton tab="home" href="/home">
          <IonIcon icon={home} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        
        <IonTabButton tab="people" href="/people">
          <IonIcon icon={people} />
          <IonLabel>People</IonLabel>
        </IonTabButton>
        
        <IonTabButton tab="company" href="/company">
          <IonIcon icon={business} />
          <IonLabel>Companies</IonLabel>
        </IonTabButton>
        
        <IonTabButton tab="category" href="/category">
          <IonIcon icon={grid} />
          <IonLabel>Categories</IonLabel>
        </IonTabButton>
        
        <IonTabButton tab="profile" href="/profile">
          <IonIcon icon={person} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabsLayout;