'use client';

import { Toast } from '@hypoth-ui/react';
import type { ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Client-side providers wrapper for the app.
 * Includes ThemeProvider and Toast.Provider.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <Toast.Provider>
      <ThemeProvider>{children}</ThemeProvider>
    </Toast.Provider>
  );
}
