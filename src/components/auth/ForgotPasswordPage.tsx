import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonSpinner,
  IonIcon,
  IonButtons,
  IonBackButton
} from '@ionic/react';
import { mailOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { useAuthContext } from '../../contexts/AuthContext';
import { validateEmail, getFirebaseErrorMessage } from '../../utils/authValidation';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuthContext();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/login" />
            </IonButtons>
            <IonTitle>Password Reset</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <div className="flex items-center justify-center min-h-full">
            <IonCard className="w-full max-w-md">
              <IonCardContent className="text-center">
                <IonIcon icon={checkmarkCircleOutline} className="text-6xl text-success mb-4" />
                <h2 className="text-xl font-bold mb-2">Check Your Email</h2>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to {email}
                </p>
                <IonButton expand="block" routerLink="/login">
                  Back to Sign In
                </IonButton>
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" />
          </IonButtons>
          <IonTitle>Reset Password</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="flex items-center justify-center min-h-full">
          <IonCard className="w-full max-w-md">
            <IonCardContent>
              <form onSubmit={handleResetPassword}>
                <div className="text-center mb-6">
                  <IonIcon icon={mailOutline} className="text-4xl text-primary mb-2" />
                  <h2 className="text-xl font-bold">Reset Password</h2>
                  <p className="text-gray-600 mt-2">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                {error && (
                  <IonText color="danger" className="block mb-4">
                    <p className="text-sm">{error}</p>
                  </IonText>
                )}

                <IonItem className="mb-6">
                  <IonIcon icon={mailOutline} slot="start" />
                  <IonLabel position="stacked">Email</IonLabel>
                  <IonInput
                    type="email"
                    value={email}
                    onIonInput={(e) => setEmail(e.detail.value!)}
                    required
                  />
                </IonItem>

                <IonButton
                  expand="block"
                  type="submit"
                  disabled={loading || !email}
                >
                  {loading ? <IonSpinner name="crescent" /> : 'Send Reset Link'}
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPasswordPage;