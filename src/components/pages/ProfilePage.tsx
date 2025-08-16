import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton
} from '@ionic/react';

const ProfilePage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>
            <strong className="ion-text-uppercase">Profile</strong>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        {/* Profile content will be implemented */}
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;