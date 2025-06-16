# 0001 – Visão Geral da Arquitetura

_Status: Aprovada – 2025-06-16_

## Contexto

Precisamos de uma stack moderna e serverless que permita:

1. Escalar automaticamente sem DevOps pesado.
2. Autenticação segura pronta-para-uso.
3. Baixa latência para usuários mobile distribuídos.

## Decisão

Adotamos **Next.js 14** no Frontend e **Firebase** (Auth, Firestore, Storage, Functions, Hosting) no Backend.

Motivos principais:

- SSR/ISR opcional no Next para SEO e performance.
- Firebase Auth reduz complexidade de login.
- Firestore tempo-real e regras declarativas.
- Functions em TypeScript compartilham modelos com o Front.
- Hosting CDN global sem configuração.

## Consequências

- Desenvolvimento full-stack em TypeScript.
- Vendor lock-in moderado ao Firebase, mitigado pela simplicidade MVP.
- Necessidade de boas regras de segurança (tratadas nas tarefas T3.2.6 e testes T5.5).
