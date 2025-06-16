import { useEffect, useState, useCallback } from 'react';
import { auth } from '../lib/firebase';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onIdTokenChanged
} from 'firebase/auth';
import Cookies from 'js-cookie';
import { logEventSafe } from '../lib/analytics';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { acceptInvite } from '../lib/team';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const token = await u.getIdToken();
        Cookies.set('auth-token', token, { expires: 1 });
        localStorage.setItem('user', JSON.stringify({ uid: u.uid, email: u.email }));
        // Garantir doc em users/
        const userDocRef = doc(db, 'users', u.uid);
        const snap = await getDoc(userDocRef);
        if (!snap.exists()) {
          await setDoc(userDocRef, {
            email: u.email,
            nome: u.displayName ?? '',
            role: 'medico',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isActive: true
          });
        }

        // Se usuário sem equipe, tentar aceitar convite
        const userData = (await getDoc(userDocRef)).data();
        if (userData && !userData.equipeId && u.email) {
          await acceptInvite(u.uid, u.email);
        }

        const equipeId = (await getDoc(userDocRef)).data()?.equipeId ?? '';
        localStorage.setItem('equipeId', equipeId);
      } else {
        Cookies.remove('auth-token');
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    // Atualiza cookie em mudança de token (auto-refresh ~1h)
    const unsubToken = onIdTokenChanged(auth, async (u) => {
      if (u) {
        const token = await u.getIdToken();
        Cookies.set('auth-token', token, { expires: 1 });
      }
    });

    return () => {
      unsubAuth();
      unsubToken();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    logEventSafe('login_success');
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Cria doc usuário
    await setDoc(doc(db, 'users', cred.user.uid), {
      email,
      nome: '',
      role: 'medico',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isActive: true
    });
    logEventSafe('register_success');
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    logEventSafe('logout');
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  return { user, loading, login, register, logout, resetPassword };
}
