import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Mínimo 6 caracteres' })
});

export const RegisterSchema = LoginSchema.extend({
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
});

export const UserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido')
});

export const RegistroSchema = z
  .object({
    data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Data deve estar no formato YYYY-MM-DD'
    }),
    horaEntrada: z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, {
      message: 'Hora inválida'
    }),
    horaSaida: z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, {
      message: 'Hora inválida'
    }),
    tipo: z.enum(['trabalho', 'sobreaviso_acionado', 'sobreaviso_nao_acionado']),
    observacoes: z.string().max(500).optional(),
    sobreavisoInicio: z.string().optional(),
    sobreavisoFim: z.string().optional(),
    sobreavisoAtivo: z.boolean().optional()
  })
  .refine(
    (val) => {
      const [hE, mE] = val.horaEntrada.split(':').map(Number);
      const [hS, mS] = val.horaSaida.split(':').map(Number);
      const entrada = hE * 60 + mE;
      let saida = hS * 60 + mS;
      if (saida < entrada) saida += 24 * 60; // overnight
      return saida > entrada;
    },
    {
      message: 'Hora de saída não pode ser anterior à entrada',
      path: ['horaSaida']
    }
  );

export const EquipeSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  descricao: z.string().max(500, 'Descrição muito longa').optional()
});
