"use client";

import { createTypeAhead } from "@ds/primitives-dom";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const fruits = [
  "Apple",
  "Apricot",
  "Banana",
  "Blueberry",
  "Cherry",
  "Coconut",
  "Date",
  "Fig",
  "Grape",
  "Kiwi",
  "Lemon",
  "Lime",
  "Mango",
  "Orange",
  "Papaya",
  "Peach",
  "Pear",
  "Plum",
  "Raspberry",
  "Strawberry",
];

export default function TypeAheadDemoPage() {
  const listRef = useRef<HTMLDivElement>(null);
  const typeAheadRef = useRef<ReturnType<typeof createTypeAhead> | null>(null);

  const [buffer, setBuffer] = useState("");
  const [matchedIndex, setMatchedIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    typeAheadRef.current = createTypeAhead({
      items: () => Array.from(list.querySelectorAll('[role="option"]')),
      getText: (item) => item.textContent ?? "",
      onMatch: (item, index) => {
        setMatchedIndex(index);
        setFocusedIndex(index);
        item.focus();
      },
      timeout: 500,
    });

    // Custom handler to track buffer
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only track printable characters
      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        setBuffer((prev) => prev + event.key);

        // Clear buffer display after timeout
        setTimeout(() => {
          setBuffer("");
          setMatchedIndex(null);
        }, 500);
      }

      typeAheadRef.current?.handleKeyDown(event);
    };

    list.addEventListener("keydown", handleKeyDown);
    return () => list.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleReset = () => {
    typeAheadRef.current?.reset();
    setBuffer("");
    setMatchedIndex(null);
  };

  const handleItemClick = (index: number) => {
    setFocusedIndex(index);
    const item = listRef.current?.querySelector(
      `[data-testid="list-item-${index}"]`
    ) as HTMLElement;
    item?.focus();
  };

  return (
    <main className="container" style={{ paddingTop: "2rem" }}>
      <Link href="/primitives">← Back to Primitives</Link>

      <h1>Type-Ahead Search</h1>
      <p className="text-muted">
        Focus the list and start typing to find items. Buffer clears after 500ms.
      </p>

      <div data-testid="type-ahead-demo" style={{ marginTop: "2rem" }}>
        <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
          <span
            data-testid="status-indicator"
            data-active="true"
            style={{
              display: "inline-block",
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              backgroundColor: "var(--ds-color-success-default, green)",
              color: "white",
              fontSize: "0.875rem",
            }}
          >
            Active
          </span>

          <button type="button" data-testid="reset-buffer" onClick={handleReset}>
            Reset Buffer
          </button>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <div
            data-testid="buffer-display"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: buffer
                ? "var(--ds-color-primary-default, blue)"
                : "var(--ds-color-surface-default, #f0f0f0)",
              color: buffer ? "white" : "inherit",
              borderRadius: "0.25rem",
              fontFamily: "monospace",
              minWidth: "150px",
            }}
          >
            Buffer: {buffer || "(empty)"}
          </div>

          {matchedIndex !== null && (
            <div
              data-testid="matched-item"
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "var(--ds-color-success-default, green)",
                color: "white",
                borderRadius: "0.25rem",
              }}
            >
              Matched: {fruits[matchedIndex]}
            </div>
          )}
        </div>

        <div
          ref={listRef}
          data-testid="list-container"
          // biome-ignore lint/a11y/useSemanticElements: Custom listbox with type-ahead behavior
          role="listbox"
          aria-label="Fruit selection"
          tabIndex={0}
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            border: "2px solid var(--ds-color-border-default, #ccc)",
            borderRadius: "0.5rem",
            backgroundColor: "white",
          }}
        >
          {fruits.map((fruit, index) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: Keyboard handled by type-ahead at container level
            <div
              key={fruit}
              // biome-ignore lint/a11y/useSemanticElements: Custom option with type-ahead behavior
              role="option"
              data-testid={`list-item-${index}`}
              tabIndex={-1}
              aria-selected={focusedIndex === index}
              onClick={() => handleItemClick(index)}
              style={{
                padding: "0.75rem 1rem",
                cursor: "pointer",
                backgroundColor:
                  focusedIndex === index ? "var(--ds-color-primary-default, blue)" : "transparent",
                color: focusedIndex === index ? "white" : "inherit",
                borderBottom:
                  index < fruits.length - 1
                    ? "1px solid var(--ds-color-border-default, #eee)"
                    : "none",
              }}
            >
              {fruit}
            </div>
          ))}
        </div>

        <p className="text-muted" style={{ marginTop: "1rem", fontSize: "0.875rem" }}>
          Tip: Type &quot;bl&quot; to find &quot;Blueberry&quot;, or &quot;ch&quot; for
          &quot;Cherry&quot;
        </p>
      </div>
    </main>
  );
}
