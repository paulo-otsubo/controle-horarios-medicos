import { Registro } from '../types/registro';

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export function calcularHorasTrabalho(entrada: string, saida: string) {
  const start = timeToMinutes(entrada);
  let end = timeToMinutes(saida);
  if (end < start) end += 24 * 60; // overnight
  return (end - start) / 60;
}

export function validarSobreposicaoHorarios(novo: Registro, existentes: Registro[]) {
  const nStart = timeToMinutes(novo.horaEntrada);
  let nEnd = timeToMinutes(novo.horaSaida);
  if (nEnd < nStart) nEnd += 24 * 60;

  return existentes.some((r) => {
    if (r.data !== novo.data) return false;
    const s = timeToMinutes(r.horaEntrada);
    let e = timeToMinutes(r.horaSaida);
    if (e < s) e += 24 * 60;
    // overlap if ranges intersect
    return Math.max(s, nStart) < Math.min(e, nEnd);
  });
}

export function validarLimiteDiario(registros: Registro[], novo: Registro) {
  const totalHoras = registros
    .filter((r) => r.data === novo.data)
    .reduce((acc, r) => acc + calcularHorasTrabalho(r.horaEntrada, r.horaSaida), 0);
  const novasHoras = calcularHorasTrabalho(novo.horaEntrada, novo.horaSaida);
  return totalHoras + novasHoras <= 24;
}
