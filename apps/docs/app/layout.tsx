import "@ds/tokens/css";
import "@ds/css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Design System Docs",
  description: "Design System Documentation",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
