'use client';

import React, { useState, useEffect } from 'react';
import { useRegistroStore } from '../../../stores/registroStore';
import RegistroCard from '../../../components/ui/RegistroCard';
import PageHeader from '../../../components/layout/PageHeader';
import { useSearchParams } from 'next/navigation';
import RegistroForm from '../../../components/forms/RegistroForm';
import { createPortal } from 'react-dom';

export default function RegistrosPage() {
  const { registros, deleteRegistro } = useRegistroStore();
  const searchParams = useSearchParams();
  const [modalRegistro, setModalRegistro] = useState<
    import('../../../types/registro').Registro | null
  >(null);

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

  const sorted = [...registros].sort((a, b) => (a.data < b.data ? 1 : -1));

  return (
    <section className="min-h-[calc(100vh-4rem)] p-4 md:p-6 bg-gray-50">
      <PageHeader title="Registros" />
      {sorted.length === 0 ? (
        <p className="text-gray-600">Sem registros.</p>
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
