'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Network } from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-white transition-colors';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center rounded bg-gradient-to-tr from-cyan-950 to-slate-900 border border-cyan-800/40 p-0.5 group-hover:border-cyan-500/50 transition-all duration-300">
            <Image
              src="/logo.png"
              alt="Absurd Node Logo"
              width={28}
              height={28}
              className="object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <span className="text-lg font-bold tracking-wider text-white group-hover:text-cyan-400 transition-colors">
            ABSURD <span className="font-light text-slate-400 group-hover:text-cyan-300">NODE</span>
          </span>
        </Link>

        {/* Center/Right Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/" className={isActive('/')}>
            Home
          </Link>
          <Link href="/dashboard" className={isActive('/dashboard')}>
            Dashboard
          </Link>
          <Link href="/graph" className={isActive('/graph')}>
            Graph Explorer
          </Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="relative inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-wider text-cyan-400 border border-cyan-500/30 rounded bg-cyan-950/20 hover:bg-cyan-500/10 hover:border-cyan-400 active:scale-95 transition-all duration-200 overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5" />
              INVESTIGATE NOW
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent transition-transform duration-1000 ease-out" />
          </Link>
        </div>
      </div>
    </header>
  );
};
export default Header;
