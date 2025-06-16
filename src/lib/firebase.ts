import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!
};

// Initialize Firebase app (singleton pattern for Next.js hot reload)
let app;
if (typeof window === 'undefined') {
  // Server-side: create new app instance always – avoids global pollution
  app = initializeApp(firebaseConfig, 'server');
} else {
  // Client-side: reuse existing instance if it exists
  // @ts-expect-error – armazenar instância no objeto global
  app = window._firebaseApp ?? initializeApp(firebaseConfig);
  // @ts-expect-error – adicionar ao objeto global
  window._firebaseApp = app;
}

export const auth = getAuth(app);
export const db = getFirestore(app);
