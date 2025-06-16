'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';

export default function RelatoriosPage() {
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/relatorios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erro ao gerar relatório');
      // Abre download
      window.open(json.url, '_blank');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao gerar relatório';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Mês (AAAA-MM)</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="mt-1 w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      {error && <p className="text-error-500 text-sm">{error}</p>}
      <button
        onClick={handleExport}
        disabled={loading}
        className="rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-600 disabled:opacity-50"
      >
        {loading ? 'Gerando...' : 'Exportar CSV'}
      </button>
    </div>
  );
}
