# Arquitetura Técnica: Sistema de Controle de Horários Médicos

## Stack Tecnológico

### Frontend

**Framework**: Next.js 14+ com App Router

- **Justificativa**: Máxima compatibilidade com ferramentas de vibe coding (v0, Bolt, Cursor)
- **Rendering**: SSR + CSR híbrido para performance mobile
- **PWA**: Service Workers para experiência app-like

**Estilização**: Tailwind CSS 3.4+

- **Justificativa**: Padrão das ferramentas AI, desenvolvimento rápido
- **Configuração**: Mobile-first, sistema de design personalizado
- **Componentes**: Headless UI ou Radix UI para acessibilidade

**Estado**: Zustand + React Query

- **Estado Local**: Zustand para UI state
- **Estado Servidor**: TanStack Query para cache e sincronização
- **Persistência**: localStorage para dados temporários

### Backend

**BaaS**: Firebase 10+

- **Database**: Firestore para dados estruturados
- **Auth**: Firebase Authentication
- **Functions**: Cloud Functions para lógica de negócio
- **Storage**: Firebase Storage para exports
- **Hosting**: Firebase Hosting

### Bibliotecas Principais

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "firebase": "^10.0.0",
    "tailwindcss": "^3.4.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "date-fns": "^3.0.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "framer-motion": "^10.16.0",
    "recharts": "^2.8.0"
  }
}
```

## Estrutura de Pastas

```
src/
├── app/                          # App Router (Next.js 14)
│   ├── (auth)/                   # Grupo de rotas autenticadas
│   │   ├── dashboard/            # Dashboard principal
│   │   ├── registros/            # Gestão de registros
│   │   ├── planos/               # Gestão de planos
│   │   ├── equipe/               # Gestão de equipe (admins)
│   │   └── relatorios/           # Relatórios e exports
│   ├── (public)/                 # Rotas públicas
│   │   ├── login/                # Autenticação
│   │   └── cadastro/             # Registro de usuários
│   ├── api/                      # API Routes
│   │   ├── registros/            # Endpoints de registros
│   │   ├── usuarios/             # Gestão de usuários
│   │   └── relatorios/           # Geração de relatórios
│   ├── globals.css               # Estilos globais
│   ├── layout.tsx                # Layout raiz
│   └── page.tsx                  # Página inicial
├── components/                   # Componentes reutilizáveis
│   ├── ui/                       # Componentes base (shadcn/ui)
│   ├── forms/                    # Formulários específicos
│   ├── charts/                   # Gráficos e visualizações
│   └── layout/                   # Componentes de layout
├── lib/                          # Utilitários e configurações
│   ├── firebase.ts               # Configuração Firebase
│   ├── validations.ts            # Schemas Zod
│   ├── utils.ts                  # Funções utilitárias
│   └── constants.ts              # Constantes da aplicação
├── hooks/                        # Custom hooks
│   ├── useAuth.ts                # Hook de autenticação
│   ├── useRegistros.ts           # Hook para registros
│   └── useLocalStorage.ts        # Hook para persistência local
├── stores/                       # Stores Zustand
│   ├── authStore.ts              # Estado de autenticação
│   ├── registroStore.ts          # Estado de registros
│   └── uiStore.ts                # Estado da UI
├── types/                        # Definições TypeScript
│   ├── index.ts                  # Tipos principais
│   ├── firebase.ts               # Tipos do Firebase
│   └── api.ts                    # Tipos das APIs
└── middleware.ts                 # Middleware de autenticação
```

## Arquitetura de Dados (Firestore)

### Coleções Principais

**users** (Usuários)

```typescript
{
  id: string;                     // UID do Firebase Auth
  email: string;
  nome: string;
  role: 'admin_global' | 'admin_equipe' | 'medico';
  equipeId?: string;              // Referência à equipe
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}
```

**equipes** (Equipes Médicas)

```typescript
{
  id: string;
  nome: string;
  adminId: string;                // Referência ao admin da equipe
  membros: string[];              // Array de IDs dos médicos
  configuracoes: {
    timezone: string;
    horasPadrao: number;
  };
  createdAt: Timestamp;
  isActive: boolean;
}
```

**registros** (Registros de Horários)

```typescript
{
  id: string;
  usuarioId: string;              // Referência ao usuário
  equipeId: string;               // Referência à equipe
  data: string;                   // YYYY-MM-DD
  horaEntrada: string;            // HH:mm
  horaSaida: string;              // HH:mm
  tipo: 'trabalho' | 'sobreaviso_acionado' | 'sobreaviso_nao_acionado';
  observacoes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isDeleted: boolean;
}
```

**planos** (Planos de Trabalho)

```typescript
{
  id: string;
  usuarioId: string;              // Dono do plano
  equipeId: string;               // Equipe associada
  nome: string;
  isTemplate: boolean;            // Se é template compartilhável
  cronograma: {
    [diaSemana: string]: {        // 'monday', 'tuesday', etc.
      horaEntrada: string;
      horaSaida: string;
      tipo: string;
      isAtivo: boolean;
    }
  };
  horasSemanais: number;          // Total esperado por semana
  createdAt: Timestamp;
  isActive: boolean;
}
```

**audit_logs** (Logs de Auditoria)

```typescript
{
  id: string;
  usuarioId: string;
  acao: string;                   // 'create', 'update', 'delete', 'export'
  recurso: string;                // 'registro', 'plano', 'usuario'
  detalhes: Record<string, any>;  // Dados específicos da ação
  timestamp: Timestamp;
  ip?: string;
  userAgent?: string;
}
```

## Padrões de Código

### TypeScript Strict Mode

```typescript
// tsconfig.json configurações obrigatórias
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true
}
```

### Validação com Zod

```typescript
// Exemplo de schema de validação
export const RegistroSchema = z.object({
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  horaEntrada: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  horaSaida: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  tipo: z.enum(['trabalho', 'sobreaviso_acionado', 'sobreaviso_nao_acionado']),
  observacoes: z.string().max(500).optional()
});
```

### Error Handling Padrão

```typescript
// Wrapper para operações async
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    console.error(`Erro em ${context}:`, error);
    // Log para Firebase Analytics/Crashlytics
    return null;
  }
}
```

### Princípios SOLID Aplicados

**Single Responsibility**: Cada componente tem uma responsabilidade única
**Open/Closed**: Componentes extensíveis via props/composition
**Liskov Substitution**: Interfaces consistentes entre implementações
**Interface Segregation**: Hooks específicos para cada domínio
**Dependency Inversion**: Injeção de dependências via context/props

## Configurações de Performance

### Mobile-First Optimizations

```typescript
// Configuração do PWA
export const pwaConfig = {
  name: 'Controle Médico',
  short_name: 'ControleMed',
  display: 'standalone',
  orientation: 'portrait',
  theme_color: '#3B82F6',
  background_color: '#FFFFFF',
  start_url: '/dashboard',
  scope: '/'
};
```

### Lazy Loading Strategy

```typescript
// Componentes carregados sob demanda
const RelatoriosPage = lazy(() => import('./pages/relatorios'));
const EquipePage = lazy(() => import('./pages/equipe'));
```

### Cache Strategy

```typescript
// React Query configuração
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: 3,
      refetchOnWindowFocus: false
    }
  }
});
```

## Segurança e Firebase Rules

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários só podem ler/editar próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Registros: usuário vê apenas próprios, admin da equipe vê todos da equipe
    match /registros/{registroId} {
      allow read, write: if request.auth != null &&
        (resource.data.usuarioId == request.auth.uid ||
         isAdminOfTeam(request.auth.uid, resource.data.equipeId));
    }
  }
}
```

## Deploy e CI/CD

### Build e Deploy

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "deploy": "firebase deploy --only hosting,firestore:rules,functions",
    "dev": "next dev"
  }
}
```

### Environment Variables

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```
