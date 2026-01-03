import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NavSidebar } from "../components/nav-sidebar";
import { ThemeInitScript } from "../components/theme-init-script";
import { ThemeSwitcher } from "../components/theme-switcher";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Design System",
    default: "Design System",
  },
  description: "Documentation for the Design System",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" data-mode="light">
      <head>
        <ThemeInitScript />
      </head>
      <body>
        <div className="docs-layout">
          <header className="docs-header">
            <div className="docs-header-content">
              <span className="docs-logo">Design System</span>
              <ThemeSwitcher />
            </div>
          </header>
          <aside className="docs-sidebar">
            <NavSidebar />
          </aside>
          <main className="docs-main">
            <div className="docs-content">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
