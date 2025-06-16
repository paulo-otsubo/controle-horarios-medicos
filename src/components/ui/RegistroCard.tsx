'use client';

import React from 'react';
import { Registro } from '../../types/registro';
import { useSwipeable } from 'react-swipeable';
import { useHaptics } from '../../hooks/useHaptics';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

interface Props {
  registro: Registro;
  onDelete: () => void;
}

export default function RegistroCard({ registro, onDelete }: Props) {
  const router = useRouter();
  const { vibrateSuccess } = useHaptics();

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      vibrateSuccess();
      onDelete();
    },
    onSwipedRight: () => {
      vibrateSuccess();
      router.push(`/auth/registros?edit=${registro.id}`);
    },
    trackTouch: true,
    delta: 40
  });

  const duracao = registro.horaSaida
    ? `${registro.horaEntrada} → ${registro.horaSaida}`
    : `${registro.horaEntrada} → …`;

  const tipoLabel = {
    trabalho: 'Trabalho',
    sobreaviso_acionado: 'Sobreaviso acionado',
    sobreaviso_nao_acionado: 'Sobreaviso não acionado'
  }[registro.tipo];

  return (
    <div {...handlers} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between text-sm text-gray-500">
        <span>{format(new Date(registro.data), 'EEE, dd MMM')}</span>
        <div className="flex gap-2 md:opacity-0 md:group-hover:opacity-100">
          <PencilIcon
            className="h-4 w-4 cursor-pointer"
            onClick={() => router.push(`/auth/registros?edit=${registro.id}`)}
          />
          <TrashIcon className="h-4 w-4 cursor-pointer" onClick={onDelete} />
        </div>
      </div>
      <p className="mt-2 text-lg font-medium text-gray-800">{duracao}</p>
      <p className="text-sm text-gray-600">{tipoLabel}</p>
      {registro.observacoes && <p className="mt-1 text-xs text-gray-500">{registro.observacoes}</p>}
    </div>
  );
}
