'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEquipeStore } from '../../../../stores/equipeStore';
import EquipeForm from '../../../../components/equipe/EquipeForm';
import { useAuth } from '../../../../hooks/useAuth';
import { createTeam } from '../../../../lib/team';

export default function NovaEquipePage() {
  const addEquipe = useEquipeStore((s) => s.addEquipe);
  const router = useRouter();
  const { user } = useAuth();

  async function handleSubmit(data: { nome: string; descricao?: string }) {
    if (!user) return;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const id = await createTeam(user.uid, data.nome, timezone);
    // opcionalmente cache local
    addEquipe({
      id,
      nome: data.nome,
      descricao: data.descricao,
      membros: [user.uid],
      adminId: user.uid,
      invites: [],
      timezone,
      isActive: true,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('equipeId', id);
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const obj = JSON.parse(savedUser);
      obj.equipeId = id;
      localStorage.setItem('user', JSON.stringify(obj));
    }
    router.push('/auth/equipe');
  }

  return (
    <div className="mx-auto max-w-xl rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Nova Equipe</h2>
      <EquipeForm onSubmit={handleSubmit} onCancel={() => router.back()} />
    </div>
  );
}
