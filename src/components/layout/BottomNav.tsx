'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChartBarSquareIcon,
  HomeIcon,
  RectangleStackIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import {
  ChartBarSquareIcon as ChartBarSquareSolid,
  HomeIcon as HomeSolid,
  RectangleStackIcon as RectangleStackSolid,
  UserGroupIcon as UserGroupSolid
} from '@heroicons/react/24/solid';
import { cn } from '../../lib/utils';

const navLinks = [
  { href: '/auth/dashboard', label: 'Início', Icon: HomeIcon, ActiveIcon: HomeSolid },
  {
    href: '/auth/registros',
    label: 'Registros',
    Icon: RectangleStackIcon,
    ActiveIcon: RectangleStackSolid
  },
  { href: '/auth/equipe', label: 'Equipe', Icon: UserGroupIcon, ActiveIcon: UserGroupSolid },
  {
    href: '/auth/relatorios',
    label: 'Relatórios',
    Icon: ChartBarSquareIcon,
    ActiveIcon: ChartBarSquareSolid
  }
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-background/80 fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-lg">
      <div className="mx-auto grid h-16 max-w-md grid-cols-4">
        {navLinks.map(({ href, label, Icon, ActiveIcon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center space-y-1 text-sm font-medium"
            >
              {isActive ? (
                <ActiveIcon className="text-primary size-6" />
              ) : (
                <Icon className="text-muted-foreground size-6" />
              )}
              <span className={cn('text-xs', isActive ? 'text-primary' : 'text-muted-foreground')}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
