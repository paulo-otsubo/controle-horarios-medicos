'use client';

import React, { useState, useEffect } from 'react';
import { useRegistroStore } from '../../../stores/registroStore';
import RegistroCard from '../../../components/ui/RegistroCard';
import { useSearchParams } from 'next/navigation';
import RegistroForm from '../../../components/forms/RegistroForm';
import { createPortal } from 'react-dom';
import { format } from 'date-fns';

export default function RegistrosPage() {
  const { registros, deleteRegistro } = useRegistroStore();
  const searchParams = useSearchParams();
  const [modalRegistro, setModalRegistro] = useState<
    import('../../../types/registro').Registro | null
  >(null);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      const reg = registros.find((r) => r.id === editId) || null;
      setModalRegistro(reg);
    } else {
      setModalRegistro(null);
    }
  }, [searchParams, registros]);

  const handleDelete = (id: string) => {
    deleteRegistro(id);
  };

  let filtered = [...registros];
  if (filterDate) {
    filtered = filtered.filter((r) => r.data === filterDate);
  }
  const sorted = filtered.sort((a, b) => (a.data < b.data ? 1 : -1));

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-gray-50 p-4 md:p-6">
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Seus Registros</h1>
            <p className="text-sm text-gray-600">
              Visualize e gerencie todos os seus registros. Filtre por data para encontrar um dia
              específico.
            </p>
          </div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="rounded border p-2"
            max={format(new Date(), 'yyyy-MM-dd')}
          />
        </div>
        {filterDate && (
          <button
            onClick={() => setFilterDate('')}
            className="mb-4 text-sm text-primary-600 hover:underline"
          >
            Limpar Filtro
          </button>
        )}
      </div>
      {sorted.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-600">Você ainda não tem registros.</p>
          <p className="mt-2 text-sm text-gray-500">
            Use o dashboard para iniciar um novo registro.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((r) => (
            <RegistroCard key={r.id} registro={r} onDelete={() => handleDelete(r.id as string)} />
          ))}
        </div>
      )}
      {modalRegistro &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
              <RegistroForm
                existing={modalRegistro}
                onSuccess={() => {
                  // remove query param
                  const url = new URL(window.location.href);
                  url.searchParams.delete('edit');
                  window.history.replaceState(null, '', url.toString());
                }}
              />
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
