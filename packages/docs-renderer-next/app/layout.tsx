import { applyDefaultFeatures } from "@ds/docs-core";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BrandedHeader } from "../components/branding/header";
import { FeedbackWidget } from "../components/feedback/feedback-widget";
import { NavSidebar } from "../components/nav-sidebar";
import { SearchInput } from "../components/search/search-input";
import { ThemeInitScript } from "../components/theme-init-script";
import { ThemeSwitcher } from "../components/theme-switcher";
import { BrandingProvider } from "../lib/branding-context";
import { getEditionConfig } from "../lib/content-resolver";
import "../styles/globals.css";

/**
 * Generate metadata dynamically based on branding config
 */
export async function generateMetadata(): Promise<Metadata> {
  const config = await getEditionConfig();
  const siteName = config.branding?.name ?? "Design System";

  return {
    title: {
      template: `%s | ${siteName}`,
      default: siteName,
    },
    description: `Documentation for ${siteName}`,
  };
}

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  // Load edition config for branding
  const config = await getEditionConfig();

  // Apply default features to ensure all flags are present
  const features = applyDefaultFeatures(config.features);

  // Generate CSS custom properties for branding
  const brandingStyles = `
    :root {
      --ds-brand-primary: ${config.branding?.primaryColor ?? "#0066cc"};
    }
  `;

  return (
    <html lang="en" data-mode="light">
      <head>
        <ThemeInitScript />
        {/* Inject branding CSS custom properties - safe as brandingStyles is server-generated */}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: CSS is server-generated from config */}
        <style dangerouslySetInnerHTML={{ __html: brandingStyles }} />
        {config.branding?.favicon && <link rel="icon" href={config.branding.favicon} />}
      </head>
      <body>
        {/* T064: Skip link for keyboard accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <BrandingProvider
          branding={config.branding}
          features={config.features}
          upgrade={config.upgrade}
          edition={config.edition}
          editionId={config.id}
          editionName={config.name}
        >
          <div className="docs-layout">
            {/* T065: Proper landmark roles - header contains navigation */}
            <BrandedHeader editionName={config.name}>
              {/* T056: Conditionally render SearchInput based on features.search */}
              {features.search && <SearchInput />}
              {/* T055: Conditionally render ThemeSwitcher based on features.darkMode */}
              {features.darkMode && <ThemeSwitcher />}
            </BrandedHeader>
            {/* T065: Proper landmark roles - nav element for navigation */}
            <nav className="docs-sidebar" aria-label="Documentation navigation">
              <NavSidebar edition={config.edition} />
            </nav>
            {/* T065: Proper landmark roles - main content area */}
            <main id="main-content" className="docs-main">
              <div className="docs-content">{children}</div>
            </main>
            {/* T057: Conditionally render FeedbackWidget based on features.feedback */}
            {features.feedback && <FeedbackWidget />}
          </div>
        </BrandingProvider>
      </body>
    </html>
  );
}
