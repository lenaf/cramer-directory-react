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
import { personAddOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';
import { useAuthContext } from '../../contexts/AuthContext';
import { useHistory } from 'react-router-dom';
import { validateEmail, validatePassword, validatePasswordMatch, getFirebaseErrorMessage } from '../../utils/authValidation';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuthContext();
  const history = useHistory();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmErr = validatePasswordMatch(password, confirmPassword);
    
    if (emailErr || passwordErr || confirmErr) {
      setError(emailErr || passwordErr || confirmErr);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signUp(email, password);
      history.push('/people');
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" />
          </IonButtons>
          <IonTitle>Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="flex items-center justify-center min-h-full">
          <IonCard className="w-full max-w-md">
            <IonCardContent>
              <form onSubmit={handleSignup}>
                <div className="text-center mb-6">
                  <IonIcon icon={personAddOutline} className="text-4xl text-primary mb-2" />
                  <h2 className="text-xl font-bold">Create Account</h2>
                </div>

                {error && (
                  <IonText color="danger" className="block mb-4">
                    <p className="text-sm">{error}</p>
                  </IonText>
                )}

                <IonItem className="mb-4">
                  <IonIcon icon={mailOutline} slot="start" />
                  <IonLabel position="stacked">Email</IonLabel>
                  <IonInput
                    type="email"
                    value={email}
                    onIonInput={(e) => setEmail(e.detail.value || '')}
                    required
                  />
                </IonItem>

                <IonItem className="mb-4">
                  <IonIcon icon={lockClosedOutline} slot="start" />
                  <IonLabel position="stacked">Password</IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonInput={(e) => setPassword(e.detail.value || '')}
                    required
                  />
                </IonItem>

                <IonItem className="mb-6">
                  <IonIcon icon={lockClosedOutline} slot="start" />
                  <IonLabel position="stacked">Confirm Password</IonLabel>
                  <IonInput
                    type="password"
                    value={confirmPassword}
                    onIonInput={(e) => setConfirmPassword(e.detail.value || '')}
                    required
                  />
                </IonItem>

                <IonButton
                  expand="block"
                  type="submit"
                  disabled={loading || !email || !password || !confirmPassword}
                >
                  {loading ? <IonSpinner name="crescent" /> : 'Create Account'}
                </IonButton>

                <div className="text-center mt-4">
                  <IonButton
                    fill="clear"
                    size="small"
                    routerLink="/login"
                  >
                    Already have an account? Sign in
                  </IonButton>
                </div>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignupPage;