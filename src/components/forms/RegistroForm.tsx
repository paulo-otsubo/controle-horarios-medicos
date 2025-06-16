'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegistroSchema } from '../../lib/validations';
import { z } from 'zod';
import { useRegistroStore } from '../../stores/registroStore';
import { format } from 'date-fns';
import { nanoid } from 'nanoid';
import { useHaptics } from '../../hooks/useHaptics';
import { useAuth } from '../../hooks/useAuth';
import { useTeam } from '../../hooks/useTeam';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type RegistroInput = z.infer<typeof RegistroSchema>;

interface Props {
  existing?: import('../../types/registro').Registro;
  onSuccess?: () => void;
}

export default function RegistroForm({ existing, onSuccess }: Props) {
  const addRegistro = useRegistroStore((s) => s.addRegistro);
  const updateRegistro = useRegistroStore((s) => s.updateRegistro);
  const { user } = useAuth();
  const team = useTeam();
  const { vibrateSuccess, vibrateError } = useHaptics();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control
  } = useForm<RegistroInput>({
    resolver: zodResolver(RegistroSchema),
    defaultValues: existing
      ? {
          ...existing,
          observacoes: existing.observacoes ?? '',
          sobreavisoInicio: existing.sobreavisoInicio ?? undefined,
          sobreavisoFim: existing.sobreavisoFim ?? undefined,
          sobreavisoAtivo: existing.sobreavisoAtivo ?? undefined
        }
      : {
          data: format(new Date(), 'yyyy-MM-dd'),
          horaEntrada: '',
          horaSaida: '',
          tipo: 'trabalho',
          observacoes: '',
          sobreavisoInicio: undefined,
          sobreavisoFim: undefined,
          sobreavisoAtivo: undefined
        }
  });

  const onSubmit = async (data: RegistroInput) => {
    if (existing && existing.id) {
      await updateRegistro(existing.id, {
        data: data.data,
        horaEntrada: data.horaEntrada,
        horaSaida: data.horaSaida,
        tipo: data.tipo,
        observacoes: data.observacoes,
        sobreavisoInicio: data.sobreavisoInicio,
        sobreavisoFim: data.sobreavisoFim,
        sobreavisoAtivo: data.sobreavisoAtivo,
        updatedAt: new Date().toISOString()
      });
    } else {
      if (!user) {
        vibrateError();
        alert('Usuário não autenticado.');
        return;
      }

      const registro = {
        id: nanoid(),
        usuarioId: user.uid,
        equipeId: team?.id ?? localStorage.getItem('equipeId') ?? '',
        data: data.data,
        horaEntrada: data.horaEntrada,
        horaSaida: data.horaSaida,
        tipo: data.tipo,
        observacoes: data.observacoes,
        sobreavisoInicio: data.sobreavisoInicio,
        sobreavisoFim: data.sobreavisoFim,
        sobreavisoAtivo: data.sobreavisoAtivo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false
      } as import('../../types/registro').Registro;
      try {
        await addRegistro(registro);
      } catch (err) {
        console.error('Falha ao salvar no Firestore:', err);
        vibrateError();
        alert('Falha ao salvar no Firestore. Verifique sua conexão ou permissões.');
        return;
      }
    }
    vibrateSuccess();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
      <div>
        <Label htmlFor="data">Data</Label>
        <Input id="data" type="date" {...register('data')} />
        {errors.data && <p className="text-destructive text-sm">{errors.data.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="horaEntrada">Entrada</Label>
          <Input id="horaEntrada" type="time" {...register('horaEntrada')} />
          {errors.horaEntrada && (
            <p className="text-destructive text-sm">{errors.horaEntrada.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="horaSaida">Saída</Label>
          <Input id="horaSaida" type="time" {...register('horaSaida')} />
          {errors.horaSaida && (
            <p className="text-destructive text-sm">{errors.horaSaida.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="tipo">Tipo</Label>
        <Controller
          name="tipo"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trabalho">Trabalho</SelectItem>
                <SelectItem value="sobreaviso_acionado">Sobreaviso acionado</SelectItem>
                <SelectItem value="sobreaviso_nao_acionado">Sobreaviso não acionado</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.tipo && <p className="text-destructive text-sm">{errors.tipo.message}</p>}
      </div>

      <div>
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          {...register('observacoes')}
          placeholder="Algum detalhe sobre o plantão..."
        />
        {errors.observacoes && (
          <p className="text-destructive text-sm">{errors.observacoes.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Salvando...' : 'Salvar Registro'}
      </Button>
    </form>
  );
}
