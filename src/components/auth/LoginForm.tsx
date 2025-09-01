import React, { useState } from 'react';
import {
  IonButton,
  IonInput,
  IonItem,
  IonList,
  IonIcon,
  IonRow,
  IonCol,
  IonText,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons
} from '@ionic/react';
import { informationCircleOutline, logoApple, logoGoogle, logoLinkedin } from 'ionicons/icons';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { authService } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { email?: string; password?: string } = {};
    
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
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      try {
        await authService.signInWithEmailAndPassword(email, password);
        onClose();
      } catch (error) {
        console.error('Login error:', error);
        setErrors({ email: 'Invalid email or password' });
      }
    }
  };

  const handleSocialLogin = async (provider: string) => {
    // Social login not implemented yet
    console.log(`${provider} login not implemented`);
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={onClose}>
              Close
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit}>
          <IonList>
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
          </IonList>

          <IonButton
            className="login-btn"
            type="submit"
            expand="block"
            disabled={!email || !password}
          >
            Log In
          </IonButton>

          <IonRow className="other-auth-options-row">
            <IonButton className="forgot-btn" fill="clear">
              Forgot Password?
            </IonButton>
            <IonButton className="signup-btn" fill="clear">
              Sign Up!
            </IonButton>
          </IonRow>
        </form>

        <p className="options-divider" style={{ textAlign: 'center', margin: '20px 0' }}>Or</p>
        
        <IonRow>
          <IonCol>
            <IonButton
              className="social-auth-btn apple-auth-btn"
              expand="block"
              color="dark"
              disabled
            >
              <IonIcon icon={logoApple} />
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton
              className="social-auth-btn google-auth-btn"
              expand="block"
              color="danger"
              disabled
            >
              <IonIcon icon={logoGoogle} />
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton
              className="social-auth-btn linkedin-auth-btn"
              expand="block"
              color="primary"
              disabled
            >
              <IonIcon icon={logoLinkedin} />
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonModal>
  );
};

export default LoginForm;