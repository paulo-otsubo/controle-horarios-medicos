'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEquipeStore } from '../../../../stores/equipeStore';
import EquipeForm from '../../../../components/equipe/EquipeForm';
import { nanoid } from 'nanoid';
import AdminGuard from '../../../../components/auth/AdminGuard';

export default function NovaEquipePage() {
  const addEquipe = useEquipeStore((s) => s.addEquipe);
  const router = useRouter();

  function handleSubmit(data: { nome: string; descricao?: string }) {
    addEquipe({
      id: nanoid(),
      nome: data.nome,
      descricao: data.descricao,
      membros: [],
      createdAt: new Date().toISOString()
    });
    router.push('/auth/equipe');
  }

  return (
    <AdminGuard>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Nova Equipe</h2>
        <EquipeForm onSubmit={handleSubmit} onCancel={() => router.back()} />
      </div>
    </AdminGuard>
  );
}
