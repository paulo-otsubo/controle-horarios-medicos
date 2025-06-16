import React from 'react';

interface Summary {
  totalHorasTrabalho: number;
  metaHoras: number;
  sobreavisoHoras: number;
}

interface Props {
  summary: Summary;
}

const Card = ({
  title,
  value,
  highlight = false
}: {
  title: string;
  value: string;
  highlight?: boolean;
}) => (
  <div
    className={
      'rounded-lg p-4 shadow-sm border bg-white ' +
      (highlight ? 'border-primary-500' : 'border-gray-200')
    }
  >
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-2 text-2xl font-semibold text-gray-800">{value}</p>
  </div>
);

export default function SummaryCards({ summary }: Props) {
  const { totalHorasTrabalho, metaHoras, sobreavisoHoras } = summary;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card title="Horas Trabalhadas (mês)" value={totalHorasTrabalho.toFixed(1)} />
      <Card title="Meta Mensal" value={metaHoras.toString()} highlight />
      <Card title="Horas Sobreaviso" value={sobreavisoHoras.toFixed(1)} />
    </div>
  );
}
