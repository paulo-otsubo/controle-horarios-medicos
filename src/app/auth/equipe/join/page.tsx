'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../hooks/useAuth';
import { acceptInvite } from '../../../../lib/team';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';

export default function JoinTeamPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleJoin = async () => {
    if (!user) {
      setError('Sua conta precisa estar logada para aceitar convites.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const success = await acceptInvite(user.uid, code);
      if (success) {
        router.push('/auth/equipe');
      } else {
        throw new Error('Código inválido ou convite não encontrado.');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ocorreu um erro ao entrar na equipe.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Entrar na Equipe</h1>
        <p className="text-sm text-gray-600">
          Insira o código de convite que você recebeu para se juntar à equipe.
        </p>
      </div>

      <div className="space-y-2">
        <Input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.trim())}
          placeholder="Insira o código de convite"
          className="w-full"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <Button onClick={handleJoin} disabled={loading || code.length < 6} className="w-full">
        {loading ? 'Entrando...' : 'Entrar na Equipe'}
      </Button>
    </div>
  );
}
