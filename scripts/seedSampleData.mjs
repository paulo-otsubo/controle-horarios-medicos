import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import fs from 'node:fs/promises';
import { randomInt } from 'node:crypto';
import path from 'node:path';

// === carregando a key JSON ===
const serviceAccount = JSON.parse(
  await fs.readFile(path.resolve('serviceAccountKey.json'), 'utf8')
);

// === Firebase Admin ===
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// === Config ===
const email = 'linhocdf@gmail.com';
const uid = 'I7S6P6psiuOk4uso5H1PxRFhQNC2';
const equipeId = '5XMECMSXg326eTgqINGT';

function toHHMM(date) {
  return date.toTimeString().slice(0, 5);
}

async function ensureUser() {
  await db.doc(`users/${uid}`).set(
    {
      email,
      nome: 'Usuário Exemplo',
      role: 'medico',
      equipeId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isActive: true
    },
    { merge: true }
  );
}

async function seedRegistros() {
  const registros = db.collection('registros');
  const today = new Date();
  const start = new Date();
  start.setMonth(today.getMonth() - 2); // 3 meses incluindo atual
  start.setDate(1);

  const current = new Date(start);
  while (current <= today) {
    const dow = current.getDay();
    if (dow !== 0 && dow !== 6) {
      if (Math.random() < 0.7) {
        const entrada = new Date(current);
        entrada.setHours(randomInt(7, 10), randomInt(0, 60));
        const saida = new Date(entrada);
        saida.setHours(saida.getHours() + randomInt(8, 11), randomInt(0, 60));

        await registros.add({
          usuarioId: uid,
          equipeId,
          data: current.toISOString().slice(0, 10),
          horaEntrada: toHHMM(entrada),
          horaSaida: toHHMM(saida),
          tipo: 'trabalho',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          isDeleted: false
        });
      }
      if (Math.random() < 0.2) {
        const sobreIni = new Date(current);
        sobreIni.setHours(22, 0, 0, 0);
        const sobreFim = new Date(sobreIni);
        sobreFim.setDate(sobreFim.getDate() + 1);
        sobreFim.setHours(6, 0, 0, 0);

        await registros.add({
          usuarioId: uid,
          equipeId,
          data: current.toISOString().slice(0, 10),
          horaEntrada: toHHMM(sobreIni),
          horaSaida: toHHMM(sobreFim),
          tipo: Math.random() < 0.5 ? 'sobreaviso_acionado' : 'sobreaviso_nao_acionado',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          isDeleted: false
        });
      }
    }
    current.setDate(current.getDate() + 1);
  }
}

// === Execução ===
console.log('🔄 Seeding Firestore...');
await ensureUser();
await seedRegistros();
console.log('✅ Concluído.');
process.exit(0);
