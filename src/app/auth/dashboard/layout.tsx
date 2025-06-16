import React from 'react';
import PageHeader from '../../../components/layout/PageHeader';

// Layout base para o dashboard autenticado
export const metadata = {
  title: 'Dashboard – Controle de Horários'
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-[calc(100vh-4rem)] p-4 md:p-6 bg-gray-50">
      <PageHeader title="Dashboard" />
      <main className="space-y-6">{children}</main>
    </section>
  );
}
