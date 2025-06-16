'use client';

import React, { useState } from 'react';
import { useDashboardData } from '../../../hooks/useDashboardData';
import SummaryCards from '../../../components/dashboard/SummaryCards';
import { QuickActionButtons } from '../../../components/ui/QuickActionButtons';
import ActiveStatusBanner from '../../../components/ui/ActiveStatusBanner';
import { useRegistroStore } from '../../../stores/registroStore';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';

const HoursChart = dynamic(() => import('../../../components/dashboard/HoursChart'), {
  ssr: false,
  loading: () => <p className="text-sm text-gray-500">Carregando gráfico...</p>
});

export default function DashboardPage() {
  const { summary, chartData } = useDashboardData();

  const { registros, addRegistro, updateRegistro } = useRegistroStore();

  const [pulse, setPulse] = useState(false);

  // Determina status atual
  const last = registros[registros.length - 1];
  let status: 'livre' | 'trabalhando' | 'sobreaviso_nao_acionado' | 'sobreaviso_acionado' = 'livre';
  if (last && !last.horaSaida) {
    if (last.tipo === 'trabalho') status = 'trabalhando';
    else if (last.tipo === 'sobreaviso_nao_acionado') status = 'sobreaviso_nao_acionado';
    else status = 'sobreaviso_acionado';
  }

  const handleEntrar = () => {
    const now = new Date();
    const registro = {
      id: nanoid(),
      usuarioId: 'local',
      equipeId: 'local',
      data: format(now, 'yyyy-MM-dd'),
      horaEntrada: format(now, 'HH:mm'),
      horaSaida: '',
      tipo: 'trabalho'
    } satisfies import('../../../types/registro').Registro;

    addRegistro(registro);
    setPulse(true);
    setTimeout(() => setPulse(false), 700);
  };

  const handleSobreaviso = () => {
    if (status === 'livre') {
      const now = new Date();
      const registro = {
        id: nanoid(),
        usuarioId: 'local',
        equipeId: 'local',
        data: format(now, 'yyyy-MM-dd'),
        horaEntrada: format(now, 'HH:mm'),
        horaSaida: '',
        tipo: 'sobreaviso_nao_acionado'
      } satisfies import('../../../types/registro').Registro;
      addRegistro(registro);
    } else if (status === 'sobreaviso_nao_acionado' && last?.id) {
      updateRegistro(last.id as string, { tipo: 'sobreaviso_acionado' });
    }
  };

  const handleSair = () => {
    if (last && !last.horaSaida) {
      updateRegistro(last.id as string, { horaSaida: format(new Date(), 'HH:mm') });
    }
  };

  return (
    <div className="space-y-6">
      {last && !last.horaSaida && <ActiveStatusBanner registro={last} />}

      <QuickActionButtons
        status={status}
        onEntrar={handleEntrar}
        onSobreaviso={handleSobreaviso}
        onSair={handleSair}
        pulse={pulse}
      />
      <SummaryCards summary={summary} />
      <HoursChart data={chartData} />
    </div>
  );
}
