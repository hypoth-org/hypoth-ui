"use client";

/**
 * Search Input Component
 *
 * Full-featured search component that connects to the search API.
 * Features:
 * - Debounced search as you type
 * - Keyboard navigation
 * - Result grouping by type
 * - Keyboard shortcut (/)
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  type: "component" | "guide";
  title: string;
  description?: string;
  excerpt?: string;
  url: string;
  tags?: string[];
  category?: string;
  status?: string;
}

interface SearchResponse {
  results: SearchResult[];
  query: string;
  total: number;
  facets?: {
    categories: string[];
    types: string[];
    tags: string[];
  };
}

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
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const abortController = new AbortController();
    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=10`, {
          signal: abortController.signal,
        });
        if (response.ok) {
          const data: SearchResponse = await response.json();
          setResults(data.results);
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Search error:", error);
        }
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [query]);

  // Keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !isInputFocused()) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    function isInputFocused() {
      const active = document.activeElement;
      return (
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        active?.getAttribute("contenteditable") === "true"
      );
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          setIsOpen(false);
          setQuery("");
          inputRef.current?.blur();
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, -1));
          break;
        case "Enter":
          if (selectedIndex >= 0 && results[selectedIndex]) {
            e.preventDefault();
            navigateToResult(results[selectedIndex]);
          }
          break;
      }
    },
    [results, selectedIndex]
  );

  const navigateToResult = useCallback(
    (result: SearchResult) => {
      setIsOpen(false);
      setQuery("");
      router.push(result.url);
    },
    [router]
  );

  // Group results by type
  const componentResults = results.filter((r) => r.type === "component");
  const guideResults = results.filter((r) => r.type === "guide");

  if (!enabled) {
    return null;
  }

  return (
    <div ref={containerRef} className={`search-input ${className}`}>
      <div className="search-input__wrapper">
        <span className="search-input__icon" aria-hidden="true">
          {isLoading ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="search-input__spinner"
              aria-hidden="true"
            >
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="32"
                strokeDashoffset="8"
              />
            </svg>
          ) : (
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
          )}
        </span>
        <input
          ref={inputRef}
          type="search"
          className="search-input__field"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search documentation"
          aria-expanded={isOpen && results.length > 0}
          aria-controls="search-results"
          aria-activedescendant={selectedIndex >= 0 ? `search-result-${selectedIndex}` : undefined}
          role="combobox"
          autoComplete="off"
        />
        <span className="search-input__shortcut" aria-hidden="true">
          /
        </span>
      </div>

      {isOpen && query.length > 0 && (
        <div
          id="search-results"
          className="search-input__dropdown"
          role="listbox"
          aria-label="Search results"
          tabIndex={-1}
        >
          {results.length === 0 && !isLoading && (
            <div className="search-input__empty">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}

          {componentResults.length > 0 && (
            <div className="search-input__group">
              <div className="search-input__group-label">Components</div>
              {componentResults.map((result, idx) => {
                const globalIndex = idx;
                return (
                  <button
                    type="button"
                    key={result.id}
                    id={`search-result-${globalIndex}`}
                    className={`search-input__result ${selectedIndex === globalIndex ? "search-input__result--selected" : ""}`}
                    onClick={() => navigateToResult(result)}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    role="option"
                    aria-selected={selectedIndex === globalIndex}
                  >
                    <span className="search-input__result-icon">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                        <rect x="1" y="1" width="5" height="5" rx="1" />
                        <rect x="8" y="1" width="5" height="5" rx="1" />
                        <rect x="1" y="8" width="5" height="5" rx="1" />
                        <rect x="8" y="8" width="5" height="5" rx="1" />
                      </svg>
                    </span>
                    <span className="search-input__result-content">
                      <span className="search-input__result-title">{result.title}</span>
                      {result.description && (
                        <span className="search-input__result-description">
                          {result.description}
                        </span>
                      )}
                    </span>
                    {result.status && (
                      <span className={`search-input__result-status search-input__result-status--${result.status}`}>
                        {result.status}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {guideResults.length > 0 && (
            <div className="search-input__group">
              <div className="search-input__group-label">Guides</div>
              {guideResults.map((result, idx) => {
                const globalIndex = componentResults.length + idx;
                return (
                  <button
                    type="button"
                    key={result.id}
                    id={`search-result-${globalIndex}`}
                    className={`search-input__result ${selectedIndex === globalIndex ? "search-input__result--selected" : ""}`}
                    onClick={() => navigateToResult(result)}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    role="option"
                    aria-selected={selectedIndex === globalIndex}
                  >
                    <span className="search-input__result-icon">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                        <path d="M2 2h10v10H2V2zm1 1v8h8V3H3z" />
                        <path d="M4 5h6M4 7h6M4 9h4" stroke="currentColor" strokeWidth="1" />
                      </svg>
                    </span>
                    <span className="search-input__result-content">
                      <span className="search-input__result-title">{result.title}</span>
                      {result.description && (
                        <span className="search-input__result-description">
                          {result.description}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
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

        .search-input__spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
          background: var(--ds-color-background-surface, #fff);
          border: 1px solid var(--ds-color-border-default, #e5e5e5);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          max-height: 400px;
          overflow-y: auto;
        }

        .search-input__empty {
          padding: 1rem;
          color: var(--ds-color-foreground-muted, #666);
          font-size: 0.875rem;
          text-align: center;
        }

        .search-input__group {
          padding: 0.5rem 0;
        }

        .search-input__group:not(:last-child) {
          border-bottom: 1px solid var(--ds-color-border-default, #e5e5e5);
        }

        .search-input__group-label {
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--ds-color-foreground-muted, #666);
        }

        .search-input__result {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          width: 100%;
          padding: 0.5rem 0.75rem;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
        }

        .search-input__result:hover,
        .search-input__result--selected {
          background: var(--ds-color-background-subtle, #f5f5f5);
        }

        .search-input__result-icon {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ds-color-foreground-muted, #666);
        }

        .search-input__result-content {
          flex: 1;
          min-width: 0;
        }

        .search-input__result-title {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--ds-color-foreground-default, #1a1a1a);
        }

        .search-input__result-description {
          display: block;
          font-size: 0.75rem;
          color: var(--ds-color-foreground-muted, #666);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .search-input__result-status {
          flex-shrink: 0;
          padding: 0.125rem 0.375rem;
          font-size: 0.625rem;
          font-weight: 500;
          text-transform: uppercase;
          border-radius: 4px;
        }

        .search-input__result-status--stable {
          background: var(--ds-color-success-subtle, #dcfce7);
          color: var(--ds-color-success, #16a34a);
        }

        .search-input__result-status--beta {
          background: var(--ds-color-warning-subtle, #fef3c7);
          color: var(--ds-color-warning, #d97706);
        }

        .search-input__result-status--experimental {
          background: var(--ds-color-info-subtle, #dbeafe);
          color: var(--ds-color-info, #2563eb);
        }

        .search-input__result-status--deprecated {
          background: var(--ds-color-error-subtle, #fee2e2);
          color: var(--ds-color-error, #dc2626);
        }
      `}</style>
    </div>
  );
}
