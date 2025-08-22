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

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Emulator setup (for development)
const useEmulators = false;

if (useEmulators && process.env.NODE_ENV === 'development') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectStorageEmulator(storage, 'localhost', 9199);
    connectFunctionsEmulator(functions, 'localhost', 5001);
    console.log('Connected to Firebase emulators');
  } catch (error) {
    console.log('Emulators already connected or failed to connect:', error);
  }
}

export default app;