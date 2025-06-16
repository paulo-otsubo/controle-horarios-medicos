'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegistroSchema } from '../../lib/validations';
import { z } from 'zod';
import { useRegistroStore } from '../../stores/registroStore';
import { format } from 'date-fns';
import { nanoid } from 'nanoid';
import clsx from 'clsx';
import { useHaptics } from '../../hooks/useHaptics';

type RegistroInput = z.infer<typeof RegistroSchema>;

interface Props {
  existing?: import('../../types/registro').Registro;
  onSuccess?: () => void;
}

export default function RegistroForm({ existing, onSuccess }: Props) {
  const addRegistro = useRegistroStore((s) => s.addRegistro);
  const updateRegistro = useRegistroStore((s) => s.updateRegistro);
  const { vibrateSuccess, vibrateError } = useHaptics();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegistroInput>({
    resolver: zodResolver(RegistroSchema),
    defaultValues: existing
      ? {
          data: existing.data,
          horaEntrada: existing.horaEntrada,
          horaSaida: existing.horaSaida,
          tipo: existing.tipo,
          observacoes: existing.observacoes ?? ''
        }
      : {
          data: format(new Date(), 'yyyy-MM-dd'),
          horaEntrada: '',
          horaSaida: '',
          tipo: 'trabalho',
          observacoes: ''
        }
  });

  const onSubmit = (data: RegistroInput) => {
    if (existing && existing.id) {
      updateRegistro(existing.id, {
        data: data.data,
        horaEntrada: data.horaEntrada,
        horaSaida: data.horaSaida,
        tipo: data.tipo,
        observacoes: data.observacoes,
        updatedAt: new Date().toISOString()
      });
    } else {
      const registro = {
        id: nanoid(),
        usuarioId: 'me',
        equipeId: 'default',
        data: data.data,
        horaEntrada: data.horaEntrada,
        horaSaida: data.horaSaida,
        tipo: data.tipo,
        observacoes: data.observacoes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false
      } as import('../../types/registro').Registro;
      addRegistro(registro);
    }
    vibrateSuccess();
    onSuccess?.();
  };

  const onError = () => {
    vibrateError();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4 p-4 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium">Data</label>
        <input type="date" {...register('data')} className="mt-1 w-full rounded border p-2" />
        {errors.data && <p className="text-sm text-red-600">{errors.data.message}</p>}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium">Entrada</label>
          <input
            type="time"
            {...register('horaEntrada')}
            className="mt-1 w-full rounded border p-2"
          />
          {errors.horaEntrada && (
            <p className="text-sm text-red-600">{errors.horaEntrada.message}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Saída</label>
          <input
            type="time"
            {...register('horaSaida')}
            className="mt-1 w-full rounded border p-2"
          />
          {errors.horaSaida && <p className="text-sm text-red-600">{errors.horaSaida.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Tipo</label>
        <select {...register('tipo')} className="mt-1 w-full rounded border p-2">
          <option value="trabalho">Trabalho</option>
          <option value="sobreaviso_acionado">Sobreaviso acionado</option>
          <option value="sobreaviso_nao_acionado">Sobreaviso não acionado</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Observações</label>
        <textarea
          {...register('observacoes')}
          className="mt-1 w-full rounded border p-2"
          rows={3}
        />
        {errors.observacoes && <p className="text-sm text-red-600">{errors.observacoes.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={clsx(
          'w-full rounded py-2 font-semibold text-white',
          isSubmitting ? 'bg-gray-400' : 'bg-primary-500'
        )}
      >
        {isSubmitting ? 'Salvando...' : 'Salvar registro'}
      </button>
    </form>
  );
}
