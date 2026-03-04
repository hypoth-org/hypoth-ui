'use client';

import { Switch } from '@ds/react';
import { useTheme } from './theme-provider';

/**
 * Theme toggle component using Switch from @ds/react
 * Allows users to toggle between light and dark themes
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="theme-toggle" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '14px', color: 'var(--color-muted)' }}>
        {isDark ? 'Dark' : 'Light'}
      </span>
      <Switch
        checked={isDark}
        onChange={toggleTheme}
        aria-label="Toggle dark mode"
      />
    </div>
  );
}
