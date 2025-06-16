import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { setLogLevel } from 'firebase/firestore';

setLogLevel('error');

const rules = readFileSync('firestore.rules', 'utf8');

let testEnv: any;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-test',
    firestore: { rules }
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe('Firestore security', () => {
  it('bloqueia não autenticado', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const doc = db.collection('equipes').doc('x');
    await assertFails(doc.set({ nome: 'x' }));
  });

  it('permite admin criar equipe', async () => {
    const db = testEnv.authenticatedContext('uid-admin', { role: 'admin' }).firestore();
    const doc = db.collection('equipes').doc('x');
    await assertSucceeds(doc.set({ nome: 'Teste', membros: [] }));
  });
});
