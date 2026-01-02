"use client";

import Link from "next/link";

interface TokensUsedProps {
  tokens: string[];
}

/**
 * Display tokens used by a component
 * Links each token to its documentation page
 */
export function TokensUsed({ tokens }: TokensUsedProps) {
  if (!tokens || tokens.length === 0) {
    return null;
  }

  // Group tokens by category
  const tokensByCategory = new Map<string, string[]>();

  for (const token of tokens) {
    const parts = token.split(".");
    const category = parts[0];
    if (!category) continue;
    if (!tokensByCategory.has(category)) {
      tokensByCategory.set(category, []);
    }
    tokensByCategory.get(category)!.push(token);
  }

  const categories = Array.from(tokensByCategory.keys()).sort();

  return (
    <section className="tokens-used">
      <h2>Design Tokens</h2>
      <p className="tokens-used-intro">
        This component uses the following design tokens for theming:
      </p>

      <div className="tokens-used-categories">
        {categories.map((category) => (
          <div key={category} className="tokens-used-category">
            <h3>
              <Link href={`/tokens/${category}`}>{formatCategoryName(category)}</Link>
            </h3>
            <ul className="tokens-used-list">
              {tokensByCategory.get(category)!.map((token) => (
                <li key={token}>
                  <code className="token-path">{token}</code>
                  <code className="token-css-var">var(--{token.replace(/\./g, "-")})</code>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <style jsx>{`
        .tokens-used {
          margin-top: 2rem;
          padding: 1.5rem;
          background: var(--color-background-subtle, #f9fafb);
          border-radius: var(--radius-md, 6px);
        }

        .tokens-used h2 {
          margin: 0 0 0.5rem;
          font-size: 1.25rem;
        }

        .tokens-used-intro {
          margin: 0 0 1rem;
          color: var(--color-text-secondary, #6b7280);
        }

        .tokens-used-categories {
          display: grid;
          gap: 1rem;
        }

        .tokens-used-category h3 {
          margin: 0 0 0.5rem;
          font-size: 1rem;
          text-transform: capitalize;
        }

        .tokens-used-category h3 a {
          color: var(--color-primary, #0066cc);
          text-decoration: none;
        }

        .tokens-used-category h3 a:hover {
          text-decoration: underline;
        }

        .tokens-used-list {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .tokens-used-list li {
          display: flex;
          gap: 1rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--color-border-default, #e5e7eb);
        }

        .tokens-used-list li:last-child {
          border-bottom: none;
        }

        .token-path {
          font-family: monospace;
          font-size: 0.875rem;
          color: var(--color-text-primary, #111827);
        }

        .token-css-var {
          font-family: monospace;
          font-size: 0.875rem;
          color: var(--color-text-secondary, #6b7280);
        }
      `}</style>
    </section>
  );
}

/**
 * Format category name for display
 */
function formatCategoryName(category: string): string {
  if (category === "z-index") return "Z-Index";
  return category.charAt(0).toUpperCase() + category.slice(1);
}
