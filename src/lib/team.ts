import { db } from './firebase';
import { nanoid } from 'nanoid';
import {
  doc,
  collection,
  setDoc,
  updateDoc,
  arrayUnion,
  getDocs,
  where,
  query,
  serverTimestamp
} from 'firebase/firestore';
import { Equipe, Invite } from '../types/equipe';

export async function createTeam(uid: string, nome: string, timezone: string) {
  const teamRef = doc(collection(db, 'equipes'));
  const equipe: Equipe = {
    id: teamRef.id,
    nome,
    adminId: uid,
    membros: [uid],
    invites: [],
    timezone,
    createdAt: Date.now(),
    isActive: true
  };
  await setDoc(teamRef, equipe);
  // Atualiza usuário (assume doc já existe)
  await updateDoc(doc(db, 'users', uid), {
    equipeId: teamRef.id,
    role: 'admin_equipe',
    updatedAt: serverTimestamp()
  });
  return teamRef.id;
}

export async function inviteMember(teamId: string, email: string) {
  const code = nanoid(8);
  const invite: Invite = { email, code, status: 'pending' };
  await updateDoc(doc(db, 'equipes', teamId), {
    invites: arrayUnion(invite)
  });
  return code;
}

export async function acceptInvite(uid: string, code: string) {
  // Procura equipe com o convite específico
  const q = query(
    collection(db, 'equipes'),
    where('invites', 'array-contains', { code, status: 'pending' })
  );
  const snap = await getDocs(q);
  if (snap.empty) {
    console.error('Nenhum convite encontrado com o código:', code);
    return false;
  }
  const teamDoc = snap.docs[0];
  const equipeId = teamDoc.id;

  // Atualiza o status do convite
  const equipeData = teamDoc.data() as Equipe;
  const invites = equipeData.invites.map((inv) =>
    inv.code === code ? { ...inv, status: 'accepted' } : inv
  );

  // Adiciona membro e atualiza o convite
  await updateDoc(teamDoc.ref, {
    membros: arrayUnion(uid),
    invites
  });

  // Atualiza o usuário
  await updateDoc(doc(db, 'users', uid), {
    equipeId,
    role: 'medico',
    updatedAt: serverTimestamp()
  });

  return true;
}
