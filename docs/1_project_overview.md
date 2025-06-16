# Visão Geral do Projeto: Sistema de Controle de Horários Médicos

## Descrição Executiva

Sistema web mobile-first para controle paralelo de horários trabalhados por equipes médicas, permitindo detecção proativa de discrepâncias com sistemas oficiais através de interface otimizada para redução de fricção no registro de dados.

## Objetivos de Negócio

### Objetivo Principal

Fornecer às equipes médicas autonomia e precisão no controle de horários, identificando rapidamente erros que possam impactar remuneração ou compliance.

### Objetivos Secundários

- Reduzir tempo gasto em controle manual de horários
- Criar histórico confiável para comparação com folhas de pagamento
- Facilitar gestão de múltiplas equipes médicas
- Gerar relatórios para tomada de decisão administrativa

## Funcionalidades Principais

### Sistema de Registro de Horários

**Tipos de Registro:**

- **Horas Trabalhadas**: Entrada/saída padrão com timestamp preciso
- **Sobreaviso Acionado**: Período em que o médico foi chamado (valor = 1x hora trabalhada)
- **Sobreaviso Não Acionado**: Período disponível mas não chamado (valor = 0,33x hora trabalhada)

**Campos Obrigatórios por Registro:**

- Data do registro
- Hora de entrada
- Hora de saída
- Tipo de registro (seleção entre os 3 tipos)
- Observações (opcional)

### Sistema de Planejamento

- **Criação de Planos Pessoais**: Cada usuário define seu cronograma esperado
- **Templates Compartilháveis**: Admins podem criar modelos para equipe
- **Comparação Mensal**: Cálculo automático de horas a mais/menos vs planejado

### Dashboard e Relatórios

**Visão do Médico:**

- Resumo mensal de horas trabalhadas vs planejadas
- Gráficos de tendência de trabalho
- Histórico de registros com filtros
- Exportação CSV dos próprios dados

**Visão do Admin de Equipe:**

- Dashboard consolidado da equipe
- Comparação de performance entre membros
- Relatórios gerenciais mensais
- Exportação CSV completa da equipe

### Sistema de Registro Rápido

**Funcionalidade "1-Clique":**

- Botões "Entrar" e "Sair" na tela principal
- Preenchimento automático de data/hora
- Detecção de padrões para sugerir tipo de registro
- Confirmação visual do registro realizado

## Arquitetura de Usuários

### Hierarquia de Acesso

```
Admin Global
├── Gerencia múltiplas equipes (até 20)
├── Cria templates globais
└── Acesso a relatórios consolidados

Admin de Equipe
├── Gerencia uma equipe específica (5-10 médicos)
├── Vê todos os dados da equipe
├── Cria templates de equipe
└── Exporta dados da equipe

Médico
├── Registra próprios horários
├── Vê apenas próprios dados
├── Compara com plano pessoal
└── Exporta próprios dados
```

## Subsistemas e Componentes

### 1. Módulo de Autenticação

- Login persistente com Firebase Auth
- Recuperação de senha
- Gestão de sessões longas

### 2. Módulo de Registro

- Interface mobile otimizada
- Validações em tempo real
- Sincronização automática

### 3. Módulo de Planejamento

- Editor de cronogramas
- Templates e modelos
- Versionamento de planos

### 4. Módulo de Relatórios

- Cálculos automáticos de sobreaviso
- Exportação de dados
- Dashboards interativos

### 5. Módulo Administrativo

- Gestão de equipes
- Controle de permissões
- Logs de auditoria

## Critérios de Sucesso

### Métricas de Adoção

- 90%+ dos médicos registram horários semanalmente
- Tempo médio de registro < 30 segundos
- Taxa de login diário > 70% da equipe ativa

### Métricas de Qualidade

- 99.9% de uptime do sistema
- Dados sincronizados em < 2 segundos
- Zero perda de dados registrados

### Métricas de Valor

- Identificação de discrepâncias em 100% dos casos
- Redução de 80% no tempo gasto com controle manual
- Satisfação do usuário > 4.5/5.0

## Restrições e Limitações

### Técnicas

- Orçamento de infraestrutura próximo a zero
- Dependência de conexão com internet
- Foco exclusivo em dispositivos móveis

### Operacionais

- Máximo 20 equipes simultâneas
- Máximo 10 médicos por equipe
- Retenção de dados por 24 meses

### Regulamentares

- Não armazenamento de dados médicos sensíveis
- Logs simples de auditoria
- Conformidade com LGPD básica
