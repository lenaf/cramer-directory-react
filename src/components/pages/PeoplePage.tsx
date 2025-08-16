import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonSearchbar
} from '@ionic/react';

const PeoplePage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>
            <strong className="ion-text-uppercase">People</strong>
          </IonTitle>
        </IonToolbar>
        
        <IonToolbar color="secondary">
          <IonSearchbar 
            debounce={500} 
            placeholder="Search people..." 
            animated={true}
          />
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        {/* People list and details will be implemented */}
      </IonContent>
    </IonPage>
  );
};

export default PeoplePage;