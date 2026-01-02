import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { NavSidebar } from "../components/nav-sidebar";
import { ThemeSwitcher } from "../components/theme-switcher";
import "../styles/globals.css";

// Theme init script - runs before paint to prevent flash
const themeInitScript = `(function(){
  var root = document.documentElement;
  var mode = (function() {
    try {
      var stored = localStorage.getItem('ds-mode');
      if (stored) return stored;
    } catch(e) {}
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    if (window.matchMedia('(prefers-contrast: more)').matches) return 'high-contrast';
    return 'light';
  })();
  root.dataset.mode = mode;
  try {
    var brand = localStorage.getItem('ds-brand');
    if (brand) root.dataset.brand = brand;
  } catch(e) {}
})();`;

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
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
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
