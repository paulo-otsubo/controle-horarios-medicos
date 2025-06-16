import React from 'react';

export const metadata = {
  title: 'Relatórios – Exportação CSV'
};

export default function RelatoriosLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-[calc(100vh-4rem)] p-4 md:p-6 bg-gray-50">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Relatórios</h1>
      </header>
      <main>{children}</main>
    </section>
  );
}
