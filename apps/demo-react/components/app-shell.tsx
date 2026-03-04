'use client';

import type { ReactNode } from 'react';
import { MobileNav } from './mobile-nav';

interface AppShellProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export function AppShell({ sidebar, header, children }: AppShellProps) {
  return (
    <div className="app-shell">
      {/* Skip to main content link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Sidebar */}
      {sidebar}

      {/* Header */}
      <header className="header">
        <MobileNav />
        {header}
      </header>

      {/* Main content */}
      <main id="main-content" className="main-content">
        <div className="content-container">{children}</div>
      </main>
    </div>
  );
}
