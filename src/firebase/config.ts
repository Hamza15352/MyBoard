// firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Yahan apna actual Firebase config paste karo
const firebaseConfig = {
   apiKey: "AIzaSyA_N8mSGpBgxNPuyWZQGwYhS8g8YzGJWyc",
  authDomain: "my-board-e4900.firebaseapp.com",
  projectId: "my-board-e4900",
  storageBucket: "my-board-e4900.firebasestorage.app",
  messagingSenderId: "858275439687",
  appId: "1:858275439687:web:5a15e53af356a3648abd62",
  measurementId: "G-0PG7ZFFZM2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;