import React from 'react';

// Layout base para o dashboard autenticado
export const metadata = {
  title: 'Dashboard – Controle de Horários'
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <section className="space-y-6">{children}</section>;
}
