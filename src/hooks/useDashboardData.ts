import { useMemo } from 'react';
import { useRegistroStore } from '../stores/registroStore';
import { calcularHorasTrabalho } from '../lib/calculations';
import { isSameMonth } from 'date-fns';

interface Summary {
  totalHorasTrabalho: number;
  metaHoras: number;
  sobreavisoHoras: number;
}

interface ChartPoint {
  date: string; // format YYYY-MM-DD
  trabalho: number;
  sobreaviso: number;
}

export function useDashboardData() {
  const registros = useRegistroStore((s) => s.registros);

  const { summary, chartData } = useMemo(() => {
    const now = new Date();

    let totalHorasTrabalho = 0;
    let sobreavisoHoras = 0;
    const dailyMap: Record<string, { trabalho: number; sobreaviso: number }> = {};

    registros.forEach((reg) => {
      const dateObj = new Date(reg.data);
      if (!isSameMonth(dateObj, now)) return; // apenas mês atual

      if (!reg.horaSaida) return; // ignora registros em andamento
      const horas = calcularHorasTrabalho(reg.horaEntrada, reg.horaSaida);
      const key = reg.data;
      if (!dailyMap[key]) {
        dailyMap[key] = { trabalho: 0, sobreaviso: 0 };
      }

      if (reg.tipo === 'trabalho') {
        totalHorasTrabalho += horas;
        dailyMap[key].trabalho += horas;
      } else {
        const mult = reg.tipo === 'sobreaviso_acionado' ? 1 : 0.33;
        sobreavisoHoras += horas * mult;
        dailyMap[key].sobreaviso += horas * mult;
      }
    });

    const chartData: ChartPoint[] = Object.entries(dailyMap)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([date, { trabalho, sobreaviso }]) => ({ date, trabalho, sobreaviso }));

    const summary: Summary = {
      totalHorasTrabalho,
      metaHoras: 160, // meta fixa, pode vir de store plano futuramente
      sobreavisoHoras
    };
    return { summary, chartData };
  }, [registros]);

  return { summary, chartData };
}
