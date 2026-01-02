"use client";

import { useEffect, useRef, useState } from "react";
import { createActivationHandler, createArrowKeyHandler, type LogicalDirection } from "@ds/primitives-dom";
import Link from "next/link";

const navItems = ["Home", "Products", "About", "Contact"];

export default function KeyboardHelpersDemoPage() {
  const customButtonRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLElement>(null);

  const [activationLog, setActivationLog] = useState<string[]>([]);
  const [navigationLog, setNavigationLog] = useState<string[]>([]);
  const [rtl, setRtl] = useState(false);
  const [navIndex, setNavIndex] = useState(0);

  // Activation handler
  useEffect(() => {
    const button = customButtonRef.current;
    if (!button) return;

    const handler = createActivationHandler({
      onActivate: (event) => {
        const key = event.key === " " ? "Space" : event.key;
        setActivationLog((prev) => [...prev.slice(-4), `Activated via ${key}`]);
      },
      keys: ["Enter", "Space"],
      preventDefault: "Space",
    });

    button.addEventListener("keydown", handler);
    return () => button.removeEventListener("keydown", handler);
  }, []);

  // Arrow key handler
  useEffect(() => {
    const container = navContainerRef.current;
    if (!container) return;

    const handler = createArrowKeyHandler({
      orientation: "horizontal",
      rtl,
      onNavigate: (direction: LogicalDirection) => {
        setNavigationLog((prev) => [...prev.slice(-4), `Navigate: ${direction}`]);

        setNavIndex((current) => {
          switch (direction) {
            case "next":
              return Math.min(current + 1, navItems.length - 1);
            case "previous":
              return Math.max(current - 1, 0);
            case "first":
              return 0;
            case "last":
              return navItems.length - 1;
            default:
              return current;
          }
        });
      },
    });

    container.addEventListener("keydown", handler);
    return () => container.removeEventListener("keydown", handler);
  }, [rtl]);

  // Focus the nav item when index changes
  useEffect(() => {
    const item = navContainerRef.current?.querySelector(`[data-testid="nav-item-${navIndex}"]`) as HTMLElement;
    item?.focus();
  }, [navIndex]);

  return (
    <main className="container" style={{ paddingTop: "2rem" }}>
      <Link href="/primitives">← Back to Primitives</Link>

      <h1>Keyboard Helpers</h1>
      <p className="text-muted">
        Reusable handlers for activation (Enter/Space) and arrow key navigation.
      </p>

      <div data-testid="keyboard-helpers-demo" style={{ marginTop: "2rem" }}>
        <div style={{ marginBottom: "1rem" }}>
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
        </div>

        {/* Activation Demo */}
        <section style={{ marginBottom: "2rem" }}>
          <h2>Activation Handler</h2>
          <p className="text-muted" style={{ fontSize: "0.875rem" }}>
            Focus the custom button and press Enter or Space to activate.
          </p>

          <div
            ref={customButtonRef}
            data-testid="custom-button"
            // biome-ignore lint/a11y/useSemanticElements: Demo of custom button with activation handler
            role="button"
            tabIndex={0}
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              backgroundColor: "var(--ds-color-primary-default, blue)",
              color: "white",
              borderRadius: "0.5rem",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            Custom Button (Enter/Space)
          </div>

          <div
            data-testid="activation-log"
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "var(--ds-color-surface-default, #f0f0f0)",
              borderRadius: "0.5rem",
              fontFamily: "monospace",
              fontSize: "0.875rem",
              minHeight: "100px",
            }}
          >
            {activationLog.length === 0 ? (
              <span className="text-muted">No activations yet</span>
            ) : (
              activationLog.map((log) => <div key={log}>{log}</div>)
            )}
          </div>
        </section>

        {/* Arrow Key Navigation Demo */}
        <section>
          <h2>Arrow Key Navigation</h2>
          <p className="text-muted" style={{ fontSize: "0.875rem" }}>
            Use Left/Right arrow keys to navigate. Home/End jump to first/last.
          </p>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <input
              type="checkbox"
              data-testid="rtl-toggle"
              checked={rtl}
              onChange={(e) => setRtl(e.target.checked)}
            />
            RTL Mode (swaps Left/Right)
          </label>

          <nav
            ref={navContainerRef}
            data-testid="nav-container"
            style={{
              display: "flex",
              gap: "0.5rem",
              padding: "1rem",
              backgroundColor: "var(--ds-color-surface-default, #f0f0f0)",
              borderRadius: "0.5rem",
              direction: rtl ? "rtl" : "ltr",
            }}
          >
            {navItems.map((item, index) => (
              <button
                type="button"
                key={item}
                data-testid={`nav-item-${index}`}
                tabIndex={index === navIndex ? 0 : -1}
                style={{
                  padding: "0.5rem 1rem",
                  outline: index === navIndex ? "2px solid var(--ds-color-primary-default, blue)" : "none",
                  outlineOffset: "2px",
                }}
              >
                {item}
              </button>
            ))}
          </nav>

          <div
            data-testid="navigation-log"
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "var(--ds-color-surface-default, #f0f0f0)",
              borderRadius: "0.5rem",
              fontFamily: "monospace",
              fontSize: "0.875rem",
              minHeight: "100px",
            }}
          >
            {navigationLog.length === 0 ? (
              <span className="text-muted">No navigation events yet</span>
            ) : (
              navigationLog.map((log) => <div key={log}>{log}</div>)
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
