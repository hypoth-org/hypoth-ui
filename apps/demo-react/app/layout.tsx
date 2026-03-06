import '@hypoth-ui/tokens/css';
import '@hypoth-ui/css';
import '../styles/globals.css';
import { DsLoader } from '@hypoth-ui/next';
import type { ReactNode } from 'react';
import { Providers } from '../components/providers';

export const metadata = {
  title: 'Demo - React | Hypoth UI',
  description: 'React/Next.js demo application for the Hypoth UI design system',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <DsLoader />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
