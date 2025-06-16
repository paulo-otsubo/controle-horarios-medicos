'use client';

import React, { useEffect } from 'react';
import { useRole } from '../../hooks/useRole';
import { useRouter } from 'next/navigation';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { role, loading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role !== 'admin') {
      router.replace('/');
    }
  }, [loading, role, router]);

  if (loading) {
    return <p className="p-4 text-center text-gray-600">Verificando permissões...</p>;
  }

  if (role !== 'admin') {
    return <p className="p-4 text-center text-gray-600">Acesso restrito aos administradores...</p>;
  }

  return <>{children}</>;
}
