import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Garante que o app admin está inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

interface SetUserRoleData {
  uid: string;
  role: 'admin' | 'member';
}

export const setUserRole = functions.https.onCall(async (data: SetUserRoleData, context) => {
  // Checa se quem chama está autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Requer autenticação.');
  }

  // Verifica se quem chama é admin
  const callerRole = context.auth.token.role as string | undefined;
  if (callerRole !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Apenas administradores podem definir roles.'
    );
  }

  const { uid, role } = data;
  if (!uid || !role) {
    throw new functions.https.HttpsError('invalid-argument', 'uid e role são obrigatórios.');
  }
  if (role !== 'admin' && role !== 'member') {
    throw new functions.https.HttpsError('invalid-argument', 'Role inválido.');
  }

  await admin.auth().setCustomUserClaims(uid, { role });

  // Opcional: invalidar cache de token
  await admin.auth().revokeRefreshTokens(uid);

  return { success: true };
});
