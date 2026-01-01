"use client";

import type { Edition as EditionType } from "@ds/docs-core";
import { type ReactNode, createContext, useContext } from "react";

/**
 * Context for the current edition
 */
const EditionContext = createContext<EditionType>("enterprise");

/**
 * Provider for the current edition
 */
export function EditionProvider({
  edition,
  children,
}: {
  edition: EditionType;
  children: ReactNode;
}) {
  return <EditionContext.Provider value={edition}>{children}</EditionContext.Provider>;
}

/**
 * Hook to get the current edition
 */
export function useEdition(): EditionType {
  return useContext(EditionContext);
}

/**
 * Edition hierarchy for checking availability
 */
const EDITION_INCLUDES: Record<EditionType, EditionType[]> = {
  core: [],
  pro: ["core"],
  enterprise: ["core", "pro"],
};

/**
 * Check if content for a specific edition should be visible
 */
function isEditionVisible(contentEdition: EditionType, currentEdition: EditionType): boolean {
  // Content is visible if:
  // 1. The current edition matches the content edition
  // 2. The current edition includes the content edition in its hierarchy
  if (contentEdition === currentEdition) return true;
  return EDITION_INCLUDES[currentEdition].includes(contentEdition);
}

interface EditionProps {
  /**
   * The edition(s) this content is for.
   * Can be a single edition or an array of editions.
   */
  for: EditionType | EditionType[];
  /**
   * The content to render if the edition matches
   */
  children: ReactNode;
  /**
   * Optional fallback content for other editions
   */
  fallback?: ReactNode;
}

/**
 * Edition component for conditional content in MDX
 *
 * @example
 * ```mdx
 * <Edition for="enterprise">
 *   This content is only visible to enterprise users.
 * </Edition>
 *
 * <Edition for={["pro", "enterprise"]} fallback={<p>Upgrade to access this feature.</p>}>
 *   This content is visible to pro and enterprise users.
 * </Edition>
 * ```
 */
export function Edition({ for: targetEdition, children, fallback }: EditionProps) {
  const currentEdition = useEdition();

  // Normalize to array
  const editions = Array.isArray(targetEdition) ? targetEdition : [targetEdition];

  // Check if current edition can see this content
  const isVisible = editions.some((e) => isEditionVisible(e, currentEdition));

  if (isVisible) {
    return <>{children}</>;
  }

  // Show fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Hide content
  return null;
}

/**
 * Badge component to show which editions content is available for
 */
interface EditionBadgeProps {
  edition: EditionType | EditionType[];
  className?: string;
}

export function EditionBadge({ edition, className = "" }: EditionBadgeProps) {
  const editions = Array.isArray(edition) ? edition : [edition];

  return (
    <span className={`edition-badge-group ${className}`}>
      {editions.map((e) => (
        <span key={e} className={`edition-badge edition-badge--${e}`}>
          {e}
        </span>
      ))}
      <style jsx>{`
        .edition-badge-group {
          display: inline-flex;
          gap: 0.25rem;
        }
        .edition-badge {
          display: inline-block;
          padding: 0.125rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 9999px;
          text-transform: capitalize;
        }
        .edition-badge--core {
          background-color: #e0f2fe;
          color: #0369a1;
        }
        .edition-badge--pro {
          background-color: #f0fdf4;
          color: #15803d;
        }
        .edition-badge--enterprise {
          background-color: #faf5ff;
          color: #7e22ce;
        }
      `}</style>
    </span>
  );
}
