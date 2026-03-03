"use client";

import { type Direction, createRovingFocus } from "@ds/primitives-dom";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function RovingFocusDemoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rovingRef = useRef<ReturnType<typeof createRovingFocus> | null>(null);
  const [direction, setDirection] = useState<Direction>("horizontal");
  const [loop, setLoop] = useState(true);
  const [skipDisabled, setSkipDisabled] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    rovingRef.current?.destroy();

    rovingRef.current = createRovingFocus({
      container: containerRef.current,
      selector: "button",
      direction,
      loop,
      skipDisabled,
      onFocus: (_, index) => {
        setFocusedIndex(index);
      },
    });

    setIsActive(true);

    return () => {
      rovingRef.current?.destroy();
      setIsActive(false);
    };
  }, [direction, loop, skipDisabled]);

  const items = [
    { label: "Item 1", disabled: false },
    { label: "Item 2", disabled: false },
    { label: "Item 3 (disabled)", disabled: true },
    { label: "Item 4", disabled: false },
    { label: "Item 5", disabled: false },
  ];

  return (
    <main className="container" style={{ paddingTop: "2rem" }}>
      <Link href="/primitives">← Back to Primitives</Link>

      <h1>Roving Focus</h1>
      <p className="text-muted">Use arrow keys to navigate. Home/End jump to first/last item.</p>

      <div data-testid="roving-focus-demo" style={{ marginTop: "2rem" }}>
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
            {isActive ? "Active" : "Inactive"} | Focused: {focusedIndex}
          </span>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            Orientation:
            <select
              data-testid="orientation-select"
              value={direction}
              onChange={(e) => setDirection(e.target.value as Direction)}
              style={{ padding: "0.25rem" }}
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
              <option value="both">Both</option>
            </select>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              data-testid="loop-checkbox"
              checked={loop}
              onChange={(e) => setLoop(e.target.checked)}
            />
            Loop
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              checked={skipDisabled}
              onChange={(e) => setSkipDisabled(e.target.checked)}
            />
            Skip Disabled
          </label>
        </div>

        <div
          ref={containerRef}
          data-testid="roving-container"
          role="toolbar"
          aria-label="Demo toolbar"
          style={{
            display: "flex",
            flexDirection: direction === "vertical" ? "column" : "row",
            gap: "0.5rem",
            padding: "1rem",
            border: "2px solid var(--ds-color-border-default, #ccc)",
            borderRadius: "0.5rem",
            backgroundColor: "var(--ds-color-surface-default, #f9f9f9)",
          }}
        >
          {items.map((item, index) => (
            <button
              type="button"
              key={item.label}
              data-testid={`roving-item-${index}`}
              disabled={item.disabled}
              aria-disabled={item.disabled}
              style={{
                padding: "0.5rem 1rem",
                opacity: item.disabled ? 0.5 : 1,
                outline:
                  focusedIndex === index
                    ? "2px solid var(--ds-color-primary-default, blue)"
                    : "none",
                outlineOffset: "2px",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <p className="text-muted" style={{ marginTop: "1rem", fontSize: "0.875rem" }}>
          {direction === "horizontal" && "Use Left/Right arrow keys"}
          {direction === "vertical" && "Use Up/Down arrow keys"}
          {direction === "both" && "Use any arrow key"}
        </p>
      </div>
    </main>
  );
}
