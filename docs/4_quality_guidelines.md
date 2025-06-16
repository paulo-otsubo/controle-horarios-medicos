# Diretrizes de Qualidade e Testes: Sistema de Controle de Horários Médicos

## Estratégia de Testes

### Pirâmide de Testes

**70% - Testes Unitários**

- Funções utilitárias (cálculos de horas, validações)
- Hooks customizados
- Stores Zustand
- Componentes isolados

**20% - Testes de Integração**

- Fluxos de autenticação
- Operações CRUD completas
- Integração com Firebase
- Interações entre componentes

**10% - Testes E2E**

- Fluxos críticos de usuário
- Cenários de registro completo
- Validação cross-browser mobile

### Ferramentas de Teste

**Framework Principal**: Vitest + Testing Library

```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "msw": "^2.0.0",
    "playwright": "^1.40.0"
  }
}
```

**Configuração do Vitest**:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        global: {
          statements: 80,
          branches: 75,
          functions: 80,
          lines: 80
        }
      }
    }
  }
});
```

## Testes Unitários

### Funções de Cálculo de Horas

**Testes Obrigatórios**:

```typescript
// src/lib/calculations.test.ts
import { calcularHorasTrabalho, calcularValorSobreaviso } from './calculations';

describe('Cálculos de Horas', () => {
  describe('calcularHorasTrabalho', () => {
    test('deve calcular horas normais corretamente', () => {
      const resultado = calcularHorasTrabalho('08:00', '17:00');
      expect(resultado).toBe(9);
    });

    test('deve lidar com horários overnight', () => {
      const resultado = calcularHorasTrabalho('23:00', '07:00');
      expect(resultado).toBe(8);
    });

    test('deve rejeitar horário de saída anterior à entrada', () => {
      expect(() => {
        calcularHorasTrabalho('17:00', '08:00');
      }).toThrow('Horário de saída não pode ser anterior à entrada');
    });
  });

  describe('calcularValorSobreaviso', () => {
    test('sobreaviso acionado deve valer 1x', () => {
      const valor = calcularValorSobreaviso(8, 'sobreaviso_acionado');
      expect(valor).toBe(8);
    });

    test('sobreaviso não acionado deve valer 0.33x', () => {
      const valor = calcularValorSobreaviso(9, 'sobreaviso_nao_acionado');
      expect(valor).toBeCloseTo(3);
    });
  });
});
```

### Validações com Zod

**Testes de Schema**:

```typescript
// src/lib/validations.test.ts
import { RegistroSchema } from './validations';

describe('Validações de Registro', () => {
  test('deve aceitar registro válido', () => {
    const dadosValidos = {
      data: '2024-01-15',
      horaEntrada: '08:00',
      horaSaida: '17:00',
      tipo: 'trabalho'
    };

    const resultado = RegistroSchema.safeParse(dadosValidos);
    expect(resultado.success).toBe(true);
  });

  test('deve rejeitar formato de data inválido', () => {
    const dadosInvalidos = {
      data: '15/01/2024', // formato incorreto
      horaEntrada: '08:00',
      horaSaida: '17:00',
      tipo: 'trabalho'
    };

    const resultado = RegistroSchema.safeParse(dadosInvalidos);
    expect(resultado.success).toBe(false);
    expect(resultado.error?.issues[0].path).toContain('data');
  });

  test('deve rejeitar tipo de registro inválido', () => {
    const dadosInvalidos = {
      data: '2024-01-15',
      horaEntrada: '08:00',
      horaSaida: '17:00',
      tipo: 'tipo_inexistente'
    };

    const resultado = RegistroSchema.safeParse(dadosInvalidos);
    expect(resultado.success).toBe(false);
  });
});
```

### Hooks Customizados

**Teste do useAuth**:

```typescript
// src/hooks/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';

// Mock Firebase
vi.mock('../lib/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn()
  }
}));

describe('useAuth', () => {
  test('deve iniciar com usuário null', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  test('deve fazer login corretamente', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@email.com', 'password');
    });

    expect(result.current.user).toBeTruthy();
    expect(result.current.loading).toBe(false);
  });
});
```

## Testes de Integração

### Operações CRUD com Firebase

**Setup de Mocks**:

```typescript
// src/test/firebase-mocks.ts
import { vi } from 'vitest';

export const mockFirestore = {
  collection: vi.fn(() => ({
    doc: vi.fn(() => ({
      set: vi.fn(),
      get: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    })),
    add: vi.fn(),
    where: vi.fn(() => ({
      get: vi.fn()
    }))
  }))
};
```

**Teste de Registro de Horários**:

```typescript
// src/services/registros.integration.test.ts
import { criarRegistro, buscarRegistros } from './registros';

describe('Integração - Registros', () => {
  beforeEach(() => {
    // Limpar mocks
    vi.clearAllMocks();
  });

  test('deve criar e recuperar registro', async () => {
    const novoRegistro = {
      data: '2024-01-15',
      horaEntrada: '08:00',
      horaSaida: '17:00',
      tipo: 'trabalho' as const
    };

    // Criar registro
    const registroId = await criarRegistro(novoRegistro);
    expect(registroId).toBeTruthy();

    // Buscar registros
    const registros = await buscarRegistros('user123', '2024-01');
    expect(registros).toHaveLength(1);
    expect(registros[0]).toMatchObject(novoRegistro);
  });

  test('deve validar sobreposição de horários', async () => {
    // Primeiro registro
    await criarRegistro({
      data: '2024-01-15',
      horaEntrada: '08:00',
      horaSaida: '17:00',
      tipo: 'trabalho'
    });

    // Tentativa de sobreposição
    await expect(
      criarRegistro({
        data: '2024-01-15',
        horaEntrada: '16:00',
        horaSaida: '20:00',
        tipo: 'trabalho'
      })
    ).rejects.toThrow('Sobreposição de horários detectada');
  });
});
```

### Fluxo de Autenticação

**Teste Completo de Login**:

```typescript
// src/components/Login.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('Integração - Login', () => {
  test('deve fazer login com credenciais válidas', async () => {
    const user = userEvent.setup();
    const mockOnSuccess = vi.fn();

    render(<LoginForm onSuccess={mockOnSuccess} />);

    // Preencher formulário
    await user.type(screen.getByLabelText(/email/i), 'test@email.com');
    await user.type(screen.getByLabelText(/senha/i), 'password123');

    // Submeter
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    // Verificar sucesso
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  test('deve mostrar erro para credenciais inválidas', async () => {
    const user = userEvent.setup();

    render(<LoginForm onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText(/email/i), 'invalid@email.com');
    await user.type(screen.getByLabelText(/senha/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
  });
});
```

## Testes End-to-End (E2E)

### Configuração do Playwright

**playwright.config.ts**:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'Mobile Chrome',
      use: { ...devices['iPhone 12'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12 Safari'] }
    },
    {
      name: 'Android',
      use: { ...devices['Pixel 5'] }
    }
  ]
});
```

### Fluxos Críticos

**Teste: Fluxo Completo de Registro**:

```typescript
// e2e/registro-fluxo.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Fluxo de Registro de Horários', () => {
  test.beforeEach(async ({ page }) => {
    // Login automático
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'medico@teste.com');
    await page.fill('[data-testid="senha"]', 'password123');
    await page.click('[data-testid="btn-login"]');
    await page.waitForURL('/dashboard');
  });

  test('deve registrar entrada e saída com sucesso', async ({ page }) => {
    // Registrar entrada
    await page.click('[data-testid="btn-entrada"]');
    await expect(page.locator('[data-testid="status"]')).toContainText('Trabalhando');

    // Verificar que botão saída está ativo
    await expect(page.locator('[data-testid="btn-saida"]')).toBeEnabled();
    await expect(page.locator('[data-testid="btn-entrada"]')).toBeDisabled();

    // Simular passagem de tempo (para teste)
    await page.evaluate(() => {
      // Mock da data para simular 8 horas depois
      const now = new Date();
      now.setHours(now.getHours() + 8);
      vi.setSystemTime(now);
    });

    // Registrar saída
    await page.click('[data-testid="btn-saida"]');
    await expect(page.locator('[data-testid="status"]')).toContainText('Livre');

    // Verificar registro na lista
    await page.click('[data-testid="tab-registros"]');
    await expect(page.locator('[data-testid="registro-item"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="duracao"]').first()).toContainText('8h');
  });

  test('deve calcular sobreaviso corretamente', async ({ page }) => {
    // Navegar para novo registro
    await page.click('[data-testid="btn-novo-registro"]');

    // Preencher dados de sobreaviso
    await page.fill('[data-testid="data"]', '2024-01-15');
    await page.fill('[data-testid="hora-entrada"]', '20:00');
    await page.fill('[data-testid="hora-saida"]', '08:00');
    await page.selectOption('[data-testid="tipo"]', 'sobreaviso_acionado');

    // Salvar
    await page.click('[data-testid="btn-salvar"]');

    // Verificar cálculo
    await page.goto('/dashboard');
    const horasSobreaviso = page.locator('[data-testid="horas-sobreaviso"]');
    await expect(horasSobreaviso).toContainText('12h'); // 12 horas de sobreaviso

    const valorCalculado = page.locator('[data-testid="valor-sobreaviso"]');
    await expect(valorCalculado).toContainText('12h'); // Acionado = 1x
  });
});
```

**Teste: Responsividade Mobile**:

```typescript
// e2e/mobile-responsivo.spec.ts
test.describe('Responsividade Mobile', () => {
  test('deve adaptar interface para diferentes resoluções', async ({ page }) => {
    // Testar iPhone SE (small)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');

    // Verificar que navegação é bottom tabs
    await expect(page.locator('[data-testid="bottom-navigation"]')).toBeVisible();
    await expect(page.locator('[data-testid="sidebar"]')).not.toBeVisible();

    // Testar iPad (medium)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();

    // Verificar adaptação para tablet
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();

    // Testar gestos de swipe
    const registro = page.locator('[data-testid="registro-item"]').first();
    await registro.hover();

    // Swipe right para editar
    await registro.dragTo(registro, {
      sourcePosition: { x: 10, y: 50 },
      targetPosition: { x: 100, y: 50 }
    });

    await expect(page.locator('[data-testid="btn-editar"]')).toBeVisible();
  });
});
```

## Casos Extremos (Edge Cases)

### Cenários de Validação

**Lista de Edge Cases Obrigatórios**:

```typescript
// src/test/edge-cases.test.ts
describe('Edge Cases - Validações', () => {
  describe('Horários Extremos', () => {
    test('deve lidar com horário 00:00', () => {
      expect(() => calcularHoras('00:00', '08:00')).not.toThrow();
    });

    test('deve lidar com horário 23:59', () => {
      expect(() => calcularHoras('16:00', '23:59')).not.toThrow();
    });

    test('deve lidar com plantão de 24h', () => {
      const horas = calcularHoras('08:00', '08:00'); // próximo dia
      expect(horas).toBe(24);
    });
  });

  describe('Mudanças de Fuso Horário', () => {
    test('deve manter consistência em horário de verão', () => {
      // Testar transição de horário de verão
      const entrada = new Date('2024-10-20T08:00:00-03:00');
      const saida = new Date('2024-10-21T08:00:00-02:00'); // mudança de fuso

      const horas = calcularHorasComFuso(entrada, saida);
      expect(horas).toBe(23); // 1 hora a menos devido ao horário de verão
    });
  });

  describe('Dados Corrompidos', () => {
    test('deve lidar com dados incompletos', () => {
      const registroIncompleto = {
        data: '2024-01-15',
        horaEntrada: '08:00'
        // horaSaida missing
      };

      expect(() => processarRegistro(registroIncompleto)).toThrow();
    });

    test('deve sanitizar inputs maliciosos', () => {
      const inputMalicioso = {
        data: '<script>alert("xss")</script>',
        horaEntrada: '08:00',
        horaSaida: '17:00',
        tipo: 'trabalho'
      };

      const resultado = sanitizarRegistro(inputMalicioso);
      expect(resultado.data).not.toContain('<script>');
    });
  });
});
```

### Cenários de Rede

**Testes de Conectividade**:

```typescript
// e2e/network-scenarios.spec.ts
test.describe('Cenários de Rede', () => {
  test('deve funcionar offline', async ({ page, context }) => {
    // Ir online primeiro
    await page.goto('/dashboard');

    // Simular offline
    await context.setOffline(true);

    // Tentar registrar entrada
    await page.click('[data-testid="btn-entrada"]');

    // Verificar que foi salvo localmente
    await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible();
    await expect(page.locator('[data-testid="status"]')).toContainText('Trabalhando');

    // Voltar online
    await context.setOffline(false);

    // Verificar sincronização
    await page.waitForSelector('[data-testid="sync-indicator"]');
    await expect(page.locator('[data-testid="offline-indicator"]')).not.toBeVisible();
  });

  test('deve lidar com conexão lenta', async ({ page }) => {
    // Simular 3G lento
    await page.route('**/*', (route) => {
      setTimeout(() => route.continue(), 2000);
    });

    await page.goto('/dashboard');

    // Verificar loading states
    await expect(page.locator('[data-testid="skeleton-loader"]')).toBeVisible();

    // Aguardar carregamento completo
    await page.waitForSelector('[data-testid="dashboard-content"]', {
      timeout: 10000
    });
  });
});
```

## Métricas de Qualidade

### Cobertura de Testes

**Targets Mínimos**:

```typescript
// vitest.config.ts - Thresholds
const coverageThresholds = {
  global: {
    statements: 80,
    branches: 75,
    functions: 80,
    lines: 80
  },
  // Arquivos críticos com cobertura maior
  'src/lib/calculations.ts': {
    statements: 95,
    branches: 90,
    functions: 100,
    lines: 95
  },
  'src/services/registros.ts': {
    statements: 90,
    branches: 85,
    functions: 90,
    lines: 90
  }
};
```

### Performance Testing

**Lighthouse CI**:

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push, pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: './lighthouserc.json'
```

**lighthouserc.json**:

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/dashboard"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.8 }]
      }
    }
  }
}
```

### Monitoramento de Qualidade

**Setup de Monitoring**:

```typescript
// src/lib/monitoring.ts
import { analytics } from './firebase';

export const trackError = (error: Error, context: string) => {
  console.error(`Erro em ${context}:`, error);

  // Enviar para Firebase Analytics
  analytics.logEvent('error_occurred', {
    error_message: error.message,
    error_context: context,
    timestamp: Date.now()
  });
};

export const trackPerformance = (metric: string, value: number) => {
  analytics.logEvent('performance_metric', {
    metric_name: metric,
    metric_value: value,
    timestamp: Date.now()
  });
};
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/quality.yml
name: Quality Checks
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:unit -- --coverage
      - run: npm run test:integration

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npx playwright install
      - run: npm run test:e2e

      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### Definição de "Pronto"

**Checklist de Qualidade**:

- [ ] Todos os testes unitários passando
- [ ] Cobertura de testes ≥ 80%
- [ ] Testes de integração passando
- [ ] Testes E2E dos fluxos críticos passando
- [ ] Lighthouse score ≥ 90 em todas as categorias
- [ ] Zero vulnerabilidades de segurança críticas
- [ ] Código revisado por peer
- [ ] Documentação atualizada
- [ ] Performance testada em dispositivos mobile reais
- [ ] Acessibilidade validada com screen readers

### Regra de Ouro: Proibição do `any`

**O uso do tipo `any` é estritamente proibido neste projeto.**

- **Justificativa:** Usar `any` desliga completamente a verificação de tipos do TypeScript para uma variável, anulando os benefícios de segurança e autocompletar que o TypeScript oferece. Erros de build recentes, como `TypeError: ... is not a function` ou `Property ... does not exist on type`, são frequentemente causados pelo uso implícito ou explícito de `any`, pois ele permite que erros de tipo passem despercebidos durante o desenvolvimento e só apareçam em tempo de execução ou no build.

- **Alternativas:**
  - **`unknown`:** Se você realmente não sabe o tipo de uma variável (ex: vinda de uma API externa), use `unknown`. Ele é seguro, pois força você a fazer uma verificação de tipo (com `typeof`, `instanceof`, ou type guards) antes de poder usá-lo.
  - **Tipos Genéricos (`<T>`):** Para funções e componentes que podem operar com diferentes tipos de dados.
  - **Tipagem Específica:** Sempre que possível, defina interfaces (`interface`) ou tipos (`type`) para os seus dados.

Essa regra não é negociável e é automaticamente verificada pelo nosso linter no processo de build.

## Versionamento

O projeto segue o [Semantic Versioning](https://semver.org/lang/pt-BR/) (MAJOR.MINOR.PATCH).
