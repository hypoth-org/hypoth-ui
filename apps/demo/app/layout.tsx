import "@ds/css";
import type { ReactNode } from "react";
import { DsLoader } from "../components/ds-loader";
import { BrandSwitcher } from "../components/brand-switcher";

export const metadata = {
  title: "DS Demo",
  description: "Design System Demo Application",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DsLoader />
        {children}
        <BrandSwitcher />
      </body>
    </html>
  );
}
