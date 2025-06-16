# Guia de Contribuição

Obrigado por contribuir! Segue um roteiro rápido.

## Fluxo de Trabalho

1. **Fork e Branch**
   - Crie branch a partir de `main`.
   - Nomeie `feat/T3.2.1-nova-funcionalidade` ou `fix/bug-descricao`.
2. **Instalação**
   ```bash
   pnpm install
   pnpm dev
   ```
3. **Pré-commit**
   - Os hooks Husky rodam `pnpm lint` e `pnpm format --check`. Corrija antes de commit.
4. **Commits Semânticos**
   - Use Conventional Commits (`feat:`, `fix:`, `chore:`…). O script `npm run release` usa isso.
5. **Testes**
   - Rode `pnpm test` (Vitest) e `pnpm e2e` (Playwright).
6. **Pull Request**
   - Descreva o que mudou, referencie tarefa (ex. closes T3.3.1).
   - O CI executará lint, testes e build.

## Estrutura do Projeto

Veja `docs/2_technical_architecture.md` para detalhes de pastas. Componentes React ficam em `src/components`, hooks em `src/hooks`.

## Padrões de Código

- TypeScript estrito sem `any`.
- Tailwind classes ordenadas (plugin ESLint).
- Funções puras em `lib/` sem side-effects.

## Reportando Bugs

Abra issue com:

- Passos para reproduzir
- Comportamento esperado vs obtido
- Capturas de tela ou logs

Happy coding! 🎉
