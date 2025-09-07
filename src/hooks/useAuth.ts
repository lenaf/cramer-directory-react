import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
  sendEmailVerification,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useFirestoreDocument } from './useFirestoreDocument';
import { Auth, User, Role } from '../types/Auth';

export const useAuth = () => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Get user document from Firestore
  const { data: userData } = useFirestoreDocument<User>(
    firebaseUser ? `user/${firebaseUser.uid}` : '',
    { enabled: !!firebaseUser }
  );

  // Get role document from Firestore
  const { data: roleData } = useFirestoreDocument<Role>(
    userData?.roleId ? `role/${userData.roleId}` : '',
    { enabled: !!userData?.roleId }
  );

  // Combined auth object
  const authUser: Auth | null = firebaseUser && userData ? {
    ...firebaseUser,
    user: userData,
    role: roleData || null
  } : null;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return signOut(auth);
  };

  const resetPassword = async (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const sendVerificationEmail = async () => {
    if (firebaseUser) {
      return sendEmailVerification(firebaseUser);
    }
    throw new Error('No user logged in');
  };

  return {
    user: authUser,
    loading,
    signIn,
    signUp,
    logout,
    resetPassword,
    sendVerificationEmail,
    isAuthenticated: !!authUser,
    isAdmin: authUser?.role?.name === 'admin'
  };
};