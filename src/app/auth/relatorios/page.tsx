'use client';

import React from 'react';
import MonthlyTrendChart from '../../../components/relatorios/MonthlyTrendChart';

export default function RelatoriosPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>
        <p className="text-sm text-gray-600">
          Acompanhe sua produtividade com gráficos que mostram a tendência de horas.
        </p>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Tendência Mensal de Horas</h2>
        <MonthlyTrendChart />
      </div>
    </div>
  );
}
