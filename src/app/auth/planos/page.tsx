'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';

const planos = [
  {
    nome: 'Básico',
    preco: 'Grátis',
    descricao: 'Para médicos individuais e equipes pequenas.',
    recursos: ['Até 5 membros na equipe', 'Registros ilimitados', 'Relatórios básicos'],
    cta: 'Começar Agora',
    href: '/public/cadastro'
  },
  {
    nome: 'Pro',
    preco: 'R$ 29/mês',
    descricao: 'Para equipes maiores com necessidade de mais controle.',
    recursos: ['Membros ilimitados', 'Exportação de dados (CSV)', 'Suporte prioritário'],
    cta: 'Fale Conosco',
    href: 'mailto:contato@pontomedico.com'
  }
];

export default function PlanosPage() {
  return (
    <div className="py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Planos flexíveis para cada necessidade</h1>
        <p className="text-md mt-2 text-gray-600">
          Comece gratuitamente e evolua conforme sua equipe cresce.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        {planos.map((plano) => (
          <div key={plano.nome} className="flex flex-col rounded-lg border p-6">
            <h2 className="text-xl font-bold">{plano.nome}</h2>
            <p className="my-4 text-3xl font-bold">{plano.preco}</p>
            <p className="mb-4 text-gray-600">{plano.descricao}</p>
            <ul className="mb-6 space-y-2">
              {plano.recursos.map((recurso) => (
                <li key={recurso} className="flex items-center">
                  <svg
                    className="mr-2 size-4 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  {recurso}
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <Link href={plano.href} passHref>
                <Button className="w-full">{plano.cta}</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
