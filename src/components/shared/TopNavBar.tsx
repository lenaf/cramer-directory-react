import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonMenuToggle
} from '@ionic/react';
import { menu, logInOutline } from 'ionicons/icons';
import { useAuthContext } from '../../contexts/AuthContext';
import UserMenu from './UserMenu';

interface TopNavBarProps {
  title: string;
  subtitle?: string;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ title, subtitle }) => {
  const { user } = useAuthContext();

  return (
    <IonHeader>
      <IonToolbar color="secondary">
        <IonButtons slot="start">
          <IonMenuToggle>
            <IonButton>
              <IonIcon slot="icon-only" icon={menu} />
            </IonButton>
          </IonMenuToggle>
        </IonButtons>
        
        <IonTitle>
          <strong className="ion-text-uppercase">
            {title} {subtitle && <span style={{ opacity: 0.5 }}>{subtitle}</span>}
          </strong>
        </IonTitle>

        <IonButtons slot="end">
          {user ? (
            <UserMenu />
          ) : (
            <IonButton fill="clear" routerLink="/login">
              <IonIcon icon={logInOutline} slot="start" />
              Login
            </IonButton>
          )}
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default TopNavBar;