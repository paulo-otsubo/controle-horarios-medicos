'use client';

import React from 'react';
import AdminGuard from '../../../components/auth/AdminGuard';
import { useEquipeStore } from '../../../stores/equipeStore';
import Link from 'next/link';

export default function EquipeListPage() {
  const equipes = useEquipeStore((s) => s.equipes);
  const deleteEquipe = useEquipeStore((s) => s.deleteEquipe);

  return (
    <AdminGuard>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Link
            href="/auth/equipe/nova"
            className="inline-flex items-center rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
          >
            Nova Equipe
          </Link>
        </div>
        {equipes.length === 0 ? (
          <p className="text-gray-600">Nenhuma equipe cadastrada.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 bg-white shadow-sm rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Nome</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Membros</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {equipes.map((eq) => (
                <tr key={eq.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">{eq.nome}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{eq.membros.length}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <Link
                      href={`/auth/equipe/${eq.id}`}
                      className="text-sm text-primary-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => deleteEquipe(eq.id)}
                      className="text-sm text-error-500 hover:underline"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminGuard>
  );
}
