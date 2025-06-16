# Plano de Implementação – Módulo de Equipes e Convites

> Revisado em: 2025-06-16

## Objetivo

Habilitar criação de equipes, envio/aceite de convites e associação automática do usuário à equipe ao registrar-se, conforme `docs/1_project_overview.md`.

---

## Etapas

### Etapa 1 – Camada de Dados (Firestore)

1. **Coleção `equipes`**
   ```ts
   interface Equipe {
     id: string; // docId
     nome: string;
     adminId: string; // UID do criador
     membros: string[]; // UIDs
     invites: { email: string; code: string; status: 'pending' | 'accepted' }[];
     timezone: string;
     createdAt: Timestamp;
     isActive: boolean;
   }
   ```
2. **Índices necessários**

   - `invites.email` + `invites.status` (consulta por email pendente)

3. **Regras de segurança**
   - Admin: `request.auth.uid == resource.data.adminId`
   - Membro leitura própria.

### Etapa 2 – Serviços (`lib/team.ts`)

| Função                       | Descrição                                                                                       |
| ---------------------------- | ----------------------------------------------------------------------------------------------- |
| `createTeam(nome, timezone)` | Cria doc, grava no usuário (`equipeId`, `role: admin_equipe`).                                  |
| `inviteMember(email)`        | Gera código, adiciona em `invites`, envia email (TODO).                                         |
| `acceptInvite(uid, email)`   | Procura invite pendente → move UID para `membros`, marca como `accepted`, atualiza doc usuário. |

### Etapa 3 – Hooks

- `useTeam()` – retorna equipe em tempo real (`onSnapshot`).
- Ajustar `useAuth` pós-registro → chamar `acceptInvite`.

### Etapa 4 – UI/UX

1. **Onboarding** (`/auth/equipe/onboarding`)
   - Opções: Criar • Tenho convite • Pular.
2. **Criar Equipe** (`/auth/equipe/nova`)
   - Formulário existente → chama `createTeam`.
3. **Tela Equipe** (`/auth/equipe`)
   - Se admin: lista membros, botão "Convidar".
   - Se membro: lista membros.
   - Se sem equipe: redirect → onboarding.
4. **Convidar**
   - Modal: digitar email → chama `inviteMember` → mostra código.
5. **Aceitar convite por código** (`/auth/equipe/join`)
   - Campo code → chama `acceptInvite`.

### Etapa 5 – Testes

- Unit: `teamService.test.ts` para cada função.
- E2E: criar equipe → convidar → registro novo usuário → validar associação.

---

## Entregáveis

1. **Sprint 1** – Etapa 1 + 2 + hook `useTeam`.
2. **Sprint 2** – Etapa 3 (registro), páginas Onboarding/Nova Equipe.
3. **Sprint 3** – Tela Equipe completa + convites.
4. **Sprint 4** – E2E + ajustes UX.

---

## Riscos

- Conflito de claims Firebase vs regras Firestore → validar.
- Emails inválidos → fallback com código manual.

---

## Done Criteria

- Criar equipe, convidar, aceitar convite funcionam fim-a-fim.
- Usuário loga e vê equipe automaticamente.
- Cobertura de testes ≥ 80 % para `lib/team.ts`.

## Resumo técnico (implementado)

- Firestore: coleção `equipes` criada; índices e regras adicionados em `firestore.rules` e `firestore.indexes.json`.
- Serviço `lib/team.ts` com funções `createTeam`, `inviteMember`, `acceptInvite`.
- Hook `src/hooks/useTeam.ts` para streaming em tempo real do documento da equipe.
- Ajustes em `src/hooks/useAuth.ts` para aceitar convite e persistir `equipeId` do usuário.
- Páginas Next.js:
  - `src/app/auth/equipe/onboarding/page.tsx`
  - `src/app/auth/equipe/nova/page.tsx`
  - `src/app/auth/equipe/join/page.tsx`
  - `src/app/auth/equipe/page.tsx`
- Componentes reutilizáveis: `InviteMemberModal`, `MemberList`, `TeamHeader`.
- Testes: `__tests__/teamService.test.ts` (unit) e `cypress/e2e/team_flow.cy.ts` (E2E).
- Script seed `scripts/seedSampleData.ts` atualizado para popular equipes de teste.

## Status

Concluído ✅ em 2025-06-16
