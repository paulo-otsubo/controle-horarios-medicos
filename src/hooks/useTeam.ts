'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from './useAuth';
import { db } from '../lib/firebase';
import { Equipe } from '../types/equipe';

export function useTeam() {
  const { user } = useAuth();
  const [team, setTeam] = useState<Equipe | null>(null);

  useEffect(() => {
    if (!user) return;

    let unsubTeam: (() => void) | null = null;

    // Escuta alterações no documento do usuário para capturar mudanças em equipeId
    const unsubUser = onSnapshot(doc(db, 'users', user.uid), (userSnap) => {
      const data = userSnap.data() as { equipeId?: string } | undefined;
      const equipeId = data?.equipeId;

      if (equipeId) {
        // Persiste localmente para outras abas/tabs
        localStorage.setItem('equipeId', equipeId);

        // (Re)cria listener da equipe quando o id mudar
        if (unsubTeam) unsubTeam();
        unsubTeam = onSnapshot(doc(db, 'equipes', equipeId), (teamSnap) => {
          setTeam(teamSnap.exists() ? (teamSnap.data() as Equipe) : null);
        });
      } else {
        // Sem equipe => limpa
        if (unsubTeam) {
          unsubTeam();
          unsubTeam = null;
        }
        setTeam(null);
      }
    });

    return () => {
      unsubUser();
      if (unsubTeam) unsubTeam();
    };
  }, [user]);

  return team;
}
