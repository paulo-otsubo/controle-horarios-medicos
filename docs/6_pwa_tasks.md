# Roadmap de Tarefas – Transformação para PWA

> Este documento detalha os passos necessários para converter a aplicação em um **Progressive Web App (PWA)**, oferecendo funcionalidades offline, performance aprimorada e a capacidade de ser "instalado" nos dispositivos dos usuários.

## Legenda de Status

- [ ] Não iniciado | [~] Em progresso | [x] Concluído | [!] Bloqueado

---

## Fase 7 Transformação PWA

### 7.1 Manifest & Configuração Inicial

- [x] **T7.1.1 – Gerar e configurar o Web App Manifest**

  - **Objetivo:** Definir a identidade da aplicação (nome, cores, ícones) para que o sistema operacional a reconheça como um app instalável.
  - **Passos Recomendados:**
    1. Preparar um ícone base da aplicação em alta resolução (ex: 512x512 pixels).
    2. Utilizar uma ferramenta como [RealFaviconGenerator](https://realfavicongenerator.net/) para gerar todos os tamanhos de ícones necessários e o arquivo `manifest.json`.
    3. Mover os ícones gerados para a pasta `public/`.
    4. Criar o arquivo `public/manifest.json` e preencher as propriedades essenciais: `name`, `short_name`, `start_url`, `display` (sugestão: `standalone`), `background_color`, `theme_color` e a lista de `icons`.
    5. Adicionar a tag de link para o manifest no `<head>` do arquivo `src/app/layout.tsx`.
  - **Critérios de Aceite:**
    - O DevTools do navegador (Aba `Application` > `Manifest`) exibe o manifesto carregado sem erros.
    - O navegador oferece a opção de "Instalar App" na barra de endereço ou no menu.

### 7.2 Implementação do Service Worker

- [x] **T7.2.1 – Integrar o `next-pwa` para gestão do Service Worker**

  - **Objetivo:** Automatizar a criação, registro e gerenciamento do Service Worker, que é o coração da funcionalidade offline.
  - **Passos Recomendados:**
    1. Instalar a dependência: `npm install next-pwa`.
    2. Importar e envolver a configuração do Next.js em `next.config.mjs` com o wrapper do `next-pwa`.
    3. Configurar as opções básicas do `next-pwa`: `dest: 'public'`, `register: true`, `skipWaiting: true`, e desabilitá-lo em modo de desenvolvimento (`disable: process.env.NODE_ENV === 'development'`).
  - **Critérios de Aceite:**
    - Após um build de produção (`npm run build`), os arquivos `sw.js` e `workbox-*.js` são gerados na pasta `public/`.
    - No DevTools (`Application` > `Service Workers`), um Service Worker aparece como "activated and is running".

- [x] **T7.2.2 – Configurar persistência offline do Firestore**

  - **Objetivo:** Garantir que os dados lidos e escritos no Firestore possam funcionar mesmo sem conexão com a internet.
  - **Passos Recomendados:**
    1. No arquivo `src/lib/firebase.ts`, importar `enableIndexedDbPersistence` do Firestore.
    2. Chamar a função `enableIndexedDbPersistence(db)` antes de qualquer outra interação com o `db`. Adicionar um `try/catch` para lidar com casos onde não é possível habilitar (ex: múltiplas abas abertas).
  - **Critérios de Aceite:**
    - No DevTools (`Application` > `IndexedDB`), um banco de dados do Firestore é visível.
    - Registros criados enquanto offline são adicionados à interface e sincronizados automaticamente quando a rede é restaurada.

### 7.3 Validação e Testes

- [x] **T7.3.1 – Realizar auditoria com Google Lighthouse**

  - **Objetivo:** Validar formalmente que a aplicação atende a todos os critérios técnicos de um PWA otimizado e confiável.
  - **Passos Recomendados:**
    1. Executar a aplicação em modo de produção local (`npm run build` seguido de `npm start`).
    2. No DevTools, abrir a aba `Lighthouse`.
    3. Rodar uma auditoria com a categoria "Progressive Web App" selecionada.
  - **Critérios de Aceite:**
    - A pontuação na categoria PWA do Lighthouse é de 90 ou superior.
    - A aplicação recebe o selo "Installable".

  **Resultados da Auditoria:**

  - ✅ PWA básico funcionando (Service Worker + Manifest detectados)
  - ✅ Aplicação instalável funcionando
  - ⚠️ Performance LCP: 3.1s (Score: 0.76) - Recomendação: <2.5s
  - ❌ Acessibilidade: Problemas de contraste de cores e labels de formulário
  - ✅ Best Practices: Todas aprovadas
  - ✅ Service Worker ativo e funcionando
  - ✅ Cache offline básico implementado

- [ ] **T7.3.2 – Testar a experiência de uso ponta a ponta**

  - **Objetivo:** Garantir que a experiência do usuário final ao instalar e usar o PWA offline seja fluida e intuitiva.
  - **Passos Recomendados:**
    1. Em um desktop, instalar o PWA. Verificar se ele abre em uma janela própria e se o ícone está correto na barra de tarefas ou dock.
    2. Em um dispositivo móvel (Android e/ou iOS), adicionar o app à tela inicial.
    3. Com o app aberto, ativar o modo avião.
    4. Tentar navegar entre as telas já visitadas e criar um novo registro de horário.
    5. Desativar o modo avião e confirmar que o registro criado offline foi sincronizado no Firestore.
  - **Critérios de Aceite:**
    - A instalação funciona corretamente em desktop e mobile.
    - A navegação e a visualização de dados previamente carregados funcionam sem rede.
    - A criação de dados offline é bem-sucedida e sincroniza ao reconectar.
