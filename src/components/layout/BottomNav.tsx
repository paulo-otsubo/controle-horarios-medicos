'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import React from 'react';
import {
  HomeIcon,
  ClockIcon,
  ChartBarIcon,
  UsersIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navItems: NavItem[] = [
  { href: '/auth/dashboard', label: 'Home', icon: HomeIcon },
  { href: '/auth/registros', label: 'Reg.', icon: ClockIcon },
  { href: '/auth/relatorios', label: 'Dash', icon: ChartBarIcon },
  { href: '/auth/equipe', label: 'Equipe', icon: UsersIcon },
  { href: '/auth/planos', label: 'Config', icon: Cog6ToothIcon }
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-14 bg-white shadow-md md:hidden">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex flex-1 flex-col items-center justify-center text-xs font-medium',
              isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <Icon className="h-6 w-6" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
