"use client";

/**
 * Search Input Component (Stub)
 *
 * Placeholder component for search functionality.
 * Full implementation will connect to the search index.
 */

import { useState } from "react";

export interface SearchInputProps {
  /** Placeholder text */
  placeholder?: string;
  /** Custom class name */
  className?: string;
  /** Whether search is enabled */
  enabled?: boolean;
}

export function SearchInput({
  placeholder = "Search documentation...",
  className = "",
  enabled = true,
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  if (!enabled) {
    return null;
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
    }
  };

  return (
    <div className={`search-input ${className}`}>
      <div className="search-input__wrapper">
        <span className="search-input__icon" aria-hidden="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="6.5" cy="6.5" r="5.5" />
            <path d="M10.5 10.5L15 15" />
          </svg>
        </span>
        <input
          type="search"
          className="search-input__field"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search documentation"
        />
        <span className="search-input__shortcut" aria-hidden="true">
          /
        </span>
      </div>

      {isOpen && query.length > 0 && (
        <div className="search-input__dropdown">
          <div className="search-input__placeholder">
            Search functionality coming soon...
          </div>
        </div>
      )}

      <style jsx>{`
        .search-input {
          position: relative;
        }

        .search-input__wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: var(--ds-color-background-subtle, #f5f5f5);
          border: 1px solid var(--ds-color-border-default, #e5e5e5);
          border-radius: 6px;
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        .search-input__wrapper:focus-within {
          border-color: var(--ds-brand-primary, #0066cc);
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }

        .search-input__icon {
          color: var(--ds-color-foreground-muted, #666);
          flex-shrink: 0;
        }

        .search-input__field {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 0.875rem;
          color: var(--ds-color-foreground-default, #1a1a1a);
          outline: none;
          min-width: 150px;
        }

        .search-input__field::placeholder {
          color: var(--ds-color-foreground-muted, #666);
        }

        .search-input__shortcut {
          padding: 0.125rem 0.375rem;
          font-size: 0.75rem;
          font-family: monospace;
          background: var(--ds-color-background-surface, #fff);
          border: 1px solid var(--ds-color-border-default, #e5e5e5);
          border-radius: 4px;
          color: var(--ds-color-foreground-muted, #666);
        }

        .search-input__dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 0.5rem;
          padding: 1rem;
          background: var(--ds-color-background-surface, #fff);
          border: 1px solid var(--ds-color-border-default, #e5e5e5);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }

        .search-input__placeholder {
          color: var(--ds-color-foreground-muted, #666);
          font-size: 0.875rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
