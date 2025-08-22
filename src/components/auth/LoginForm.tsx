import React, { useState } from 'react';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
  IonSpinner,
  IonToast
} from '@ionic/react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { authService } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email and password are required');
      setShowToast(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.signInWithEmailAndPassword(email, password);
      setEmail('');
      setPassword('');
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Sign In</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput
              type="email"
              value={email}
              placeholder="Enter your email"
              onIonInput={(e) => setEmail(e.detail.value!)}
              required
              disabled={loading}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Password</IonLabel>
            <IonInput
              type="password"
              value={password}
              placeholder="Enter your password"
              onIonInput={(e) => setPassword(e.detail.value!)}
              required
              disabled={loading}
            />
          </IonItem>

          <IonButton
            expand="block"
            type="submit"
            disabled={loading}
            style={{ marginTop: '20px' }}
          >
            {loading ? <IonSpinner name="crescent" /> : 'Sign In'}
          </IonButton>
        </form>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={error}
          duration={3000}
          color="danger"
        />
      </IonCardContent>
    </IonCard>
  );
};