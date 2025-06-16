# Roadmap de Tarefas – Sistema de Controle de Horários Médicos

> Este documento é o guia oficial de implementação. Cada tarefa contém:
> • **Objetivo** – Por que estamos fazendo?  
> • **Passos Recomendados** – Como fazer passo a passo.  
> • **Critérios de Aceite** – Como saber que está pronto.
>
> Consulte sempre os documentos em `docs/` para contexto:  
> • Visão geral → `1_project_overview.md`  
> • Arquitetura técnica → `2_technical_architecture.md`  
> • Filosofia de design → `3_design_philosophy.md`  
> • Qualidade e testes → `4_quality_guidelines.md`

## Legenda de Status

- [ ] Não iniciado | [~] Em progresso | [x] Concluído | [!] Bloqueado

---

## Fase 1 Setup Inicial & Configuração

### 1.1 Configuração do Projeto

- [x] **T1.1.1 – Inicializar projeto Next.js 14 + TypeScript** _(usando npm em vez de pnpm)_

  - Objetivo: Criar a base do Frontend seguindo a arquitetura proposta (↗ docs/2_technical_architecture.md › Stack Tecnológico).
  - Passos:
    1. Executar `pnpm create next-app@latest controle-horarios-medicos --ts --app`.
    2. Selecionar opção **"use App Router"** quando solicitado.
    3. Remover boilerplate desnecessário (ex.: pasta `app/api/hello`).
  - Critérios de Aceite:
    - Projeto compila sem erros via `pnpm dev`.

- [x] **T1.1.2 – Configurar ESLint & Prettier** _(rodando `npm run lint` e `npm run format`)_

  - Objetivo: Garantir padronização de código.
  - Passos:
    1. Instalar dependências: `pnpm add -D eslint @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-tailwindcss`.
    2. Copiar arquivo `.eslintrc.cjs` base (↗ docs/4_quality_guidelines.md › Padrões de Código) ou criar do zero.
    3. Adicionar script `lint` em `package.json`.
  - Critérios de Aceite:
    - Rodar `pnpm lint` não gera erros.

- [x] **T1.1.3 – Adicionar Tailwind CSS** _(versão 3.4, build ok)_

  - Objetivo: Habilitar utilitários de estilização.
  - Passos:
    1. `pnpm add -D tailwindcss postcss autoprefixer` & `npx tailwindcss init -p`.
    2. Inserir diretivas `@tailwind base; @tailwind components; @tailwind utilities;` em `src/app/globals.css`.
    3. Copiar configuração recomendada no docs/2_technical_architecture.md.
  - Critérios de Aceite:
    - Classe `bg-primary-500` aplicada em `app/page.tsx` reflete cor correta.

- [x] **T1.1.4 – Configurar Ambiente de Desenvolvimento** _(arquivos .nvmrc, .editorconfig, env.example, README)_

  - Objetivo: Facilitar onboarding de novos devs.
  - Passos:
    1. Criar `.nvmrc` com versão `20`.
    2. Adicionar `.editorconfig`.
    3. Criar `.env.example` listando vars básicas (`NEXT_PUBLIC_FIREBASE_API_KEY` etc.).
  - Critérios de Aceite:
    - README contém instruções "clone → pnpm i → pnpm dev".

- [x] **T1.1.5 – Criar Estrutura de Pastas** (concluído)

  - Critérios de Aceite:
    - Diretórios listados em docs/2_technical_architecture.md já existem em `src/`.

- [x] **T1.1.6 – Hooks de Pré-commit & Workflow de Lint/Format** _(husky + lint-staged configurados)_
  - Objetivo: Garantir que todo o código passe por lint e Prettier antes de chegar ao repositório remoto.
  - Passos:
    1. `npm install -D husky lint-staged`.
    2. Executar `npx husky install` e adicionar o script `postinstall` no `package.json`.
    3. Criar hook em `.husky/pre-commit` com:
    ```bash
    #!/usr/bin/env sh
    . "$(dirname "$0")/_/husky.sh"
    npm run lint && npm run format -- --check
    ```
    4. Configurar `lint-staged` no `package.json` para rodar Prettier em arquivos alterados.
  - Critérios de Aceite:
    - Commit falha caso haja erros de lint ou formatação.
    - Documentação no README explicando configuração.

### 1.2 Configuração do Firebase

- [x] **T1.2.1 – Criar Projeto Firebase** _(projeto criado e variáveis adicionadas)_

  - Passos: Console → Add Project → Sem Google Analytics.
  - Critérios: Projeto ativo, IDs copiados pro `.env.local`.

- [x] **T1.2.2 – Ativar Autenticação Email/Password** _(provedor habilitado no console)_
- [x] **T1.2.3 – Criar Firestore (modo test)** _(Firestore criado em modo teste)_
- [x] **T1.2.4 – Configurar Regras de Segurança mínimas** _(Firestore & Storage)_
- [x] **T1.2.5 – Implementar Arquivo de Configuração `src/lib/firebase.ts`** _(arquivo criado e build passou)_

- [x] **T1.2.6 – Definir Indexes Compostos (Firestore)** _(arquivo firestore.indexes.json criado; executar `firebase deploy --only firestore:indexes`)_

- [x] **T1.2.7 – Prototipar Cloud Functions Base** _(Functions exportCsv + cleanupSoftDeleted implantadas)_
  - Objetivo: Preparar ambiente Functions para lógica pesada (exportação CSV grande, tarefas batch, soft-delete TTL).
  - Passos:
    1. `firebase init functions` com TypeScript.
    2. Criar função `exportCsv` e endpoint HTTP protegido por auth.
    3. Criar função agendada `cleanupSoftDeleted` removendo docs >24 meses.
  - Critérios de Aceite:
    - Funções compilam e rodam localmente via `firebase emulators:start`.
    - Deploy bem-sucedido no projeto Firebase.

### 1.3 Configuração de Testes & CI

- [x] **T1.3.1 – Configurar Vitest + Testing Library (Unit)**
- [x] **T1.3.2 – Configurar MSW (mocks) + Playwright (E2E)**
- [x] **T1.3.3 – Adicionar Script `test`, `test:watch`, `e2e`**
- [x] **T1.3.4 – Setup CI (GitHub Actions) Rodando lint + testes**

---

## Fase 2 Base Funcional (Core)

### 2.1 Autenticação

- [x] **T2.1.1 – Hook `useAuth`** _(hook implementado)_
  - Passos: Ver exemplo em docs/2_technical_architecture.md.
  - Aceite: `user` & `loading` retornados corretamente.
- [x] **T2.1.2 – Páginas `/(public)/login` & `/cadastro`** _(formularios com RHF + Zod)_
  - Formulário com React Hook Form + Zod.
  - Aceite: Validações client-side + mensagem erro do Firebase.
- [x] **T2.1.3 – Middleware de rota protegida** _(middleware.ts implementado)_
- [x] **T2.1.4 – Persistência (localStorage) + Auto-refresh Token** _(cookie auth-token, localStorage, listener de refresh)_

### 2.2 Registros de Horário

- [x] **T2.2.1 – Modelo & Schema Zod (`RegistroSchema`)** _(validations.ts e types/registro.ts criados)_
- [x] **T2.2.2 – Store Zustand `registroStore`** _(persist localStorage, CRUD ações)_
- [x] **T2.2.3 – Componente "QuickActionButtons" (Entrar/Sair)** _(component em components/ui)_
- [x] **T2.2.4 – Formulário Detalhado (Anotações, tipo)** _(RegistroForm implementado)_
- [x] **T2.2.5 – Validação de Sobreposição + Cálculos (`lib/calculations.ts`)**

### 2.3 Planejamento

- [x] **T2.3.1 – CRUD de Planos (`/planos`)** _(store + pages mínimas)_
- [x] **T2.3.2 – Templates Compartilháveis** _(flag isTemplate no CRUD)_
- [x] **T2.3.3 – Comparação Mensal (Hook `useComparativo`)** _(hook calcula diferença)_

---

## Fase 3 Features Avançadas

### 3.1 Dashboard

- [x] **T3.1.1 – Layout Base (`(auth)/dashboard/layout.tsx`)**
- [x] **T3.1.2 – Cards Resumo (Horas, Meta, Sobreaviso)**
- [x] **T3.1.3 – Gráficos (Recharts) + Hook fetch**

### 3.2 Gestão de Equipe

- [x] **T3.2.1 – CRUD Equipes (Admins)**
- [x] **T3.2.2 – Permissões & Roles**
- [x] **T3.2.3 – Relatório Consolidado**
- [x] **T3.2.4 – Custom Claims Firebase para Roles** _(definir claims `role: admin|member` via SDK Admin; script ou Cloud Function)_
- [x] **T3.2.5 – Atualizar AdminGuard & useRole para ler claims** _(usar `user.getIdTokenResult` e listener de refresh)_
- [x] **T3.2.6 – Regras Firestore & Functions baseadas em role** _(condição `request.auth.token.role == 'admin'`)_

### 3.3 Relatórios

- [x] **T3.3.1 – Endpoint Export CSV (`/api/relatorios`)**
- [x] **T3.3.2 – UI de Filtros Avançados**
- [x] **T3.3.3 – Exportação CSV via Cloud Function + Storage**
  - Objetivo: Permitir download de grandes relatórios sem timeout do client.
  - Passos:
    1. Chamar função `exportCsv` (T1.2.7) via `fetch` segurando token Firebase.
    2. Exibir toast de "arquivo sendo gerado" e polling para URL do Storage.
    3. Fazer download automático quando pronto.
  - Critérios de Aceite:
    - Arquivo aparece na pasta `reports/` do Storage.
    - Link expira em < 1 h.

---

## Fase 4 Performance & UX

- [x] **T4.1 – PWA & Service Worker**
- [x] **T4.2 – Gestos Touch + Haptics**
- [x] **T4.3 – Lazy Loading Dinâmico**
- [x] **T4.4 – Web Vitals & Performance Budgets**
  - Objetivo: Garantir metas de LCP <1.5 s, CLS <0.1 etc.
  - Passos:
    1. Instalar `next-web-vitals` ou usar built-in analytics.
    2. Adicionar script de coleta em `_app` e enviar eventos ao Firebase Analytics.
    3. Ajustar imagens (`next/image`) e compressão até atingir metas.
  - Critérios de Aceite:
    - Lighthouse ≥90 em todas as categorias.
    - Relatório Web Vitals no console Firebase.

---

## Fase 5 Qualidade

- [x] **T5.1 – Cobertura 80%+ Unit**
- [x] **T5.2 – Integração Firebase (msw mocks)**
- [x] **T5.3 – Cenários Críticos Playwright**
- [x] **T5.4 – Testes de Acessibilidade (axe-playwright)**
- [x] **T5.5 – Testes das Regras de Segurança (Firestore Emulator)**

---

## Fase 6 Documentação & Deploy

- [x] **T6.1 – Atualizar README + Arquitetura**
- [x] **T6.2 – Configurar Hosting Firebase**
- [x] **T6.3 – Monitoramento (Performance & Crashlytics)**
- [x] **T6.4 – Observabilidade (Analytics + Logs)**

  - Passos:
    1. Configurar eventos customizados Firebase Analytics (login, registro, export).
    2. Adicionar logger para Cloud Logging nas Functions.
  - Critérios de Aceite: Eventos visíveis no dashboard em <5 min.

- [x] **T6.5 – CD Firebase Hosting + Versionamento Semântico**

  - Passos:
    1. GitHub Action para build → deploy em `main`.
    2. Usar `semantic-release` ou `standard-version` para gerar changelog e tags.
  - Critérios de Aceite: Deploy automático e tag gerada após merge.

- [x] **T6.6 – ADRs & Guia de Contribuição**
  - Passos:
    1. Adicionar pasta `docs/adr/` com modelo MADR.
    2. Escrever guia `CONTRIBUTING.md` explicando fluxo Git, commit lint etc.
  - Critérios de Aceite: PRs referenciam ADRs quando necessário.

---

### Prioridades de Entrega (MVP)

1. **Fase 1 completa**
2. T2.1 + T2.2.3 (Quick Action)
3. T3.1 (Dashboard básico)

> **Dica:** Abra issues no GitHub para cada tarefa usando o mesmo código (ex.: `T2.2.3`). Isso facilita rastreamento.
