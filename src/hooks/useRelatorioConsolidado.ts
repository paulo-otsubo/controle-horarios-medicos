import { useMemo } from 'react';
import { useRegistroStore } from '../stores/registroStore';
import { useEquipeStore } from '../stores/equipeStore';
import { calcularHorasTrabalho } from '../lib/calculations';

interface EquipeResumo {
  equipeId: string;
  equipeNome: string;
  horasTrabalho: number;
  horasSobreaviso: number;
}

export function useRelatorioConsolidado() {
  const registros = useRegistroStore((s) => s.registros);
  const equipes = useEquipeStore((s) => s.equipes);

  const data = useMemo<EquipeResumo[]>(() => {
    const map = new Map<string, EquipeResumo>();

    registros.forEach((reg) => {
      const resumo = map.get(reg.equipeId) ?? {
        equipeId: reg.equipeId,
        equipeNome: equipes.find((e) => e.id === reg.equipeId)?.nome ?? 'Sem equipe',
        horasTrabalho: 0,
        horasSobreaviso: 0
      };

      const horas = calcularHorasTrabalho(reg.horaEntrada, reg.horaSaida);
      if (reg.tipo === 'trabalho') resumo.horasTrabalho += horas;
      else resumo.horasSobreaviso += horas;

      map.set(reg.equipeId, resumo);
    });

    return Array.from(map.values()).sort((a, b) => a.equipeNome.localeCompare(b.equipeNome));
  }, [registros, equipes]);

  return data;
}
