'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEquipeStore } from '../../../../stores/equipeStore';
import EquipeForm from '../../../../components/equipe/EquipeForm';
import AdminGuard from '../../../../components/auth/AdminGuard';

export default function EditarEquipeClient() {
  const params = useParams();
  const id = params?.id as string;
  const { equipes, updateEquipe } = useEquipeStore((s) => ({
    equipes: s.equipes,
    updateEquipe: s.updateEquipe
  }));
  const router = useRouter();

  const equipe = useMemo(() => equipes.find((e) => e.id === id), [equipes, id]);

  if (!equipe) {
    return <p className="text-center p-4">Equipe não encontrada.</p>;
  }

  function handleSubmit(data: { nome: string; descricao?: string }) {
    updateEquipe(id, {
      nome: data.nome,
      descricao: data.descricao,
      updatedAt: new Date().toISOString()
    });
    router.push('/auth/equipe');
  }

  return (
    <AdminGuard>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Editar Equipe</h2>
        <EquipeForm initial={equipe} onSubmit={handleSubmit} onCancel={() => router.back()} />
      </div>
    </AdminGuard>
  );
}
