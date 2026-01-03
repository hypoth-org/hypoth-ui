"use client";

import { createFocusTrap } from "@ds/primitives-dom";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function FocusTrapDemoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trapRef = useRef<ReturnType<typeof createFocusTrap> | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    trapRef.current = createFocusTrap({
      container: containerRef.current,
      returnFocus: true,
    });

    return () => {
      trapRef.current?.deactivate();
    };
  }, []);

  const handleActivate = () => {
    trapRef.current?.activate();
    setIsActive(true);
  };

  const handleDeactivate = () => {
    trapRef.current?.deactivate();
    setIsActive(false);
  };

  return (
    <main className="container" style={{ paddingTop: "2rem" }}>
      <Link href="/primitives">← Back to Primitives</Link>

      <h1>Focus Trap</h1>
      <p className="text-muted">
        Keeps focus within a container element. Press Tab/Shift+Tab to cycle through focusable
        elements.
      </p>

      <div data-testid="focus-trap-demo" style={{ marginTop: "2rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <span
            data-testid="status-indicator"
            data-active={isActive}
            style={{
              display: "inline-block",
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              backgroundColor: isActive
                ? "var(--ds-color-success-default, green)"
                : "var(--ds-color-neutral-default, gray)",
              color: "white",
              fontSize: "0.875rem",
            }}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <button
            type="button"
            data-testid="activate-btn"
            onClick={handleActivate}
            disabled={isActive}
          >
            Activate Trap
          </button>
          <button
            type="button"
            data-testid="deactivate-btn"
            onClick={handleDeactivate}
            disabled={!isActive}
          >
            Deactivate Trap
          </button>
        </div>

        <div
          ref={containerRef}
          data-testid="trap-container"
          style={{
            padding: "1.5rem",
            border: isActive
              ? "2px solid var(--ds-color-primary-default, blue)"
              : "2px solid var(--ds-color-border-default, #ccc)",
            borderRadius: "0.5rem",
            backgroundColor: "var(--ds-color-surface-default, #f9f9f9)",
          }}
        >
          <p style={{ marginBottom: "1rem" }}>
            Focus is trapped within this container when active.
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button type="button" data-testid="first-focusable">
              First Button
            </button>
            <input type="text" placeholder="Text input" style={{ padding: "0.5rem" }} />
            <select style={{ padding: "0.5rem" }}>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
            <button type="button" data-testid="last-focusable">
              Last Button
            </button>
          </div>
        </div>

        <button type="button" data-testid="outside-element" style={{ marginTop: "1rem" }}>
          Outside Element (cannot focus when trap is active)
        </button>
      </div>
    </main>
  );
}
