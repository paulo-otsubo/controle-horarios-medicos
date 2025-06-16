import React from 'react';
import PerformanceInit from '../components/PerformanceInit';
import './globals.css';

export const metadata = {
  title: 'Controle de Horários Médicos',
  description: 'Sistema mobile-first para registro de horários de equipes médicas.'
};

const HeadTags = () => (
  <>
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#3b82f6" />
    <link rel="apple-touch-icon" href="/icon-192.png" />
  </>
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <HeadTags />
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <PerformanceInit />
        {children}
      </body>
    </html>
  );
}
