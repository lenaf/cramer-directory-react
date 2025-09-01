import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonList,
  IonItem,
  IonAvatar,
  IonImg,
  IonLabel,
  IonIcon,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonMenuToggle,
} from "@ionic/react";
import {
  personOutline,
  settingsOutline,
  notificationsOutline,
  logOutOutline,
  peopleOutline,
  starOutline,
  menu,
} from "ionicons/icons";
import { useAuth } from "../../contexts/AuthContext";
import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";

const ProfilePage: React.FC = () => {
  const { auth, authService, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonMenuToggle>
              <IonButton>
                <IonIcon slot="icon-only" icon={menu}></IonIcon>
              </IonButton>
            </IonMenuToggle>
          </IonButtons>
          <IonTitle>
            <strong className="ion-text-uppercase">Profile</strong>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          ></div>
        ) : auth ? (
          // Authenticated user view
          <>
            <div style={{ padding: "20px", textAlign: "center" }}>
              <IonAvatar
                style={{
                  width: "100px",
                  height: "100px",
                  margin: "0 auto 20px",
                }}
              >
                <IonImg
                  src={
                    auth.user?.photoURL ||
                    "./assets/placeholders/person-circle-outline.svg"
                  }
                  alt="profile"
                />
              </IonAvatar>
              <h2>{auth.user?.displayName || "User"}</h2>
              <p>{auth.user?.email}</p>
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

              <IonItem button onClick={handleSignOut}>
                <IonIcon icon={logOutOutline} slot="start" />
                <IonLabel>Sign Out</IonLabel>
              </IonItem>
            </IonList>
          </>
        ) : (
          // Unauthenticated user view - matching Angular welcome screen
          <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>Profile</IonCardSubtitle>
              <IonCardTitle>Login or Create a New Account</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <p>Account Benefits:</p>
              <IonList>
                <IonItem>
                  <IonIcon icon={peopleOutline} slot="start" />
                  <IonLabel>
                    <h2>Access Contact Information</h2>
                    <p>Gain access to contact information</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon icon={starOutline} slot="start" />
                  <IonLabel>
                    <h2>Favorites</h2>
                    <p>Save your favorite people for quick access</p>
                  </IonLabel>
                </IonItem>
              </IonList>

              <IonButton
                color="secondary"
                expand="block"
                onClick={() => setShowLoginModal(true)}
              >
                Login
              </IonButton>
              <IonButton
                color="secondary"
                expand="block"
                fill="outline"
                onClick={() => setShowRegisterModal(true)}
              >
                Create Account
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        <LoginForm
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
        <RegisterForm
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
