'use client';

import { useRelatorioConsolidado } from '../../hooks/useRelatorioConsolidado';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function MonthlyTrendChart() {
  const data = useRelatorioConsolidado();

  return (
    <div className="bg-card h-96 w-full rounded-lg border p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="equipeNome"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            cursor={{ fill: 'hsl(var(--secondary))' }}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          <Bar
            dataKey="horasTrabalho"
            stackId="a"
            fill="hsl(var(--primary))"
            name="Horas de Trabalho"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="horasSobreaviso"
            stackId="a"
            fill="hsl(var(--accent))"
            name="Horas de Sobreaviso"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
