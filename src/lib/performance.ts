import { initializeApp, getApps } from 'firebase/app';
import { getPerformance } from 'firebase/performance';

type Perf = ReturnType<typeof getPerformance>;
let perfInstance: Perf | null = null;

export function initPerformance() {
  if (typeof window === 'undefined' || perfInstance) return perfInstance;
  try {
    const app =
      getApps().length > 0
        ? getApps()[0]
        : initializeApp({
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
            measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!
          });
    perfInstance = getPerformance(app);
    return perfInstance;
  } catch (e) {
    console.warn('Performance init falhou', e);
    return null;
  }
}
