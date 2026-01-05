"use client";

/**
 * Branded Header Component
 *
 * Site header with branding, navigation, and optional features.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { useBranding } from "../../lib/branding-context";
import { Logo } from "./logo";

export interface BrandedHeaderProps {
  /** Additional content in the header (e.g., search, theme toggle) */
  children?: ReactNode;
  /** Custom class name */
  className?: string;
  /** Edition name to display (passed from server) */
  editionName?: string;
}

export function BrandedHeader({ children, className = "", editionName }: BrandedHeaderProps) {
  const { primaryColor } = useBranding();

  return (
    <header className={`branded-header ${className}`}>
      <div className="branded-header__left">
        <Link href="/" className="branded-header__logo-link">
          <Logo size="medium" />
        </Link>
        {editionName && editionName !== "Default" && (
          <span className="branded-header__edition">{editionName}</span>
        )}
      </div>

      <div className="branded-header__right">{children}</div>

      <style jsx>{`
        .branded-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.5rem;
          background: var(--ds-surface-primary, #fff);
          border-bottom: 1px solid var(--ds-border, #e5e7eb);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .branded-header__left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .branded-header__logo-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }

        .branded-header__edition {
          font-size: 0.75rem;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          font-weight: 600;
          background-color: var(--ds-brand-primary, ${primaryColor});
          color: white;
        }

        .branded-header__right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
      `}</style>
    </header>
  );
}
