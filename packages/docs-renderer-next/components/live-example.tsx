"use client";

/**
 * Live Example Component
 *
 * Interactive code example wrapper for documentation.
 * Features:
 * - Live preview of component
 * - Syntax-highlighted source code
 * - Copy to clipboard
 * - Toggle between preview and code views
 * - Variant selector for multiple examples
 */

import { type ReactNode, useState } from "react";

export interface LiveExampleProps {
  /** The live preview content */
  children: ReactNode;
  /** Source code to display */
  code: string;
  /** Language for syntax highlighting */
  language?: string;
  /** Title for the example */
  title?: string;
  /** Description of what the example demonstrates */
  description?: string;
  /** Whether to show code by default */
  defaultShowCode?: boolean;
  /** Available variants/tabs */
  variants?: Array<{
    name: string;
    code: string;
    preview: ReactNode;
  }>;
  /** Custom class name */
  className?: string;
}

export function LiveExample({
  children,
  code,
  language = "tsx",
  title,
  description,
  defaultShowCode = false,
  variants,
  className = "",
}: LiveExampleProps) {
  const [showCode, setShowCode] = useState(defaultShowCode);
  const [copied, setCopied] = useState(false);
  const [activeVariant, setActiveVariant] = useState(0);

  const currentCode = variants ? variants[activeVariant]?.code || code : code;
  const currentPreview = variants ? variants[activeVariant]?.preview || children : children;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className={`live-example ${className}`}>
      {title && (
        <div className="live-example__header">
          <h3 className="live-example__title">{title}</h3>
          {description && <p className="live-example__description">{description}</p>}
        </div>
      )}

      {/* Variant tabs */}
      {variants && variants.length > 1 && (
        <div className="live-example__variants" role="tablist">
          {variants.map((variant, index) => (
            <button
              key={variant.name}
              type="button"
              className={`live-example__variant-tab ${activeVariant === index ? "live-example__variant-tab--active" : ""}`}
              onClick={() => setActiveVariant(index)}
              role="tab"
              aria-selected={activeVariant === index}
            >
              {variant.name}
            </button>
          ))}
        </div>
      )}

      {/* Preview area */}
      <div className="live-example__preview">
        <div className="live-example__preview-content">{currentPreview}</div>
      </div>

      {/* Controls */}
      <div className="live-example__controls">
        <button
          type="button"
          className={`live-example__toggle ${showCode ? "live-example__toggle--active" : ""}`}
          onClick={() => setShowCode(!showCode)}
          aria-expanded={showCode}
          aria-controls="live-example-code"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M10.5 4.5L14 8l-3.5 3.5M5.5 4.5L2 8l3.5 3.5" />
          </svg>
          <span>{showCode ? "Hide code" : "Show code"}</span>
        </button>

        {showCode && (
          <button type="button" className="live-example__copy" onClick={handleCopy} aria-label="Copy code">
            {copied ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M3.5 8l3 3 6-6" />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <rect x="5" y="5" width="9" height="9" rx="1" />
                  <path d="M11 5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2" />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Code block */}
      {showCode && (
        <div id="live-example-code" className="live-example__code">
          <pre className={`language-${language}`}>
            <code>{currentCode}</code>
          </pre>
        </div>
      )}

      <style jsx>{`
        .live-example {
          border: 1px solid var(--ds-color-border-default, #e5e5e5);
          border-radius: 8px;
          overflow: hidden;
          margin: 1.5rem 0;
        }

        .live-example__header {
          padding: 1rem;
          border-bottom: 1px solid var(--ds-color-border-default, #e5e5e5);
          background: var(--ds-color-background-subtle, #f9f9f9);
        }

        .live-example__title {
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0;
          color: var(--ds-color-foreground-default, #1a1a1a);
        }

        .live-example__description {
          font-size: 0.75rem;
          margin: 0.25rem 0 0;
          color: var(--ds-color-foreground-muted, #666);
        }

        .live-example__variants {
          display: flex;
          gap: 0;
          border-bottom: 1px solid var(--ds-color-border-default, #e5e5e5);
          background: var(--ds-color-background-subtle, #f9f9f9);
        }

        .live-example__variant-tab {
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--ds-color-foreground-muted, #666);
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
        }

        .live-example__variant-tab:hover {
          color: var(--ds-color-foreground-default, #1a1a1a);
        }

        .live-example__variant-tab--active {
          color: var(--ds-brand-primary, #0066cc);
          border-bottom-color: var(--ds-brand-primary, #0066cc);
        }

        .live-example__preview {
          padding: 1.5rem;
          background: var(--ds-color-background-surface, #fff);
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .live-example__preview-content {
          width: 100%;
        }

        .live-example__controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-top: 1px solid var(--ds-color-border-default, #e5e5e5);
          background: var(--ds-color-background-subtle, #f9f9f9);
        }

        .live-example__toggle,
        .live-example__copy {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--ds-color-foreground-muted, #666);
          background: var(--ds-color-background-surface, #fff);
          border: 1px solid var(--ds-color-border-default, #e5e5e5);
          border-radius: 4px;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
        }

        .live-example__toggle:hover,
        .live-example__copy:hover {
          color: var(--ds-color-foreground-default, #1a1a1a);
          border-color: var(--ds-color-border-strong, #ccc);
        }

        .live-example__toggle--active {
          color: var(--ds-brand-primary, #0066cc);
          border-color: var(--ds-brand-primary, #0066cc);
          background: rgba(0, 102, 204, 0.05);
        }

        .live-example__copy {
          margin-left: auto;
        }

        .live-example__code {
          border-top: 1px solid var(--ds-color-border-default, #e5e5e5);
          background: var(--ds-color-background-code, #1e1e1e);
          overflow-x: auto;
        }

        .live-example__code pre {
          margin: 0;
          padding: 1rem;
          font-size: 0.8125rem;
          line-height: 1.6;
          font-family: "SF Mono", Menlo, Monaco, "Courier New", monospace;
        }

        .live-example__code code {
          color: var(--ds-color-code-text, #d4d4d4);
          white-space: pre;
        }

        /* Dark mode adjustments */
        :global([data-theme="dark"]) .live-example__preview {
          background: var(--ds-color-background-surface-dark, #1a1a1a);
        }
      `}</style>
    </div>
  );
}

/**
 * Simple code block without live preview
 */
export interface CodeBlockProps {
  /** Source code to display */
  code: string;
  /** Language for syntax highlighting */
  language?: string;
  /** Filename to display */
  filename?: string;
  /** Whether to show line numbers */
  showLineNumbers?: boolean;
  /** Lines to highlight */
  highlightLines?: number[];
  /** Custom class name */
  className?: string;
}

export function CodeBlock({
  code,
  language = "tsx",
  filename,
  showLineNumbers = false,
  highlightLines = [],
  className = "",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const lines = code.split("\n");

  return (
    <div className={`code-block ${className}`}>
      {filename && (
        <div className="code-block__header">
          <span className="code-block__filename">{filename}</span>
          <button type="button" className="code-block__copy" onClick={handleCopy} aria-label="Copy code">
            {copied ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M3.5 8l3 3 6-6" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <rect x="5" y="5" width="9" height="9" rx="1" />
                <path d="M11 5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2" />
              </svg>
            )}
          </button>
        </div>
      )}
      <pre className={`language-${language}`}>
        <code>
          {showLineNumbers
            ? lines.map((line, i) => (
                <span
                  key={i}
                  className={`code-block__line ${highlightLines.includes(i + 1) ? "code-block__line--highlighted" : ""}`}
                >
                  <span className="code-block__line-number">{i + 1}</span>
                  <span className="code-block__line-content">{line}</span>
                  {"\n"}
                </span>
              ))
            : code}
        </code>
      </pre>

      <style jsx>{`
        .code-block {
          border-radius: 8px;
          overflow: hidden;
          margin: 1rem 0;
          background: var(--ds-color-background-code, #1e1e1e);
        }

        .code-block__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .code-block__filename {
          font-size: 0.75rem;
          font-family: "SF Mono", Menlo, Monaco, "Courier New", monospace;
          color: var(--ds-color-code-text, #d4d4d4);
          opacity: 0.7;
        }

        .code-block__copy {
          padding: 0.25rem;
          background: transparent;
          border: none;
          color: var(--ds-color-code-text, #d4d4d4);
          opacity: 0.5;
          cursor: pointer;
          transition: opacity 0.15s;
        }

        .code-block__copy:hover {
          opacity: 1;
        }

        .code-block pre {
          margin: 0;
          padding: 1rem;
          font-size: 0.8125rem;
          line-height: 1.6;
          font-family: "SF Mono", Menlo, Monaco, "Courier New", monospace;
          overflow-x: auto;
        }

        .code-block code {
          color: var(--ds-color-code-text, #d4d4d4);
        }

        .code-block__line {
          display: flex;
        }

        .code-block__line--highlighted {
          background: rgba(255, 255, 255, 0.1);
          margin: 0 -1rem;
          padding: 0 1rem;
        }

        .code-block__line-number {
          display: inline-block;
          width: 2.5rem;
          flex-shrink: 0;
          text-align: right;
          padding-right: 1rem;
          color: var(--ds-color-code-text, #d4d4d4);
          opacity: 0.3;
          user-select: none;
        }

        .code-block__line-content {
          flex: 1;
          white-space: pre;
        }
      `}</style>
    </div>
  );
}
