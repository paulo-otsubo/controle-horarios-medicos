import { describe, it, expect, beforeEach } from 'vitest';
import { useRegistroStore } from '../../src/stores/registroStore';
import { act } from '@testing-library/react';

beforeEach(() => {
  useRegistroStore.getState().setRegistros([]);
});

describe('useRegistroStore', () => {
  it('adiciona registro', () => {
    act(() => {
      useRegistroStore.getState().addRegistro({
        id: '1',
        usuarioId: 'u1',
        equipeId: 'e1',
        data: '2025-01-01',
        horaEntrada: '08:00',
        horaSaida: '12:00',
        tipo: 'trabalho'
      });
    });
    expect(useRegistroStore.getState().registros.length).toBe(1);
  });
});
