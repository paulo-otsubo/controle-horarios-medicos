import './globals.css';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { cn } from '../lib/utils';

const fontSans = Nunito({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'Controle de Horários Médicos',
  description: 'Uma forma moderna de gerenciar a carga horária de médicos.',
  manifest: '/manifest.json'
};

const HeadTags = () => (
  <>
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#3b82f6" />
    <link rel="apple-touch-icon" href="/icon-192.png" />
  </>
);

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <HeadTags />
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        {children}
      </body>
    </html>
  );
}
