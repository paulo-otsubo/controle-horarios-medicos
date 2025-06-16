import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { subMonths } from 'date-fns';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const cleanupSoftDeleted = functions.pubsub.schedule('every 24 hours').onRun(async () => {
  const db = admin.firestore();
  const cutoff = subMonths(new Date(), 24);

  const snap = await db
    .collection('registros')
    .where('isDeleted', '==', true)
    .where('updatedAt', '<', cutoff)
    .get();

  const batch = db.batch();
  snap.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  console.log(`Soft-deleted ${snap.size} docs permanentemente removidos.`);
});
