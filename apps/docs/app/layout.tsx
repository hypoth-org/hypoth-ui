import "@hypoth-ui/tokens/css";
import "@hypoth-ui/css";
import { NavSidebar } from "@hypoth-ui/docs-renderer-next/components/nav-sidebar";
import { DsLoader } from "@hypoth-ui/next";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@hypoth-ui/docs-renderer-next/styles/globals.css";

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
    <html lang="en">
      <body>
        <DsLoader />
        <div className="docs-layout">
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
