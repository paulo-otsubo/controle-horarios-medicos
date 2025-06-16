import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Legend
} from 'recharts';

interface ChartPoint {
  date: string;
  trabalho: number;
  sobreaviso: number;
}

export default function HoursChart({ data }: { data: ChartPoint[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-gray-500">Sem dados para o período.</p>;
  }
  return (
    <div className="w-full h-80 rounded-lg border bg-white p-4 shadow-sm border-gray-200">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTrabalho" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSobreaviso" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(d) => d.slice(8, 10)} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="trabalho"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorTrabalho)"
            name="Trabalho"
          />
          <Area
            type="monotone"
            dataKey="sobreaviso"
            stroke="#f59e0b"
            fillOpacity={1}
            fill="url(#colorSobreaviso)"
            name="Sobreaviso"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
