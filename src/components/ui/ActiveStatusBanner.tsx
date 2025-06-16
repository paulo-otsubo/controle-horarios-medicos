'use client';

import React, { useEffect, useState } from 'react';
import { Registro } from '../../types/registro';
import { differenceInSeconds } from 'date-fns';

function secondsToHms(sec: number) {
  const h = Math.floor(sec / 3600)
    .toString()
    .padStart(2, '0');
  const m = Math.floor((sec % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
  return `${h}:${m}:${s}`;
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

  const label = registro.tipo === 'trabalho' ? 'Trabalhando…' : 'Sobreaviso…';
  const bg = registro.tipo === 'trabalho' ? 'bg-primary-600' : 'bg-warning-500';

  return (
    <div className={`${bg} text-white flex items-center justify-center py-2 rounded-lg mb-4`}>
      <span className="mr-2">⏱️ {secondsToHms(elapsed)}</span>
      <span>{label}</span>
    </div>
  );
}
