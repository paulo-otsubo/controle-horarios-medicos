export interface Equipe {
  id: string;
  nome: string;
  descricao?: string;
  membros: string[]; // user ids
  createdAt?: string;
  updatedAt?: string;
}
