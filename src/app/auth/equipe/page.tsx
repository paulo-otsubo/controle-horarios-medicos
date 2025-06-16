'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTeam } from '../../../hooks/useTeam';
import { useAuth } from '../../../hooks/useAuth';
import { useUsersByIds } from '../../../hooks/useUsersByIds';
import { inviteMember } from '../../../lib/team';
import { Button } from '../../../components/ui/button';
import { PlusIcon, UserPlusIcon, UsersIcon } from '@heroicons/react/24/outline';
import AdminGuard from '../../../components/auth/AdminGuard';

export default function EquipePage() {
  const team = useTeam();
  const { user } = useAuth();
  const members = useUsersByIds(team?.membros || []);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isAdmin = team && user && team.adminId === user.uid;

  async function handleInvite() {
    if (!team) return;
    setLoading(true);
    const c = await inviteMember(team.id as string, email);
    setCode(c);
    setLoading(false);
  }

  return (
    <AdminGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Sua Equipe</h1>
            <p className="text-sm text-gray-600">
              Gerencie os membros da sua equipe e envie convites.
            </p>
          </div>
          <Button asChild>
            <Link href="/auth/equipe/nova">
              <PlusIcon className="mr-2 size-4" />
              Nova Equipe
            </Link>
          </Button>
        </div>

        {team ? (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">{team.nome}</h2>
              {team.descricao && <p className="text-sm text-gray-600">{team.descricao}</p>}
            </div>

            <h3 className="text-md mb-2 font-semibold text-gray-800">Membros</h3>
            <ul className="mb-6 space-y-2">
              {members.map((m) => (
                <li
                  key={m.uid}
                  className="flex items-center justify-between rounded-lg border bg-gray-50 p-3 shadow-sm"
                >
                  <span className="font-medium text-gray-800">{m.nome || m.email}</span>
                  {m.uid === team.adminId && (
                    <span className="rounded-full bg-purple-500 px-2 py-0.5 text-xs font-semibold text-white">
                      Admin
                    </span>
                  )}
                </li>
              ))}
            </ul>

            {isAdmin && (
              <div className="space-y-4 rounded-lg border bg-gray-50 p-4 shadow-sm">
                <h3 className="flex items-center gap-2 font-medium text-gray-800">
                  <UserPlusIcon className="size-5" />
                  Convidar novo membro
                </h3>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
                {code && (
                  <p className="rounded-md bg-green-50 p-2 text-sm text-gray-600">
                    Código de convite: <span className="font-mono text-green-700">{code}</span>
                  </p>
                )}
                <Button
                  disabled={loading || !email.includes('@')}
                  onClick={handleInvite}
                  className="w-full"
                >
                  {loading ? 'Gerando convite...' : 'Gerar Convite'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg bg-white py-12 text-center shadow-sm">
            <UsersIcon className="mx-auto size-12 text-gray-400" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">Nenhuma equipe encontrada</h2>
            <p className="mt-1 text-sm text-gray-500">
              Você ainda não faz parte de uma equipe. Crie uma ou peça um convite.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button asChild>
                <Link href="/auth/equipe/nova">
                  <PlusIcon className="mr-2 size-4" />
                  Criar Nova Equipe
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/auth/equipe/join">
                  <UserPlusIcon className="mr-2 size-4" />
                  Entrar com Código
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
