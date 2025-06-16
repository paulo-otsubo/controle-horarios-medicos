'use client';

import { useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { useAuth } from './useAuth';
import { db } from '../lib/firebase';
import { useRegistroStore } from '../stores/registroStore';
import { Registro } from '../types/registro';

export function useRegistrosSync() {
  const { user } = useAuth();
  const setRegistros = useRegistroStore((s) => s.setRegistros);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'registros'),
      where('usuarioId', '==', user.uid),
      orderBy('data', 'asc'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const docs: Registro[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Registro) }));
      setRegistros(docs);
    });
    return unsub;
  }, [user, setRegistros]);
}
