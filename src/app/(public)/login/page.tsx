'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '../../../lib/validations';
import { z } from 'zod';
import { useAuth } from '../../../hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type LoginInput = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const { user, login, loading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({ resolver: zodResolver(LoginSchema) });

  // Redireciona se já está autenticado
  useEffect(() => {
    if (!loading && user) {
      const params =
        typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : undefined;
      const dest = params?.get('redirect') ?? '/auth/dashboard';
      router.replace(dest);
    }
  }, [loading, user, router]);

  const onSubmit = async (data: LoginInput) => {
    await login(data.email, data.password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <h1 className="text-center text-2xl font-semibold">Entrar</h1>

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

        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="w-full rounded bg-primary-500 py-2 font-semibold text-white disabled:opacity-50"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="text-center text-sm">
          Não possui conta?{' '}
          <Link href="/cadastro" className="text-primary-600 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
}
