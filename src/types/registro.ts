export type TipoRegistro = 'trabalho' | 'sobreaviso_acionado' | 'sobreaviso_nao_acionado';

export interface Registro {
  id?: string;
  usuarioId: string;
  equipeId: string;
  data: string; // YYYY-MM-DD
  horaEntrada: string; // HH:mm
  horaSaida: string; // HH:mm
  tipo: TipoRegistro;
  observacoes?: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}
