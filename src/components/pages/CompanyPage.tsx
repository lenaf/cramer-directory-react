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

const CompanyPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>
            <strong className="ion-text-uppercase">Companies</strong>
          </IonTitle>
        </IonToolbar>
        
        <IonToolbar color="secondary">
          <IonSearchbar 
            debounce={500} 
            placeholder="Search companies..." 
            animated={true}
          />
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        {/* Company list and details will be implemented */}
      </IonContent>
    </IonPage>
  );
};

export default CompanyPage;