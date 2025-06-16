'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data
const data = [
  { name: 'Seg', Horas: 4 },
  { name: 'Ter', Horas: 8 },
  { name: 'Qua', Horas: 10 },
  { name: 'Qui', Horas: 7 },
  { name: 'Sex', Horas: 9 },
  { name: 'Sáb', Horas: 2 },
  { name: 'Dom', Horas: 1 }
];

export default function HoursChart() {
  return (
    <div className="bg-card h-64 rounded-lg border p-4">
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
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))'
            }}
          />
          <Bar dataKey="Horas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
