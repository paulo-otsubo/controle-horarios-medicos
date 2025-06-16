'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createPortal } from 'react-dom';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { X } from 'lucide-react';
import { format, parse, isAfter, addHours } from 'date-fns';

const sobreavisoSchema = z
  .object({
    dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
    horaInicio: z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, 'Hora inválida'),
    dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
    horaFim: z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, 'Hora inválida'),
    observacoes: z.string().max(500).optional()
  })
  .refine(
    (data) => {
      const inicio = parse(`${data.dataInicio} ${data.horaInicio}`, 'yyyy-MM-dd HH:mm', new Date());
      const fim = parse(`${data.dataFim} ${data.horaFim}`, 'yyyy-MM-dd HH:mm', new Date());
      return isAfter(fim, inicio);
    },
    {
      message: 'Data/hora de fim deve ser posterior ao início',
      path: ['dataFim']
    }
  );

type SobreavisoFormData = z.infer<typeof sobreavisoSchema>;

interface SobreavisoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: SobreavisoFormData) => void;
}

export default function SobreavisoModal({ isOpen, onClose, onConfirm }: SobreavisoModalProps) {
  const agora = new Date();
  const fimPadrao = addHours(agora, 12); // 12 horas de sobreaviso como padrão

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<SobreavisoFormData>({
    resolver: zodResolver(sobreavisoSchema),
    defaultValues: {
      dataInicio: format(agora, 'yyyy-MM-dd'),
      horaInicio: format(agora, 'HH:mm'),
      dataFim: format(fimPadrao, 'yyyy-MM-dd'),
      horaFim: format(fimPadrao, 'HH:mm'),
      observacoes: ''
    }
  });

  const onSubmit = async (data: SobreavisoFormData) => {
    onConfirm(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b bg-purple-50 p-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">🛡️ Configurar Sobreaviso</h2>
            <p className="text-sm text-gray-600">Defina o período de sobreaviso</p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-sm text-blue-800">
              💡 O sobreaviso começará como <strong>não acionado</strong>. Durante o período, você
              poderá marcar como <strong>acionado</strong> se necessário.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input
                id="dataInicio"
                type="date"
                {...register('dataInicio')}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
              {errors.dataInicio && (
                <p className="text-destructive text-sm">{errors.dataInicio.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="horaInicio">Hora Início</Label>
              <Input id="horaInicio" type="time" {...register('horaInicio')} />
              {errors.horaInicio && (
                <p className="text-destructive text-sm">{errors.horaInicio.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input
                id="dataFim"
                type="date"
                {...register('dataFim')}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
              {errors.dataFim && (
                <p className="text-destructive text-sm">{errors.dataFim.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="horaFim">Hora Fim</Label>
              <Input id="horaFim" type="time" {...register('horaFim')} />
              {errors.horaFim && (
                <p className="text-destructive text-sm">{errors.horaFim.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              {...register('observacoes')}
              placeholder="Detalhes sobre o período de sobreaviso..."
              rows={3}
            />
            {errors.observacoes && (
              <p className="text-destructive text-sm">{errors.observacoes.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? 'Iniciando...' : '🛡️ Iniciar Sobreaviso'}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
