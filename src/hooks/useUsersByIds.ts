'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UserLite {
  uid: string;
  email: string;
  nome?: string;
}

export function useUsersByIds(ids: string[]) {
  const [users, setUsers] = useState<UserLite[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const arr: UserLite[] = [];
      for (const id of ids) {
        const snap = await getDoc(doc(db, 'users', id));
        if (snap.exists()) {
          const d = snap.data() as { email: string; nome?: string };
          arr.push({ uid: id, email: d.email, nome: d.nome });
        }
      }
      if (isMounted) setUsers(arr);
    }
    if (ids.length) load();
    return () => {
      isMounted = false;
    };
  }, [ids]);

  return users;
}
