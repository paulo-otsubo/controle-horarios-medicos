export interface Invite {
  email: string;
  code: string;
  status: 'pending' | 'accepted';
}

export interface Equipe {
  id?: string;
  nome: string;
  descricao?: string;
  adminId: string;
  membros: string[];
  invites: Invite[];
  timezone: string;
  createdAt: string | number;
  updatedAt?: string | number;
  isActive: boolean;
}
