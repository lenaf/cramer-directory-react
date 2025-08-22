import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonText
} from '@ionic/react';
import { LoginForm } from '../auth/LoginForm';
import { RegisterForm } from '../auth/RegisterForm';
import { useAuth } from '../../contexts/AuthContext';

export const AuthPage: React.FC = () => {
  const { authService } = useAuth();
  const [segment, setSegment] = useState<'login' | 'register'>('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setResetMessage('Please enter your email address');
      return;
    }

    try {
      await authService.sendPasswordResetEmail(resetEmail);
      setResetMessage('Password reset email sent! Check your inbox.');
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error: any) {
      setResetMessage(error.message || 'Failed to send password reset email');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Authentication</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonSegment
          value={segment}
          onIonChange={(e) => setSegment(e.detail.value as 'login' | 'register')}
        >
          <IonSegmentButton value="login">
            <IonLabel>Sign In</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="register">
            <IonLabel>Register</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        <div style={{ marginTop: '20px' }}>
          {segment === 'login' ? (
            <>
              <LoginForm />
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <IonButton
                  fill="clear"
                  size="small"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot Password?
                </IonButton>
              </div>
            </>
          ) : (
            <RegisterForm />
          )}
        </div>

        {showForgotPassword && (
          <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Reset Password</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />
            <div>
              <IonButton onClick={handlePasswordReset}>
                Send Reset Email
              </IonButton>
              <IonButton
                fill="clear"
                onClick={() => setShowForgotPassword(false)}
              >
                Cancel
              </IonButton>
            </div>
            {resetMessage && (
              <IonText color={resetMessage.includes('sent') ? 'success' : 'danger'}>
                <p>{resetMessage}</p>
              </IonText>
            )}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};