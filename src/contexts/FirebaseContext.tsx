import React, { createContext, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyADpN4ZhFo4dKMrRI2eYY29Ms-eBcg8qRw",
  authDomain: "cramer-associates.firebaseapp.com",
  projectId: "cramer-associates",
  storageBucket: "cramer-associates.firebasestorage.app",
  messagingSenderId: "2046035536",
  appId: "1:2046035536:web:4b9cd9f468febefdbe3355",
  measurementId: "G-M6769ZZCXB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const functions = getFunctions(app);

console.log('Firebase initialized:', { app, db, auth });

const useEmulators = false;

if (useEmulators) {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  connectStorageEmulator(storage, 'localhost', 9199);
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

interface FirebaseContextType {
  db: typeof db;
  auth: typeof auth;
  storage: typeof storage;
  functions: typeof functions;
}

const FirebaseContext = createContext<FirebaseContextType>({
  db,
  auth,
  storage,
  functions
});

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <FirebaseContext.Provider value={{ db, auth, storage, functions }}>
      {children}
    </FirebaseContext.Provider>
  );
};