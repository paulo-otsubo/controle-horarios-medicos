import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import serviceAccount from '../serviceAccountKey.json' assert { type: 'json' };
import { randomInt } from 'crypto';

initializeApp({ credential: cert(serviceAccount as any) });
const db = getFirestore();

// CONFIG
const email = 'linhocdf@gmail.com';
const uid = 'demo-linho'; // escolha um UID fixo ou gere no Auth separadamente
const equipeId = 'equipe-demo';

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
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

function toHHMM(date: Date) {
  return date.toTimeString().slice(0, 5);
}

async function seedRegistros() {
  const registrosCol = db.collection('registros');

  const today = new Date();
  const start = new Date();
  start.setMonth(today.getMonth() - 2); // 3 meses incluindo atual
  start.setDate(1);

  const current = new Date(start);
  while (current <= today) {
    // pular finais de semana (exemplo)
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      // chance de ter registro ~70%
      if (Math.random() < 0.7) {
        // trabalho normal
        const entrada = new Date(current);
        entrada.setHours(randomInt(7, 10));
        entrada.setMinutes(randomInt(0, 60));

        const saida = new Date(entrada);
        // duração 8-10h
        saida.setHours(saida.getHours() + randomInt(8, 11));
        saida.setMinutes(saida.getMinutes() + randomInt(0, 60));

        await registrosCol.add({
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
      // chance de sobreaviso no mesmo dia 20%
      if (Math.random() < 0.2) {
        const sobre = new Date(current);
        sobre.setHours(22, 0, 0, 0);
        const fimSobre = new Date(sobre);
        fimSobre.setHours(6, 0, 0, 0);
        fimSobre.setDate(fimSobre.getDate() + 1);

        await registrosCol.add({
          usuarioId: uid,
          equipeId,
          data: current.toISOString().slice(0, 10),
          horaEntrada: toHHMM(sobre),
          horaSaida: toHHMM(fimSobre),
          tipo: Math.random() < 0.5 ? 'sobreaviso_acionado' : 'sobreaviso_nao_acionado',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          isDeleted: false
        });
      }
    }
    // próximo dia
    current.setDate(current.getDate() + 1);
  }
}

(async () => {
  try {
    console.log('🔄 Inserindo dados de exemplo...');
    await ensureUser();
    await seedRegistros();
    console.log('✅ Concluído');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
