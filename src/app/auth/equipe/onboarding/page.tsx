'use client';

import React from 'react';
import Link from 'next/link';

export default function OnboardingPage() {
  return (
    <div className="py-12 text-center">
      <h1 className="text-2xl font-bold text-gray-800">Quase lá!</h1>
      <p className="mt-2 text-sm text-gray-600">
        Para começar, crie uma equipe ou junte-se a uma existente com um código de convite.
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <Link href="/auth/equipe/nova" className="bg-primary rounded-lg px-4 py-2 text-white">
          Criar Nova Equipe
        </Link>
        <Link href="/auth/equipe/join" className="rounded-lg bg-gray-200 px-4 py-2 text-gray-800">
          Entrar com Código
        </Link>
      </div>
    </div>
  );
}
