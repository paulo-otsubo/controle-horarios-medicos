import * as functions from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import Papa from 'papaparse';
import { format } from 'date-fns';
import * as admin from 'firebase-admin';

const logger = functions.logger;

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const exportCsv = functions.https.onCall(async (data, context) => {
  logger.info('exportCsv called', { uid: context.auth?.uid, data });

  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
  }

  const uid = context.auth.uid;
  const month = data.month as string; // formato YYYY-MM
  if (!month) {
    throw new functions.https.HttpsError('invalid-argument', 'Parâmetro month é obrigatório');
  }

  const db = getFirestore();
  const start = `${month}-01`;
  const registrosSnap = await db
    .collection('registros')
    .where('usuarioId', '==', uid)
    .where('data', '>=', start)
    .get();

  const registros = registrosSnap.docs.map((d) => d.data());
  const csv = Papa.unparse(registros);

  const storage = getStorage().bucket();
  const filename = `reports/${uid}/${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.csv`;
  const file = storage.file(filename);
  await file.save(csv, { contentType: 'text/csv' });

  await file.makePublic();
  const url = file.publicUrl();

  logger.info('exportCsv generated', { uid, url });
  return { url };
});
