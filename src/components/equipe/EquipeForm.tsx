'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Equipe } from '../../types/equipe';

const schema = z.object({
  nome: z.string().min(2, 'Informe um nome'),
  descricao: z.string().optional()
});

type FormData = z.infer<typeof schema>;

interface Props {
  initial?: Equipe;
  onSubmit: (data: FormData) => void;
  onCancel?: () => void;
}

export default function EquipeForm({ initial, onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: initial });

  useEffect(() => {
    reset(initial ?? { nome: '', descricao: '' });
  }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome</label>
        <input
          type="text"
          {...register('nome')}
          className="mt-1 w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.nome && <p className="text-sm text-error-500">{errors.nome.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          rows={3}
          {...register('descricao')}
          className="mt-1 w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.descricao && <p className="text-sm text-error-500">{errors.descricao.message}</p>}
      </div>
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
