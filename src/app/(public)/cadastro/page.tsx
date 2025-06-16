'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '../../../lib/validations';
import { z } from 'zod';
import { useAuth } from '../../../hooks/useAuth';
import Link from 'next/link';

type RegisterInput = z.infer<typeof RegisterSchema>;

export default function CadastroPage() {
  const { register: registerUser, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterInput>({ resolver: zodResolver(RegisterSchema) });

  const onSubmit = async (data: RegisterInput) => {
    await registerUser(data.email, data.password);
    // possível redirect
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <h1 className="text-center text-2xl font-semibold">Criar conta</h1>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" {...register('email')} className="mt-1 w-full rounded border p-2" />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Senha</label>
          <input
            type="password"
            {...register('password')}
            className="mt-1 w-full rounded border p-2"
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Confirmar senha</label>
          <input
            type="password"
            {...register('confirmPassword')}
            className="mt-1 w-full rounded border p-2"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="w-full rounded bg-primary-500 py-2 font-semibold text-white disabled:opacity-50"
        >
          {isSubmitting ? 'Criando...' : 'Criar conta'}
        </button>

        <p className="text-center text-sm">
          Já possui conta?{' '}
          <Link href="/login" className="text-primary-600 hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}
