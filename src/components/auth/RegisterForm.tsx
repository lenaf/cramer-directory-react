import React, { useState } from 'react';
import {
  IonButton,
  IonInput,
  IonItem,
  IonList,
  IonIcon,
  IonRow,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons
} from '@ionic/react';
import { informationCircleOutline } from 'ionicons/icons';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  const { authService } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      try {
        await authService.createUserWithEmailAndPassword(email, password);
        onClose();
      } catch (error) {
        console.error('Registration error:', error);
        setErrors({ email: 'Registration failed. Please try again.' });
      }
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sign Up</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={onClose}>
              Close
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit}>
          <IonList className="inputs-list">
            <IonItem className="input-item">
              <IonInput
                type="email"
                placeholder="Email"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value!)}
                clearInput
                autocapitalize="off"
              />
            </IonItem>
            {errors.email && (
              <div className="error-container">
                <div className="error-message">
                  <IonIcon icon={informationCircleOutline} />
                  <span>{errors.email}</span>
                </div>
              </div>
            )}

            <IonItem className="input-item">
              <IonInput
                type="password"
                placeholder="Password"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
              />
            </IonItem>
            {errors.password && (
              <div className="error-container">
                <div className="error-message">
                  <IonIcon icon={informationCircleOutline} />
                  <span>{errors.password}</span>
                </div>
              </div>
            )}

            <IonItem className="input-item">
              <IonInput
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onIonInput={(e) => setConfirmPassword(e.detail.value!)}
              />
            </IonItem>
            {errors.confirmPassword && (
              <div className="error-container">
                <div className="error-message">
                  <IonIcon icon={informationCircleOutline} />
                  <span>{errors.confirmPassword}</span>
                </div>
              </div>
            )}
          </IonList>

          <IonButton
            className="signup-btn"
            type="submit"
            expand="block"
            disabled={!email || !password || !confirmPassword}
          >
            Continue
          </IonButton>

          <IonRow className="other-auth-options-row">
            <IonButton className="login-btn" fill="clear" onClick={onClose}>
              Already have an account?
            </IonButton>
          </IonRow>
        </form>
      </IonContent>
    </IonModal>
  );
};

export default RegisterForm;