import { describe, it, expect } from 'vitest';
import { calcularHorasTrabalho } from '../../src/lib/calculations';

describe('calcularHorasTrabalho', () => {
  it('calcula horas dentro do mesmo dia', () => {
    expect(calcularHorasTrabalho('08:00', '12:00')).toBe(4);
  });

  it('calcula intervalo atravessando meia-noite', () => {
    expect(calcularHorasTrabalho('22:00', '02:00')).toBe(4);
  });
});
