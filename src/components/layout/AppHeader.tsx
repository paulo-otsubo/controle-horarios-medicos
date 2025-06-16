'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 bg-teal-600 shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <Link href="/auth/dashboard" className="flex items-center gap-2">
            <Image
              src="/favicon.svg"
              alt="PontoMédico Logo"
              width={28}
              height={28}
              className="rounded-full bg-white p-0.5"
            />
            <h1 className="text-lg font-bold tracking-tight text-white">PontoMédico</h1>
          </Link>
          {/* Futuramente, podemos adicionar ações ou um menu de usuário aqui */}
        </div>
      </div>
    </header>
  );
}
