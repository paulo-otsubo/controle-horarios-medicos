'use client';

import React, { useState } from 'react';
import { useDashboardData } from '../../../hooks/useDashboardData';
import SummaryCards from '../../../components/dashboard/SummaryCards';
import { QuickActionButtons } from '../../../components/ui/QuickActionButtons';
import ActiveStatusBanner from '../../../components/ui/ActiveStatusBanner';
import SobreavisoModal from '../../../components/ui/SobreavisoModal';
import { useRegistroStore } from '../../../stores/registroStore';
import { nanoid } from 'nanoid';
import { format, isWithinInterval, parse } from 'date-fns';
import dynamic from 'next/dynamic';
import { useUiStore } from '../../../stores/uiStore';
import { useAuth } from '../../../hooks/useAuth';
import { useTeam } from '../../../hooks/useTeam';

const HoursChart = dynamic(() => import('../../../components/dashboard/HoursChart'), {
  ssr: false,
  loading: () => <p className="text-sm text-gray-500">Carregando gráfico...</p>
});

export default function DashboardPage() {
  const { summary } = useDashboardData();
  const [highlightWork, setHighlightWork] = useState(false);
  const [showSobreavisoModal, setShowSobreavisoModal] = useState(false);

  const { registros, addRegistro, updateRegistro } = useRegistroStore();
  const [pulse, setPulse] = useState(false);
  const confirmEndPref = useUiStore((s) => s.confirmEnd);
  const { user } = useAuth();
  const team = useTeam();

  // Determina status atual - verificando se há registro ativo
  const last = registros.length > 0 ? registros[registros.length - 1] : null;
  let status: 'livre' | 'trabalhando' | 'sobreaviso_nao_acionado' | 'sobreaviso_acionado' = 'livre';

  if (last && !last.horaSaida) {
    if (last.tipo === 'trabalho') {
      status = 'trabalhando';
    } else if (last.tipo === 'sobreaviso_nao_acionado' || last.tipo === 'sobreaviso_acionado') {
      if (last.sobreavisoInicio && last.sobreavisoFim) {
        const agora = new Date();
        const inicio = parse(last.sobreavisoInicio, 'yyyy-MM-dd HH:mm', new Date());
        const fim = parse(last.sobreavisoFim, 'yyyy-MM-dd HH:mm', new Date());

        if (isWithinInterval(agora, { start: inicio, end: fim })) {
          status = last.tipo;
        } else {
          // Período expirado, encerrar automaticamente com a hora de fim programada
          updateRegistro(last.id as string, {
            horaSaida: format(fim, 'HH:mm'), // Usa a hora de FIM do sobreaviso
            sobreavisoAtivo: false,
            updatedAt: new Date().toISOString()
          });
          status = 'livre';
        }
      } else {
        status = last.tipo;
      }
    }
  }

  const handleEntrar = () => {
    const now = new Date();
    const registro = {
      id: nanoid(),
      usuarioId: user?.uid ?? 'local',
      equipeId: team?.id ?? localStorage.getItem('equipeId') ?? '',
      data: format(now, 'yyyy-MM-dd'),
      horaEntrada: format(now, 'HH:mm'),
      horaSaida: '',
      tipo: 'trabalho'
    } satisfies import('../../../types/registro').Registro;

    addRegistro(registro);
    setPulse(true);
    setHighlightWork(true);
    setTimeout(() => setPulse(false), 700);
    setTimeout(() => setHighlightWork(false), 2000);
  };

  const handleSobreaviso = () => {
    setShowSobreavisoModal(true);
  };

  const handleConfirmSobreaviso = (data: {
    dataInicio: string;
    horaInicio: string;
    dataFim: string;
    horaFim: string;
    observacoes?: string;
  }) => {
    const inicioFormatado = `${data.dataInicio} ${data.horaInicio}`;
    const fimFormatado = `${data.dataFim} ${data.horaFim}`;

    // Criar registro ATIVO (sem horaSaida)
    const registro = {
      id: nanoid(),
      usuarioId: user?.uid ?? 'local',
      equipeId: team?.id ?? localStorage.getItem('equipeId') ?? '',
      data: data.dataInicio,
      horaEntrada: data.horaInicio,
      horaSaida: '', // Vazio para indicar que está ativo
      tipo: 'sobreaviso_nao_acionado',
      observacoes: data.observacoes,
      sobreavisoInicio: inicioFormatado,
      sobreavisoFim: fimFormatado,
      sobreavisoAtivo: true
    } satisfies import('../../../types/registro').Registro;

    addRegistro(registro);
  };

  const handleAcionarSobreaviso = () => {
    if (last?.id) {
      updateRegistro(last.id as string, {
        tipo: 'sobreaviso_acionado',
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handleEncerrarSobreaviso = () => {
    if (last?.id) {
      updateRegistro(last.id as string, {
        horaSaida: format(new Date(), 'HH:mm'),
        sobreavisoAtivo: false,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handleSair = () => {
    if (!last || last.horaSaida) return;

    if (confirmEndPref) {
      const ok = window.confirm('Encerrar registro iniciado às ' + last.horaEntrada + '?');
      if (!ok) return;
    }

    updateRegistro(last.id as string, {
      horaSaida: format(new Date(), 'HH:mm'),
      updatedAt: new Date().toISOString()
    });
    setHighlightWork(true);
    setTimeout(() => setHighlightWork(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-600">
          Seu painel de controle rápido. Inicie, pause e gerencie seus registros com um toque.
        </p>
      </div>

      {status !== 'livre' && last && <ActiveStatusBanner registro={last} />}

      <QuickActionButtons
        status={status}
        currentRegistro={last}
        onEntrar={handleEntrar}
        onSobreaviso={handleSobreaviso}
        onSair={handleSair}
        onAcionarSobreaviso={handleAcionarSobreaviso}
        onEncerrarSobreaviso={handleEncerrarSobreaviso}
        pulse={pulse}
      />

      <SummaryCards summary={summary} highlightTrabalho={highlightWork} />
      <HoursChart />

      <SobreavisoModal
        isOpen={showSobreavisoModal}
        onClose={() => setShowSobreavisoModal(false)}
        onConfirm={handleConfirmSobreaviso}
      />
    </div>
  );
}
