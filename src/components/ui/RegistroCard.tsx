'use client';

import React from 'react';
import { Registro } from '../../types/registro';
import { useSwipeable } from 'react-swipeable';
import { useHaptics } from '../../hooks/useHaptics';
import { format, parse } from 'date-fns';
import { useRouter } from 'next/navigation';
import {
  TrashIcon,
  PencilIcon,
  ClockIcon,
  CalendarIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';
import { ptBR } from 'date-fns/locale';

interface Props {
  registro: Registro;
  onDelete: () => void;
}

const tipoStyles: Record<Registro['tipo'], { label: string; className: string }> = {
  trabalho: { label: 'Trabalho', className: 'bg-primary/10 text-primary' },
  sobreaviso_acionado: {
    label: 'Sobreaviso Acionado',
    className: 'bg-warning/20 text-warning-foreground'
  },
  sobreaviso_nao_acionado: {
    label: 'Sobreaviso',
    className: 'bg-purple-100 text-purple-800'
  }
};

export default function RegistroCard({ registro, onDelete }: Props) {
  const router = useRouter();
  const { vibrateSuccess } = useHaptics();

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (window.confirm('Tem certeza que deseja apagar este registro?')) {
        vibrateSuccess();
        onDelete();
      }
    },
    onSwipedRight: () => {
      vibrateSuccess();
      router.push(`/auth/registros?edit=${registro.id}`);
    },
    trackTouch: true,
    delta: 60
  });

  const duracao = registro.horaSaida
    ? `${registro.horaEntrada} → ${registro.horaSaida}`
    : `${registro.horaEntrada} → Presente`;

  const { label: tipoLabel, className: tipoClassName } = tipoStyles[registro.tipo];

  const dateObj = new Date(`${registro.data}T00:00:00`);

  // Informações específicas do sobreaviso
  const isSobreaviso = registro.tipo.includes('sobreaviso');
  const sobreavisoInfo = React.useMemo(() => {
    if (!isSobreaviso || !registro.sobreavisoInicio || !registro.sobreavisoFim) return null;

    try {
      const inicio = parse(registro.sobreavisoInicio, 'yyyy-MM-dd HH:mm', new Date());
      const fim = parse(registro.sobreavisoFim, 'yyyy-MM-dd HH:mm', new Date());

      return {
        inicio: format(inicio, "dd/MM 'às' HH:mm", { locale: ptBR }),
        fim: format(fim, "dd/MM 'às' HH:mm", { locale: ptBR })
      };
    } catch {
      return null;
    }
  }, [isSobreaviso, registro.sobreavisoInicio, registro.sobreavisoFim]);

  return (
    <div {...handlers} className="bg-card group relative rounded-lg border p-4">
      {/* Ações para Desktop */}
      <div className="absolute right-4 top-4 flex items-center space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => router.push(`/auth/registros?edit=${registro.id}`)}
          className="hover:bg-secondary rounded-full p-1.5"
        >
          <PencilIcon className="text-muted-foreground size-4" />
        </button>
        <button onClick={onDelete} className="hover:bg-destructive/10 rounded-full p-1.5">
          <TrashIcon className="text-destructive/80 size-4" />
        </button>
      </div>

      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-foreground flex items-center gap-2 text-sm font-medium">
            <CalendarIcon className="text-muted-foreground size-4" />
            {format(dateObj, "EEE, dd 'de' MMMM", { locale: ptBR })}
          </p>
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', tipoClassName)}>
            {tipoLabel}
          </span>
        </div>

        <div className="text-muted-foreground flex items-center space-x-2">
          <ClockIcon className="size-4" />
          <p className="text-foreground text-base">{duracao}</p>
        </div>

        {/* Informações específicas do sobreaviso */}
        {sobreavisoInfo && (
          <div className="rounded-md bg-purple-50 p-2 text-sm">
            <div className="mb-1 flex items-center gap-1 font-medium text-purple-700">
              <ExclamationCircleIcon className="size-4" />
              Período Programado
            </div>
            <div className="text-purple-600">
              <div>Início: {sobreavisoInfo.inicio}</div>
              <div>Fim: {sobreavisoInfo.fim}</div>
            </div>
          </div>
        )}

        {registro.observacoes && (
          <p className="text-muted-foreground pt-2 text-sm">{registro.observacoes}</p>
        )}
      </div>
    </div>
  );
}
