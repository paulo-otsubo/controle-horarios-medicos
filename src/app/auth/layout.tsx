'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import BottomNav from '../../components/layout/BottomNav';
import { useRegistrosSync } from '../../hooks/useRegistrosSync';
import AppHeader from '../../components/layout/AppHeader';

export default function AuthRootLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${pathname}`);
    }
  }, [loading, user, router, pathname]);

  // start Firestore sync once authenticated
  useRegistrosSync();

  // onboarding equipe
  useEffect(() => {
    if (!loading && user) {
      const eqId = localStorage.getItem('equipeId');
      if (!eqId && !pathname.startsWith('/auth/equipe')) {
        router.replace('/auth/equipe/onboarding');
      }
    }
  }, [loading, user, pathname, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-gray-50 pb-20">
        <div className="container mx-auto p-4">{children}</div>
      </main>
      <BottomNav />
    </>
  );
}
