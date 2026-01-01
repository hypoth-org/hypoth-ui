import "@ds/tokens/css";
import "@ds/css";
import type { ReactNode } from "react";
import { DsLoader } from "../components/ds-loader";

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
      </body>
    </html>
  );
}
