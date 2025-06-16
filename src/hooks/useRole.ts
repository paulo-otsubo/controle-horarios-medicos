import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { Role } from '../types/role';
import { auth } from '../lib/firebase';
import { onIdTokenChanged } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

export function useRole() {
  const { user } = useAuth();
  const [role, setRoleState] = useState<Role>('member');
  const [loading, setLoading] = useState(true);

  // Obtém role das custom claims quando usuário loga ou token é renovado
  async function fetchRole(u: typeof user) {
    if (!u) {
      setRoleState('member');
      setLoading(false);
      return;
    }
    const res = await u.getIdTokenResult(true);
    const claimRole = res.claims.role as Role | undefined;
    setRoleState(claimRole === 'admin' ? 'admin' : 'member');
    setLoading(false);
  }

  // Inicial
  useEffect(() => {
    fetchRole(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Escuta mudança de token (auto-refresh ~1h)
  useEffect(() => {
    const unsub = onIdTokenChanged(auth, (u) => {
      fetchRole(u);
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setRole = useCallback(
    async (newRole: Role) => {
      if (!user) return;
      const functions = getFunctions();
      const callable = httpsCallable<{ uid: string; role: Role }, { success: boolean }>(
        functions,
        'setUserRole'
      );
      await callable({ uid: user.uid, role: newRole });
      // força refresh do token para refletir claims
      await user.getIdToken(true);
    },
    [user]
  );

  return { role, setRole, loading };
}
