import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonIcon,
  IonChip,
  IonAvatar,
  IonImg
} from '@ionic/react';
import { personOutline, mailOutline, logOutOutline, shieldOutline } from 'ionicons/icons';
import { useAuth } from '../../contexts/AuthContext';
import { getPermissionIds } from '../../types/Auth';

interface UserProfileProps {
  showSignOut?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ showSignOut = true }) => {
  const { auth, authService } = useAuth();

  if (!auth) {
    return null;
  }

  const permissions = getPermissionIds(auth);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IonAvatar>
              {auth.photoURL ? (
                <IonImg src={auth.photoURL} alt="Profile" />
              ) : (
                <IonIcon icon={personOutline} />
              )}
            </IonAvatar>
            <div>
              <h2>{auth.displayName || auth.user?.displayName || 'User'}</h2>
              {auth.user?.displayName && auth.displayName !== auth.user.displayName && (
                <p style={{ margin: 0, fontSize: '14px' }}>{auth.user.displayName}</p>
              )}
            </div>
          </div>
        </IonCardTitle>
      </IonCardHeader>
      
      <IonCardContent>
        <IonList>
          <IonItem>
            <IonIcon icon={mailOutline} slot="start" />
            <IonLabel>
              <h3>Email</h3>
              <p>{auth.email}</p>
            </IonLabel>
          </IonItem>

          {auth.role?.name && (
            <IonItem>
              <IonIcon icon={shieldOutline} slot="start" />
              <IonLabel>
                <h3>Role</h3>
                <p>{auth.role.name}</p>
              </IonLabel>
            </IonItem>
          )}

          {permissions.length > 0 && (
            <IonItem>
              <IonIcon icon={shieldOutline} slot="start" />
              <IonLabel>
                <h3>Permissions</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
                  {permissions.map((permission, index) => (
                    <IonChip key={index} color="primary" outline>
                      {permission}
                    </IonChip>
                  ))}
                </div>
              </IonLabel>
            </IonItem>
          )}
        </IonList>

        {showSignOut && (
          <IonButton
            expand="block"
            fill="outline"
            color="danger"
            onClick={handleSignOut}
            style={{ marginTop: '20px' }}
          >
            <IonIcon icon={logOutOutline} slot="start" />
            Sign Out
          </IonButton>
        )}
      </IonCardContent>
    </IonCard>
  );
};