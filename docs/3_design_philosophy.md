# Filosofia de Design e UX: Sistema de Controle de Horários Médicos

## Princípios Fundamentais

### 1. Mobile-First & Friction-Free

**Filosofia**: "Cada segundo economizado no registro aumenta a probabilidade de uso consistente"

**Implementação**:

- Interface otimizada para uso com uma mão
- Botões de ação principais com no mínimo 44px de altura
- Navegação por gestos (swipe) quando apropriada
- Feedback háptico para confirmações importantes

### 2. Registro com "1-Clique"

**Filosofia**: "A ação mais comum deve ser a mais simples"

**Funcionalidades**:

- Botões "Entrar" e "Sair" sempre visíveis na tela principal
- Preenchimento automático de data/hora
- Detecção de padrões para sugerir tipo de registro
- Estados visuais claros (trabalhando/livre/sobreaviso)

### 3. Inteligência Contextual

**Filosofia**: "O sistema deve aprender e antecipar necessidades do usuário"

**Comportamentos**:

- Sugestão automática de tipo de registro baseado em histórico
- Lembretes para registrar saída quando entrada foi feita há muito tempo
- Preenchimento de horários baseado em padrões semanais
- Detecção de inconsistências em tempo real

## Design System

### Paleta de Cores

**Cores Primárias**:

```css
:root {
  --primary-50: #eff6ff; /* Azul muito claro */
  --primary-500: #3b82f6; /* Azul principal - confiança médica */
  --primary-600: #2563eb; /* Azul escuro - ações */
  --primary-900: #1e3a8a; /* Azul muito escuro - texto */
}
```

**Cores Semânticas**:

```css
:root {
  --success-500: #10b981; /* Verde - registro confirmado */
  --warning-500: #f59e0b; /* Amarelo - atenção/sobreaviso */
  --error-500: #ef4444; /* Vermelho - erro/urgente */
  --info-500: #6366f1; /* Roxo - informações */
}
```

**Cores por Tipo de Registro**:

```css
:root {
  --trabalho: #3b82f6; /* Azul - trabalho regular */
  --sobreaviso-acionado: #f59e0b; /* Laranja - sobreaviso ativo */
  --sobreaviso-nao-acionado: #8b5cf6; /* Roxo - sobreaviso passivo */
}
```

### Tipografia

**Hierarquia Responsiva**:

```css
/* Mobile First */
.text-xs {
  font-size: 12px;
  line-height: 16px;
} /* Labels pequenos */
.text-sm {
  font-size: 14px;
  line-height: 20px;
} /* Texto corpo */
.text-base {
  font-size: 16px;
  line-height: 24px;
} /* Texto principal */
.text-lg {
  font-size: 18px;
  line-height: 28px;
} /* Subtítulos */
.text-xl {
  font-size: 20px;
  line-height: 28px;
} /* Títulos seção */
.text-2xl {
  font-size: 24px;
  line-height: 32px;
} /* Títulos página */
.text-3xl {
  font-size: 30px;
  line-height: 36px;
} /* Títulos principais */

/* Pesos */
.font-normal {
  font-weight: 400;
} /* Texto padrão */
.font-medium {
  font-weight: 500;
} /* Destaque sutil */
.font-semibold {
  font-weight: 600;
} /* Títulos */
.font-bold {
  font-weight: 700;
} /* Ênfase forte */
```

### Espaçamento e Layout

**Grid Mobile**:

```css
.container {
  max-width: 100%;
  padding: 0 16px; /* Espaçamento lateral padrão */
  margin: 0 auto;
}

/* Espaçamentos baseados em múltiplos de 8px */
.space-xs {
  margin: 4px;
} /* 0.5rem */
.space-sm {
  margin: 8px;
} /* 1rem */
.space-md {
  margin: 16px;
} /* 2rem */
.space-lg {
  margin: 24px;
} /* 3rem */
.space-xl {
  margin: 32px;
} /* 4rem */
```

**Safe Areas (iOS)**:

```css
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
```

## Componentes de Interface

### 1. Botões de Ação Rápida

**Registro de Entrada/Saída**:

```typescript
// Especificação do componente
interface QuickActionButtonProps {
  type: 'entrada' | 'saida';
  isActive: boolean;
  currentStatus: 'livre' | 'trabalhando' | 'sobreaviso';
  onPress: () => void;
}

// Estados visuais:
// - Livre: Botão "Entrar" verde, botão "Sair" desabilitado
// - Trabalhando: Botão "Entrar" desabilitado, botão "Sair" vermelho pulsante
// - Sobreaviso: Botões com cor laranja, indicador visual especial
```

**Características**:

- Altura mínima: 56px (touch target iOS/Android)
- Feedback háptico ao pressionar
- Animação de loading durante salvamento
- Confirmação visual com checkmark temporário

### 2. Cards de Registro

**Card Individual**:

```typescript
interface RegistroCardProps {
  registro: {
    data: string;
    horaEntrada: string;
    horaSaida: string;
    tipo: TipoRegistro;
    duracaoCalculada: string;
    observacoes?: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}
```

**Layout do Card**:

```
┌─────────────────────────────────────┐
│ 📅 Seg, 15 Jan    [🗑️] [✏️]         │
│                                     │
│ 🕐 08:00 → 17:00  (9h)             │
│ 💼 Trabalho Regular                 │
│ 📝 Plantão cardiologia             │
└─────────────────────────────────────┘
```

### 3. Formulários Inteligentes

**Form de Registro Rápido**:

```typescript
interface RegistroFormProps {
  defaultValues?: Partial<RegistroData>;
  onSubmit: (data: RegistroData) => void;
  showAdvanced?: boolean;
}

// Features:
// - Auto-complete de horários baseado em histórico
// - Validação em tempo real
// - Sugestões contextuais
// - Botão de "Registrar Agora" com timestamp atual
```

**Validações em Tempo Real**:

- Hora de saída não pode ser anterior à entrada
- Não permitir sobreposição de horários
- Alertar se duração for muito longa/curta
- Sugerir tipo de registro baseado em padrões

### 4. Dashboard e Visualizações

**Cards de Resumo**:

```
┌─────────────────┐ ┌─────────────────┐
│ Horas no Mês    │ │ Meta Mensal     │
│                 │ │                 │
│      156h       │ │      160h       │
│  ↗️ +12h semana  │ │  🎯 -4h faltam  │
└─────────────────┘ └─────────────────┘

┌─────────────────┐ ┌─────────────────┐
│ Sobreaviso      │ │ Produtividade   │
│                 │ │                 │
│  24h (8h acion.) │ │      97%        │
│  💰 +R$ 800     │ │  📈 +2% mês     │
└─────────────────┘ └─────────────────┘
```

**Gráficos Responsivos**:

- Gráfico de barras: horas por dia da semana
- Linha temporal: evolução mensal
- Pizza: distribuição de tipos de registro
- Heatmap: intensidade de trabalho por dia

## Padrões de Interação

### Navegação Principal

**Bottom Tab Navigation**:

```
┌─────────────────────────────────────┐
│                                     │
│           Conteúdo Principal        │
│                                     │
│                                     │
└─────────────────────────────────────┘
┌─────┬─────┬─────┬─────┬─────────────┐
│ 🏠  │ ⏰  │ 📊  │ 👥  │ ⚙️          │
│Home │Reg. │Dash │Team │Config       │
└─────┴─────┴─────┴─────┴─────────────┘
```

**Hierarquia de Navegação**:

- Home: Ações rápidas + resumo do dia
- Registros: Lista, adicionar, editar
- Dashboard: Gráficos e relatórios
- Equipe: Visão da equipe (só admins)
- Configurações: Perfil, planos, exportar

### Gestos e Ações

**Swipe Actions nos Cards**:

- Swipe right: Editar registro
- Swipe left: Deletar registro
- Long press: Menu contextual
- Pull-to-refresh: Atualizar dados

**Estados de Loading**:

```typescript
// Estados da aplicação
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Feedback visual por estado:
// - idle: Interface normal
// - loading: Skeleton screens + spinners
// - success: Feedback positivo temporário
// - error: Mensagem de erro + retry
```

## Acessibilidade

### WCAG 2.1 AA Compliance

**Contraste**:

- Texto principal: mínimo 4.5:1
- Texto grande: mínimo 3:1
- Elementos interativos: mínimo 3:1

**Touch Targets**:

- Tamanho mínimo: 44x44px
- Espaçamento entre targets: 8px
- Área de toque maior que elemento visual

**Screen Readers**:

```typescript
// Exemplo de implementação
<button
  aria-label="Registrar entrada às 08:00"
  aria-describedby="status-trabalho"
  role="button"
>
  Entrar
</button>
```

**Navegação por Teclado**:

- Tab order lógico
- Focus visível
- Escape para fechar modais
- Enter/Space para ações

## Responsividade

### Breakpoints

```css
/* Mobile First */
@media (min-width: 640px) {
  /* sm - telefones grandes */
}
@media (min-width: 768px) {
  /* md - tablets portrait */
}
@media (min-width: 1024px) {
  /* lg - tablets landscape */
}
@media (min-width: 1280px) {
  /* xl - desktop pequeno */
}
```

### Adaptações por Tamanho

**Mobile (< 640px)**:

- Navegação bottom tabs
- Cards full-width
- Formulários em coluna única
- Botões de ação grandes

**Tablet (640px - 1024px)**:

- Navegação sidebar + bottom tabs
- Cards em grid 2 colunas
- Formulários em 2 colunas
- Modais como overlays

**Desktop (> 1024px)**:

- Navegação sidebar fixa
- Layout em 3 colunas
- Formulários inline
- Tooltips em hover

## Micro-interações

### Feedback Visual

**Confirmações**:

```typescript
// Após registro bem-sucedido
showToast({
  type: 'success',
  message: 'Entrada registrada às 08:00',
  duration: 3000,
  icon: '✅'
});
```

**Transições**:

```css
/* Transições suaves entre estados */
.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animações de entrada */
@keyframes slideIn {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

**Estados de Carregamento**:

- Skeleton screens para listas
- Shimmer effect para cards
- Progress bars para uploads
- Spinners para ações pontuais

### Animações Contextuais

**Entrada/Saída do Aplicativo**:

```css
/* Animação de splash screen */
@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Transição entre páginas */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
```

**Feedback de Ações**:

- Botão pressionado: scale(0.95) + haptic feedback
- Card adicionado: slide in from bottom
- Item deletado: slide out + fade
- Atualização de dados: pulse no ícone de status

## Dark Mode e Temas

### Suporte a Tema Escuro

**Variáveis CSS**:

```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
}

[data-theme='dark'] {
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
}
```

**Implementação Automática**:

```typescript
// Detectar preferência do sistema
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Persistir escolha do usuário
const [theme, setTheme] = useLocalStorage('theme', 'system');
```

## Performance UX

### Otimizações Percebidas

**Carregamento Progressivo**:

1. Mostrar estrutura (skeleton) imediatamente
2. Carregar dados críticos primeiro
3. Carregar dados secundários em background
4. Cache agressivo para dados frequentes

**Feedback Imediato**:

```typescript
// Otimistic Updates
const handleRegistrarEntrada = async () => {
  // 1. Atualizar UI imediatamente
  setStatus('trabalhando');

  // 2. Salvar no background
  try {
    await salvarRegistro(novoRegistro);
  } catch (error) {
    // 3. Reverter se falhar
    setStatus('livre');
    showError('Falha ao registrar entrada');
  }
};
```

### Métricas de Performance UX

**Targets**:

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

## Padrões de Erro e Estados Vazios

### Tratamento de Erros

**Hierarquia de Erros**:

```typescript
interface ErrorState {
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  action?: {
    label: string;
    handler: () => void;
  };
  dismissible: boolean;
}

// Exemplos:
// - info: "Dados sincronizados"
// - warning: "Conexão instável"
// - error: "Falha ao salvar registro"
// - critical: "Erro de autenticação"
```

**Recovery Actions**:

- Retry automático para falhas de rede
- Offline mode com sincronização posterior
- Backup local para dados críticos
- Botões de "Tentar novamente" sempre visíveis

### Estados Vazios

**Empty States Contextuais**:

```typescript
// Primeiro uso
<EmptyState
  icon="📝"
  title="Bem-vindo!"
  description="Registre seu primeiro horário para começar"
  action={{
    label: "Fazer primeiro registro",
    handler: () => navigation.navigate('NovoRegistro')
  }}
/>

// Sem dados do mês
<EmptyState
  icon="📅"
  title="Nenhum registro este mês"
  description="Seus registros aparecerão aqui quando você começar a trabalhar"
  action={{
    label: "Registrar agora",
    handler: () => handleRegistroRapido()
  }}
/>
```

## Internacionalização (i18n)

### Preparação para Múltiplos Idiomas

**Estrutura de Textos**:

```typescript
// pt-BR (padrão)
export const messages = {
  common: {
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar'
  },
  registro: {
    entrada: 'Entrada',
    saida: 'Saída',
    trabalho: 'Trabalho',
    sobreaviso_acionado: 'Sobreaviso Acionado',
    sobreaviso_nao_acionado: 'Sobreaviso Não Acionado'
  }
};
```

**Formatação Regional**:

```typescript
// Datas e horários
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

// Números e moeda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
```
