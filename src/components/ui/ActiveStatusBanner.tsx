'use client';

import React, { useState, useEffect } from 'react';
import { Registro } from '../../types/registro';
import { differenceInSeconds, format as formatDate, parse, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';

function secondsToHms(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
}

export default function ActiveStatusBanner({ registro }: { registro: Registro }) {
  const [elapsed, setElapsed] = useState(() => {
    const now = new Date();
    return differenceInSeconds(now, new Date(`${registro.data}T${registro.horaEntrada}:00`));
  });

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Para sobreaviso, verificar se ainda está no período programado
  const isSobreaviso =
    registro.tipo === 'sobreaviso_nao_acionado' || registro.tipo === 'sobreaviso_acionado';

  const statusInfo = (() => {
    if (isSobreaviso) {
      const isAcionado = registro.tipo === 'sobreaviso_acionado';
      const label = isAcionado ? 'Sobreaviso Acionado' : 'Sobreaviso';
      let bg = isAcionado ? 'bg-orange-500' : 'bg-purple-600';
      let details: string | null = null;
      const pulse = isAcionado; // Animação de pulso se acionado

      // Verificar se tem período programado
      if (registro.sobreavisoInicio && registro.sobreavisoFim) {
        const agora = new Date();
        const inicio = parse(registro.sobreavisoInicio, 'yyyy-MM-dd HH:mm', new Date());
        const fim = parse(registro.sobreavisoFim, 'yyyy-MM-dd HH:mm', new Date());

        const isAtivo = isWithinInterval(agora, { start: inicio, end: fim });

        if (isAtivo) {
          const fimFormatado = formatDate(fim, "dd/MM 'às' HH:mm", { locale: ptBR });
          details = `Programado até ${fimFormatado}`;
        } else {
          details = 'Período programado expirado';
          bg = 'bg-gray-500';
        }
      }

      return { label, bg, details, pulse, isAcionado };
    }

    return {
      label: 'Trabalhando…',
      bg: 'bg-primary-600',
      details: null as string | null,
      pulse: false,
      isAcionado: false
    };
  })();

  return (
    <div
      className={cn(
        `${statusInfo.bg} mb-4 rounded-lg py-3 text-white transition-colors duration-300`,
        statusInfo.pulse && 'animate-pulse'
      )}
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center">
          {statusInfo.isAcionado && <ExclamationTriangleIcon className="mr-2 size-5" />}
          <span className="mr-2">⏱️ {secondsToHms(elapsed)}</span>
          <span className="font-semibold">{statusInfo.label}</span>
        </div>

        {statusInfo.details && <div className="mt-1 text-sm opacity-90">{statusInfo.details}</div>}

        {registro.observacoes && (
          <div className="mt-2 max-w-xs truncate text-sm opacity-80">💬 {registro.observacoes}</div>
        )}
      </div>
    </div>
  );
}
