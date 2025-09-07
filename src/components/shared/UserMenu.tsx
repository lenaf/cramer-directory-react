import React, { useState } from 'react';
import {
  IonButton,
  IonIcon,
  IonPopover,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonImg,
  IonText
} from '@ionic/react';
import {
  personOutline,
  settingsOutline,
  logOutOutline,
  chevronDownOutline
} from 'ionicons/icons';
import { useAuthContext } from '../../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthContext();
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await logout();
      history.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setIsOpen(false);
  };

  const handleSettings = () => {
    history.push('/settings');
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <>
      <IonButton
        id="user-menu-trigger"
        fill="clear"
        className="flex items-center"
      >
        <IonAvatar className="w-8 h-8 mr-2">
          <IonImg
            src={user.user?.photoURL || '/assets/placeholders/person-circle-outline.svg'}
            alt="User avatar"
          />
        </IonAvatar>
        <span className="hidden md:inline text-sm">
          {user.user?.firstName} {user.user?.lastName}
        </span>
        <IonIcon icon={chevronDownOutline} className="ml-1" />
      </IonButton>

      <IonPopover
        trigger="user-menu-trigger"
        isOpen={isOpen}
        onDidDismiss={() => setIsOpen(false)}
        showBackdrop={true}
      >
        <IonContent>
          <IonList>
            <IonItem className="border-b">
              <IonAvatar slot="start">
                <IonImg
                  src={user.user?.photoURL || '/assets/placeholders/person-circle-outline.svg'}
                  alt="User avatar"
                />
              </IonAvatar>
              <IonLabel>
                <h3>{user.user?.firstName} {user.user?.lastName}</h3>
                <p>{user.email}</p>
                {user.role && (
                  <IonText color="medium">
                    <p className="text-xs">{user.role.name}</p>
                  </IonText>
                )}
              </IonLabel>
            </IonItem>

            <IonItem button onClick={handleSettings}>
              <IonIcon icon={settingsOutline} slot="start" />
              <IonLabel>Settings</IonLabel>
            </IonItem>

            <IonItem button onClick={handleLogout}>
              <IonIcon icon={logOutOutline} slot="start" />
              <IonLabel>Sign Out</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>
    </>
  );
};

export default UserMenu;