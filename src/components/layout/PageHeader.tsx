'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

export default function PageHeader({
  title,
  children
}: {
  title?: string;
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <header className="mb-4 hidden items-center justify-between md:flex">
      <nav className="flex items-center text-sm text-gray-500">
        <Link href="/auth/dashboard" className="hover:text-primary-600">
          Home
        </Link>
        {segments.slice(1).map((seg, idx) => (
          <React.Fragment key={idx}>
            <ChevronRightIcon className="mx-1 h-4 w-4" />
            <span className="capitalize">{seg}</span>
          </React.Fragment>
        ))}
      </nav>
      {title && <h1 className="text-lg font-semibold text-gray-800">{title}</h1>}
      {children}
    </header>
  );
}
