'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'text-white border-b border-white pb-0.5 font-medium' : 'text-slate-400 hover:text-white transition-colors';
  };

  return (
    <header className="w-full bg-black py-8 z-50">
      <div className="flex justify-center items-center gap-12 text-sm font-sans tracking-wide">
        <Link href="/" className={isActive('/')}>
          Search
        </Link>
        <Link href="/dashboard" className={isActive('/dashboard')}>
          Dashboard
        </Link>
        <Link href="/graph" className={isActive('/graph')}>
          Graphs Explorer
        </Link>
      </div>
    </header>
  );
};

export default Header;
