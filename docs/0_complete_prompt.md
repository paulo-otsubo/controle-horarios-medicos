# PROMPT COMPLETO: Sistema de Controle de Horários Médicos

## CONTEXTO E OBJETIVOS

Você é um desenvolvedor especialista criando um **aplicativo web mobile-first** para controle paralelo de horários trabalhados por equipes médicas (5-10 pessoas por equipe). O sistema permite que médicos registrem horários de forma rápida e engajadora, comparando com planos pré-definidos para detectar discrepâncias com sistemas oficiais.

### Problema que Resolve

- Médicos precisam de controle autônomo de horários para detectar erros em folhas de pagamento
- Redução de fricção no registro para garantir uso consistente
- Gestão de múltiplas equipes com controle de acesso hierárquico

### Usuários Finais

- **Médicos**: Registram horários, veem próprios dados, comparam com plano pessoal
- **Admin de Equipe**: Gerencia equipe específica, vê todos os dados da equipe
- **Admin Global**: Gerencia múltiplas equipes (máximo 20), cria templates globais

## FUNCIONALIDADES PRINCIPAIS

### Sistema de Tipos de Registro

```typescript
type TipoRegistro = 'trabalho' | 'sobreaviso_acionado' | 'sobreaviso_nao_acionado';

// Regras de cálculo mensal:
// - Trabalho: valor integral das horas
// - Sobreaviso Acionado: valor integral (1x hora trabalhada)
// - Sobreaviso Não Acionado: valor reduzido (0.33x hora trabalhada)
```

### Campos Obrigatórios por Registro

- Data (YYYY-MM-DD)
- Hora de entrada (HH:mm)
- Hora de saída (HH:mm)
- Tipo de registro (seleção entre os 3 tipos)
- Observações (opcional, max 500 chars)

### Funcionalidades de Registro Rápido

- **Botões "1-Clique"**: "Entrar" e "Sair" na tela principal com timestamp automático
- **Preenchimento Inteligente**: Sugestão de tipo baseado em padrões históricos
- **Estados Visuais**: Indicadores claros de status (livre/trabalhando/sobreaviso)
- **Login Persistente**: Redução máxima de fricção de autenticação

### Dashboard e Relatórios

- **Resumo Mensal**: Horas trabalhadas vs planejadas com diferencial (+/-)
- **Visualizações**: Gráficos de tendência, distribuição por tipos, heatmap de intensidade
- **Exportação**: CSV para dados pessoais (usuários) e da equipe (admins)
- **Templates de Planos**: Compartilháveis entre equipes

## STACK TECNOLÓGICO OBRIGATÓRIA

### Frontend

```json
{
  "framework": "Next.js 14+ com App Router",
  "styling": "Tailwind CSS 3.4+",
  "state": "Zustand + TanStack Query",
  "forms": "React Hook Form + Zod",
  "charts": "Recharts",
  "animations": "Framer Motion",
  "ui": "Headless UI ou Radix UI",
  "icons": "Lucide React"
}
```

### Backend & Infraestrutura

```json
{
  "database": "Firebase Firestore",
  "auth": "Firebase Authentication",
  "functions": "Firebase Cloud Functions",
  "hosting": "Firebase Hosting",
  "storage": "Firebase Storage"
}
```

### Configuração PWA Obrigatória

```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/firestore\.googleapis\.com/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'firestore-cache',
        cacheableResponse: { statuses: [0, 200] }
      }
    }
  ]
});
```

## ARQUITETURA DE DADOS (FIRESTORE)

### Coleção: users

```typescript
interface User {
  id: string; // UID do Firebase Auth
  email: string;
  nome: string;
  role: 'admin_global' | 'admin_equipe' | 'medico';
  equipeId?: string; // Referência à equipe
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}
```

### Coleção: equipes

```typescript
interface Equipe {
  id: string;
  nome: string;
  adminId: string; // Referência ao admin da equipe
  membros: string[]; // Array de IDs dos médicos
  configuracoes: {
    timezone: string;
    horasPadrao: number;
  };
  createdAt: Timestamp;
  isActive: boolean;
}
```

### Coleção: registros

```typescript
interface Registro {
  id: string;
  usuarioId: string; // Referência ao usuário
  equipeId: string; // Referência à equipe
  data: string; // YYYY-MM-DD
  horaEntrada: string; // HH:mm
  horaSaida: string; // HH:mm
  tipo: 'trabalho' | 'sobreaviso_acionado' | 'sobreaviso_nao_acionado';
  observacoes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isDeleted: boolean;
}
```

### Coleção: planos

```typescript
interface Plano {
  id: string;
  usuarioId: string; // Dono do plano
  equipeId: string; // Equipe associada
  nome: string;
  isTemplate: boolean; // Se é template compartilhável
  cronograma: {
    [diaSemana: string]: {
      // 'monday', 'tuesday', etc.
      horaEntrada: string;
      horaSaida: string;
      tipo: TipoRegistro;
      isAtivo: boolean;
    };
  };
  horasSemanais: number; // Total esperado por semana
  createdAt: Timestamp;
  isActive: boolean;
}
```

## ESTRUTURA DE PASTAS OBRIGATÓRIA

```
src/
├── app/                       # Next.js 14 App Router
│   ├── (auth)/               # Rotas autenticadas
│   │   ├── dashboard/        # Dashboard principal
│   │   ├── registros/        # CRUD de registros
│   │   ├── planos/           # Gestão de planos
│   │   ├── equipe/           # Gestão de equipe (admins)
│   │   └── relatorios/       # Relatórios e exports
│   ├── (public)/             # Rotas públicas
│   │   ├── login/            # Autenticação
│   │   └── cadastro/         # Registro
│   ├── api/                  # API Routes
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                   # Componentes base
│   ├── forms/                # Formulários específicos
│   ├── charts/               # Visualizações
│   └── layout/               # Layout components
├── lib/
│   ├── firebase.ts           # Configuração Firebase
│   ├── validations.ts        # Schemas Zod
│   ├── calculations.ts       # Cálculos de horas
│   └── utils.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useRegistros.ts
│   └── useLocalStorage.ts
├── stores/                   # Zustand stores
├── types/                    # TypeScript definitions
└── middleware.ts             # Auth middleware
```

## DESIGN SYSTEM E UX

### Paleta de Cores Obrigatória

```css
:root {
  /* Primárias */
  --primary-50: #eff6ff;
  --primary-500: #3b82f6; /* Azul principal */
  --primary-600: #2563eb;
  --primary-900: #1e3a8a;

  /* Por tipo de registro */
  --trabalho: #3b82f6; /* Azul */
  --sobreaviso-acionado: #f59e0b; /* Laranja */
  --sobreaviso-nao-acionado: #8b5cf6; /* Roxo */

  /* Semânticas */
  --success: #10b981; /* Verde */
  --warning: #f59e0b; /* Amarelo */
  --error: #ef4444; /* Vermelho */
}
```

### Componentes UI Obrigatórios

#### Botões de Ação Rápida

```typescript
interface QuickActionButtonProps {
  type: 'entrada' | 'saida';
  isActive: boolean;
  currentStatus: 'livre' | 'trabalhando' | 'sobreaviso';
  onPress: () => void;
}

// Especificações:
// - Altura mínima: 56px (touch target)
// - Feedback háptico obrigatório
// - Estados visuais distintos por status
// - Animação de loading durante salvamento
```

#### Cards de Registro

```typescript
interface RegistroCardProps {
  registro: Registro;
  onEdit: () => void;
  onDelete: () => void;
}

// Layout obrigatório:
// - Swipe right: editar
// - Swipe left: deletar
// - Long press: menu contextual
// - Indicadores visuais por tipo
```

### Navegação Mobile Obrigatória

```typescript
// Bottom Tab Navigation
const tabs = [
  { icon: 'Home', label: 'Home', href: '/dashboard' },
  { icon: 'Clock', label: 'Registros', href: '/registros' },
  { icon: 'BarChart3', label: 'Dashboard', href: '/relatorios' },
  { icon: 'Users', label: 'Equipe', href: '/equipe' }, // Só admins
  { icon: 'Settings', label: 'Config', href: '/configuracoes' }
];
```

## VALIDAÇÕES E CÁLCULOS OBRIGATÓRIOS

### Schemas Zod

```typescript
export const RegistroSchema = z
  .object({
    data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
    horaEntrada: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
    horaSaida: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
    tipo: z.enum(['trabalho', 'sobreaviso_acionado', 'sobreaviso_nao_acionado']),
    observacoes: z.string().max(500).optional()
  })
  .refine((data) => {
    // Validação customizada: saída não pode ser anterior à entrada
    const entrada = parseTime(data.horaEntrada);
    const saida = parseTime(data.horaSaida);
    return saida > entrada || (saida < entrada && saida < 12); // overnight permitido
  }, 'Horário de saída não pode ser anterior à entrada');
```

### Funções de Cálculo

```typescript
export function calcularHorasTrabalho(entrada: string, saida: string): number {
  const [entradaH, entradaM] = entrada.split(':').map(Number);
  const [saidaH, saidaM] = saida.split(':').map(Number);

  let entradaMinutos = entradaH * 60 + entradaM;
  let saidaMinutos = saidaH * 60 + saidaM;

  // Lidar com overnight (ex: 23:00 → 07:00)
  if (saidaMinutos < entradaMinutos) {
    saidaMinutos += 24 * 60;
  }

  return (saidaMinutos - entradaMinutos) / 60;
}

export function calcularValorSobreaviso(horas: number, tipo: TipoRegistro): number {
  switch (tipo) {
    case 'sobreaviso_acionado':
      return horas; // 1x
    case 'sobreaviso_nao_acionado':
      return horas * 0.33; // 1/3
    default:
      return horas;
  }
}

export function calcularResumoMensal(registros: Registro[]): {
  horasTrabalho: number;
  horasSobreavisoAcionado: number;
  horasSobreavisoNaoAcionado: number;
  valorTotal: number;
} {
  // Implementação obrigatória com validação de edge cases
}
```

### Validações de Negócio

```typescript
export function validarSobreposicaoHorarios(
  novoRegistro: Registro,
  registrosExistentes: Registro[]
): boolean {
  // Verificar se há sobreposição com registros existentes na mesma data
  // Retornar true se há sobreposição (inválido)
}

export function validarLimiteDiario(registros: Registro[], novoRegistro: Registro): boolean {
  // Verificar se não ultrapassa 24h por dia
  // Considerar registros overnight
}
```

## FUNCIONALIDADES ESPECÍFICAS

### Sistema de Registro Rápido

```typescript
// Hook para registro com 1 clique
export function useRegistroRapido() {
  const [status, setStatus] = useState<'livre' | 'trabalhando' | 'sobreaviso'>('livre');

  const registrarEntrada = async (tipo: TipoRegistro = 'trabalho') => {
    const agora = new Date();
    const registro = {
      data: format(agora, 'yyyy-MM-dd'),
      horaEntrada: format(agora, 'HH:mm'),
      horaSaida: '', // será preenchido na saída
      tipo,
      observacoes: ''
    };

    // Otimistic update
    setStatus('trabalhando');

    try {
      await salvarRegistro(registro);
      // Feedback háptico
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
    } catch (error) {
      setStatus('livre');
      throw error;
    }
  };

  const registrarSaida = async () => {
    // Implementação similar
  };

  return { status, registrarEntrada, registrarSaida };
}
```

### Dashboard Interativo

```typescript
// Componente de resumo mensal
export function ResumoMensal({ usuarioId, mes }: Props) {
  const { data: registros } = useQuery({
    queryKey: ['registros', usuarioId, mes],
    queryFn: () => buscarRegistrosMes(usuarioId, mes)
  });

  const { data: plano } = useQuery({
    queryKey: ['plano', usuarioId],
    queryFn: () => buscarPlanoAtivo(usuarioId)
  });

  const resumo = useMemo(() => {
    if (!registros || !plano) return null;

    const horasRealizadas = calcularResumoMensal(registros);
    const horasPlano = calcularHorasPlano(plano, mes);

    return {
      ...horasRealizadas,
      diferenca: horasRealizadas.valorTotal - horasPlano.valorTotal,
      percentualCumprimento: (horasRealizadas.valorTotal / horasPlano.valorTotal) * 100
    };
  }, [registros, plano, mes]);

  // Render com cards informativos e gráficos
}
```

### Sistema de Exportação

```typescript
export function useExportacao() {
  const exportarCSV = async (dados: Registro[], nomeArquivo: string) => {
    const csv = Papa.unparse(
      dados.map((registro) => ({
        Data: registro.data,
        'Hora Entrada': registro.horaEntrada,
        'Hora Saída': registro.horaSaida,
        Tipo: registro.tipo,
        Duração: calcularHorasTrabalho(registro.horaEntrada, registro.horaSaida),
        Observações: registro.observacoes || ''
      }))
    );

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${nomeArquivo}.csv`;
    link.click();
  };

  return { exportarCSV };
}
```

## REQUISITOS DE PERFORMANCE E QUALIDADE

### Métricas Obrigatórias

- **Lighthouse Score**: ≥ 90 em todas as categorias
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1

### Otimizações Obrigatórias

```typescript
// Lazy loading de páginas
const RelatoriosPage = lazy(() => import('./pages/relatorios'));
const EquipePage = lazy(() => import('./pages/equipe'));

// Service Worker para cache
// PWA com offline support básico
// Compressão de imagens automática
// Code splitting por rota
```

### Error Handling Obrigatório

```typescript
export function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    console.error(`Erro em ${context}:`, error);

    // Log para Firebase Analytics
    analytics.logEvent('error_occurred', {
      error_message: error.message,
      error_context: context
    });

    // Toast de erro para usuário
    toast.error('Ocorreu um erro. Tente novamente.');

    return null;
  }
}
```

## SEGURANÇA E CONTROLE DE ACESSO

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/editar apenas próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Registros: médico vê próprios, admin da equipe vê todos da equipe
    match /registros/{registroId} {
      allow read, write: if request.auth != null &&
        (resource.data.usuarioId == request.auth.uid ||
         isAdminOfTeam(request.auth.uid, resource.data.equipeId));
    }

    // Função helper
    function isAdminOfTeam(userId, equipeId) {
      return exists(/databases/$(database)/documents/equipes/$(equipeId)) &&
             get(/databases/$(database)/documents/equipes/$(equipeId)).data.adminId == userId;
    }
  }
}
```

### Middleware de Autenticação

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas protegidas
  const protectedRoutes = ['/dashboard', '/registros', '/planos', '/equipe', '/relatorios'];

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Verificar token de autenticação
    const token = request.cookies.get('auth-token');

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
```

## TESTES OBRIGATÓRIOS

### Casos de Teste Críticos

```typescript
// Testes unitários obrigatórios
describe('Cálculos de Horas', () => {
  test('deve calcular horas normais', () => {
    expect(calcularHorasTrabalho('08:00', '17:00')).toBe(9);
  });

  test('deve lidar com overnight', () => {
    expect(calcularHorasTrabalho('23:00', '07:00')).toBe(8);
  });

  test('deve calcular sobreaviso corretamente', () => {
    expect(calcularValorSobreaviso(6, 'sobreaviso_nao_acionado')).toBeCloseTo(2);
  });
});

// Testes E2E obrigatórios
test('fluxo completo de registro', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('[data-testid="btn-entrada"]');
  await expect(page.locator('[data-testid="status"]')).toContainText('Trabalhando');

  // Simular passagem de tempo
  await page.evaluate(() => {
    /* mock time */
  });

  await page.click('[data-testid="btn-saida"]');
  await expect(page.locator('[data-testid="status"]')).toContainText('Livre');
});
```

## INSTRUÇÕES DE IMPLEMENTAÇÃO

### Fase 1: Setup e Autenticação

1. **Configurar projeto Next.js 14** com todas as dependências listadas
2. **Configurar Firebase** (Auth, Firestore, Hosting)
3. **Implementar sistema de autenticação** com persistência
4. **Criar middleware de proteção** de rotas
5. **Implementar estrutura de pastas** exatamente como especificado

### Fase 2: Core Features

1. **Implementar modelos de dados** Firestore com validações Zod
2. **Criar componentes de UI base** seguindo design system
3. **Implementar CRUD de registros** com validações de negócio
4. **Criar sistema de registro rápido** com botões 1-clique
5. **Implementar cálculos de horas** com todos os edge cases

### Fase 3: Dashboard e UX

1. **Criar dashboard interativo** com gráficos Recharts
2. **Implementar sistema de planos** e templates
3. **Adicionar funcionalidade de exportação** CSV
4. **Implementar navegação mobile** com bottom tabs
5. **Adicionar feedback visual** e micro-interações

### Fase 4: Qualidade e Deploy

1. **Implementar PWA** com service worker
2. **Adicionar error handling** robusto
3. **Otimizar performance** (lazy loading, code splitting)
4. **Configurar Firestore security rules**
5. **Deploy no Firebase Hosting**

## CRITÉRIOS DE SUCESSO

### Funcionalidade

- [ ] Registro de entrada/saída em < 3 segundos
- [ ] Cálculos de sobreaviso 100% precisos
- [ ] Dashboard carrega em < 2 segundos
- [ ] Exportação CSV funcional
- [ ] Controle de acesso por role funcionando

### Performance

- [ ] Lighthouse score ≥ 90 em todas as categorias
- [ ] Funciona offline para operações básicas
- [ ] Responsivo em todos os dispositivos mobile
- [ ] Sem layout shifts perceptíveis

### Qualidade

- [ ] Zero bugs críticos
- [ ] Cobertura de testes ≥ 80%
- [ ] Validações de entrada robustas
- [ ] Error handling gracioso
- [ ] Acessibilidade WCAG 2.1 AA

**IMPORTANTE**: Este é um sistema crítico onde precisão dos dados é fundamental. Implemente todas as validações, trate todos os edge cases e garanta que os cálculos estejam sempre corretos. A experiência mobile deve ser fluida e intuitiva, priorizando velocidade de uso sobre funcionalidades avançadas.
