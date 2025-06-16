import { initializeApp, getApps } from 'firebase/app';
// Firebase Analytics modular namespace import
import * as firebaseAnalytics from 'firebase/analytics';

// Definição mínima de tipos para contornar ausência nas typings oficiais
interface AnalyticsNS {
  getAnalytics(app: ReturnType<typeof initializeApp>): unknown;
  logEvent(ga: unknown, name: string, params?: Record<string, unknown>): void;
}

const fa = firebaseAnalytics as unknown as AnalyticsNS;

type AnalyticsType = ReturnType<AnalyticsNS['getAnalytics']>;

export function initAnalytics(): AnalyticsType | null {
  if (typeof window === 'undefined') return null;
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return fa.getAnalytics(app);
  } catch (e) {
    console.warn('Analytics init falhou', e);
    return null;
  }
}

export function logEventSafe(name: string, params?: Record<string, unknown>) {
  const ga = initAnalytics();
  if (ga) {
    fa.logEvent(ga, name, params as Record<string, unknown>);
  }
}
