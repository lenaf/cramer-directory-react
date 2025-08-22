import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonList,
  IonItem,
  IonAvatar,
  IonImg,
  IonLabel,
  IonIcon,
  IonButton
} from '@ionic/react';
import { personOutline, settingsOutline, notificationsOutline, logOutOutline } from 'ionicons/icons';

const ProfilePage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonMenuButton menu="main-menu" />
          </IonButtons>
          <IonTitle>
            <strong className="ion-text-uppercase">Profile</strong>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <IonAvatar style={{ width: '100px', height: '100px', margin: '0 auto 20px' }}>
            <IonImg src="./assets/placeholders/person-circle-outline.svg" alt="profile" />
          </IonAvatar>
          <h2>Welcome</h2>
          <p>Sign in to access your profile and preferences</p>
          <IonButton color="secondary" style={{ marginTop: '10px' }}>
            Sign In
          </IonButton>
        </div>
        
        <IonList>
          <IonItem button>
            <IonIcon icon={personOutline} slot="start" />
            <IonLabel>Account Settings</IonLabel>
          </IonItem>
          
          <IonItem button>
            <IonIcon icon={notificationsOutline} slot="start" />
            <IonLabel>Notifications</IonLabel>
          </IonItem>
          
          <IonItem button>
            <IonIcon icon={settingsOutline} slot="start" />
            <IonLabel>App Settings</IonLabel>
          </IonItem>
          
          <IonItem button>
            <IonIcon icon={logOutOutline} slot="start" />
            <IonLabel>Sign Out</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;