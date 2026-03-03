'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Sheet, LegacyButton as Button } from '@ds/react';
import { navigation } from '@ds/demo-shared';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Mobile navigation component with hamburger trigger and Sheet
 * Visible only at mobile breakpoints (<768px)
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close sheet when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Handle close with focus return
  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Return focus to trigger after closing
      setTimeout(() => {
        triggerRef.current?.focus();
      }, 0);
    }
  }, []);

  return (
    <>
      {/* Hamburger trigger button */}
      <button
        ref={triggerRef}
        className="mobile-nav-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="mobile-nav-sheet"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Navigation Sheet */}
      <Sheet.Root open={open} onOpenChange={handleOpenChange}>
        <Sheet.Content side="left" size="sm" id="mobile-nav-sheet">
          <Sheet.Header>
            <Sheet.Title>Navigation</Sheet.Title>
          </Sheet.Header>
          <nav className="mobile-nav-menu" style={{ paddingTop: '16px' }}>
            {navigation.map((section) => (
              <div key={section.id} style={{ marginBottom: '16px' }}>
                {section.label && (
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--color-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '8px 0',
                    }}
                  >
                    {section.label}
                  </div>
                )}
                {section.items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 8px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      color: pathname === item.href ? 'var(--color-primary)' : 'var(--color-foreground)',
                      backgroundColor: pathname === item.href ? 'var(--color-primary-subtle)' : 'transparent',
                      fontWeight: pathname === item.href ? 500 : 400,
                    }}
                    onClick={() => setOpen(false)}
                  >
                    <span style={{ fontSize: '18px' }}>{getIcon(item.icon)}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </Sheet.Content>
      </Sheet.Root>
    </>
  );
}

function getIcon(iconName: string): string {
  const icons: Record<string, string> = {
    home: '\u{1F3E0}',
    'text-cursor-input': '\u{1F4DD}',
    table: '\u{1F4CA}',
    layers: '\u{1F4E6}',
    'message-circle': '\u{1F4AC}',
  };
  return icons[iconName] || '\u{1F4C4}';
}
