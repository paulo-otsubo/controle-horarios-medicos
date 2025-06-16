import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redireciona imediatamente para a tela de login
  redirect('/login');
}
