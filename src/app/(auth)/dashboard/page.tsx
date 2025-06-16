'use client';

import React, { Suspense } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../../components/ui/button';
import Link from 'next/link';
import { Award, CalendarDays, Clock, List } from 'lucide-react';
import HoursChart from '../../../components/dashboard/HoursChart';

// --- Card Components ---

function BentoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-3">{children}</div>;
}

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`bg-card flex flex-col justify-between rounded-lg border p-4 ${className}`}>
      {children}
    </div>
  );
}

function WelcomeCard({ name }: { name: string }) {
  return (
    <Card className="md:col-span-2">
      <div>
        <h2 className="text-2xl font-bold">Bem-vindo, {name}!</h2>
        <p className="text-muted-foreground">Pronto para começar o dia?</p>
      </div>
      <div className="mt-4 flex gap-2">
        <Button>Registrar Ponto</Button>
        <Button variant="secondary">Ver Relatório</Button>
      </div>
    </Card>
  );
}

function QuickStatsCard() {
  // Mock data - to be replaced with real data hooks
  return (
    <Card>
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        <Award className="size-5" /> Resumo Rápido
      </h3>
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-2">
            <CalendarDays className="size-4" />
            <span>Horas/Mês</span>
          </div>
          <span className="text-accent-foreground font-semibold">120/160h</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-2">
            <Clock className="size-4" />
            <span>Sobreaviso</span>
          </div>
          <span className="text-accent-foreground font-semibold">32h</span>
        </div>
      </div>
    </Card>
  );
}

function RecentActivityCard() {
  // Mock data
  return (
    <Card className="md:col-span-3">
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        <List className="size-5" />
        Atividade Recente
      </h3>
      <div className="mt-2">
        <HoursChart />
      </div>
      <Link href="/auth/registros" className="text-primary mt-4 self-end text-sm hover:underline">
        Ver todos
      </Link>
    </Card>
  );
}

// --- Main Dashboard Page ---

export default function DashboardPage() {
  const { user } = useAuth();
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Doutor(a)';

  return (
    <section>
      <Suspense fallback={<p>Carregando...</p>}>
        <BentoGrid>
          <WelcomeCard name={userName} />
          <QuickStatsCard />
          <RecentActivityCard />
        </BentoGrid>
      </Suspense>
    </section>
  );
}
