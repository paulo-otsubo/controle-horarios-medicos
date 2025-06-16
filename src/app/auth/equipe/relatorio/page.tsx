'use client';

import React from 'react';
import AdminGuard from '../../../../components/auth/AdminGuard';
import { useRelatorioConsolidado } from '../../../../hooks/useRelatorioConsolidado';

export default function RelatorioConsolidadoPage() {
  const data = useRelatorioConsolidado();

  return (
    <AdminGuard>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Relatório Consolidado (mês atual)</h2>
        {data.length === 0 ? (
          <p className="text-gray-600">Sem registros.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 bg-white shadow-sm rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Equipe</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                  Horas Trabalho
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                  Horas Sobreaviso
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((d) => (
                <tr key={d.equipeId}>
                  <td className="px-4 py-2 whitespace-nowrap">{d.equipeNome}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{d.horasTrabalho.toFixed(1)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{d.horasSobreaviso.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminGuard>
  );
}
