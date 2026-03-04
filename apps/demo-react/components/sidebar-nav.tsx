'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation } from '@ds/demo-shared';

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span style={{ fontWeight: 600 }}>Hypoth UI</span>
      </div>
      <nav className="sidebar-nav">
        {navigation.map((section) => (
          <div key={section.id} className="sidebar-section">
            {section.label && (
              <div className="sidebar-section-label">{section.label}</div>
            )}
            {section.items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`sidebar-item ${pathname === item.href ? 'active' : ''}`}
              >
                <span className="sidebar-item-icon">{getIcon(item.icon)}</span>
                <span className="sidebar-item-label">{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}

function getIcon(iconName: string): string {
  // Simple emoji icons for now - can be replaced with proper icon components
  const icons: Record<string, string> = {
    home: '🏠',
    'text-cursor-input': '📝',
    table: '📊',
    layers: '📦',
    'message-circle': '💬',
  };
  return icons[iconName] || '📄';
}
