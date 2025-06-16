// Este arquivo permanece como Server Component para viabilizar o build
// estático (output: 'export'). O componente real de edição está em
// `ClientPage`, marcado como 'use client'.

import EditarEquipeClient from './ClientPage';

// Permite que o Next.js conclua o build estático mesmo não havendo rotas
// conhecidas antecipadamente. Ao retornar um array vazio, nenhuma versão
// HTML é pré-gerada e as rotas serão resolvidas apenas no client-side
// (funciona porque o Firebase Hosting já faz rewrite de * para index.html).
export function generateStaticParams() {
  // Gera um parâmetro fictício apenas para satisfazer o verificador do Next
  // em builds estáticos. Outros IDs continuarão funcionando via SPA.
  return [{ id: 'placeholder' }];
}

// Marcação para garantir que o código seja tratado como estático e não gere
// erros de build no modo `export`.
export const dynamic = 'force-static';

export default function Page() {
  return <EditarEquipeClient />;
}
