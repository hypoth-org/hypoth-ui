"use client";

/**
 * Feedback Widget Component (Stub)
 *
 * Placeholder component for collecting user feedback.
 * Full implementation will integrate with feedback API.
 */

import { useState } from "react";

export interface FeedbackWidgetProps {
  /** Current page URL or identifier */
  pageId?: string;
  /** Custom class name */
  className?: string;
  /** Position of the widget */
  position?: "bottom-right" | "bottom-left";
}

export function FeedbackWidget({
  pageId,
  className = "",
  position = "bottom-right",
}: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (helpful: boolean) => {
    // Stub: In production, this would send feedback to an API
    console.info(`Feedback submitted for ${pageId}: ${helpful ? "helpful" : "not helpful"}`);
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
    }, 2000);
  };

  const positionClass =
    position === "bottom-left" ? "feedback-widget--left" : "feedback-widget--right";

  return (
    <div className={`feedback-widget ${positionClass} ${className}`}>
      {!isOpen ? (
        <button
          type="button"
          className="feedback-widget__trigger"
          onClick={() => setIsOpen(true)}
          aria-label="Give feedback"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M18 10c0 4.4-3.6 8-8 8a8 8 0 0 1-3.5-.8L2 18l.8-4.5A8 8 0 1 1 18 10Z" />
          </svg>
          <span>Feedback</span>
        </button>
      ) : (
        <div className="feedback-widget__panel" aria-label="Feedback form">
          {submitted ? (
            <div className="feedback-widget__thanks">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>Thank you for your feedback!</span>
            </div>
          ) : (
            <>
              <div className="feedback-widget__header">
                <span>Was this page helpful?</span>
                <button
                  type="button"
                  className="feedback-widget__close"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close feedback"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
              </div>
              <div className="feedback-widget__buttons">
                <button
                  type="button"
                  className="feedback-widget__btn feedback-widget__btn--yes"
                  onClick={() => handleSubmit(true)}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M6 10h.01M10 10h.01M14 10h.01M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
                    <path d="M7 13s1.5 2 3 2 3-2 3-2" />
                  </svg>
                  Yes
                </button>
                <button
                  type="button"
                  className="feedback-widget__btn feedback-widget__btn--no"
                  onClick={() => handleSubmit(false)}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M6 10h.01M10 10h.01M14 10h.01M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
                    <path d="M7 14s1.5-2 3-2 3 2 3 2" />
                  </svg>
                  No
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .feedback-widget {
          position: fixed;
          bottom: 1.5rem;
          z-index: 1000;
        }

        .feedback-widget--right {
          right: 1.5rem;
        }

        .feedback-widget--left {
          left: 1.5rem;
        }

        .feedback-widget__trigger {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: var(--ds-brand-primary, #0066cc);
          color: white;
          border: none;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: transform 0.15s, box-shadow 0.15s;
        }

        .feedback-widget__trigger:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .feedback-widget__panel {
          background: var(--ds-color-background-surface, #fff);
          border: 1px solid var(--ds-color-border-default, #e5e5e5);
          border-radius: 12px;
          padding: 1rem;
          min-width: 240px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .feedback-widget__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          font-weight: 500;
          color: var(--ds-color-foreground-default, #1a1a1a);
        }

        .feedback-widget__close {
          padding: 0.25rem;
          background: transparent;
          border: none;
          color: var(--ds-color-foreground-muted, #666);
          cursor: pointer;
          border-radius: 4px;
        }

        .feedback-widget__close:hover {
          background: var(--ds-color-background-subtle, #f5f5f5);
        }

        .feedback-widget__buttons {
          display: flex;
          gap: 0.75rem;
        }

        .feedback-widget__btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: var(--ds-color-background-subtle, #f5f5f5);
          border: 1px solid var(--ds-color-border-default, #e5e5e5);
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }

        .feedback-widget__btn:hover {
          background: var(--ds-color-background-surface, #fff);
          border-color: var(--ds-brand-primary, #0066cc);
        }

        .feedback-widget__btn--yes:hover {
          color: #16a34a;
          border-color: #16a34a;
        }

        .feedback-widget__btn--no:hover {
          color: #dc2626;
          border-color: #dc2626;
        }

        .feedback-widget__thanks {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          color: #16a34a;
        }
      `}</style>
    </div>
  );
}
