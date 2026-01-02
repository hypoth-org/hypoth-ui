"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "high-contrast";

interface ThemeSwitcherProps {
  brands?: string[];
}

/**
 * Theme Switcher Component
 * Allows users to switch between modes and brands
 */
export function ThemeSwitcher({ brands = ["default", "acme"] }: ThemeSwitcherProps) {
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [brand, setBrandState] = useState<string>("default");

  // Initialize from document on mount
  useEffect(() => {
    const currentMode = document.documentElement.dataset.mode as ThemeMode;
    const currentBrand = document.documentElement.dataset.brand;

    if (currentMode) setModeState(currentMode);
    if (currentBrand) setBrandState(currentBrand);
  }, []);

  const handleModeChange = (newMode: ThemeMode) => {
    setModeState(newMode);
    document.documentElement.dataset.mode = newMode;
    try {
      localStorage.setItem("ds-mode", newMode);
    } catch {
      // localStorage not available
    }
  };

  const handleBrandChange = (newBrand: string) => {
    setBrandState(newBrand);
    if (newBrand === "default") {
      delete document.documentElement.dataset.brand;
      try {
        localStorage.removeItem("ds-brand");
      } catch {
        // localStorage not available
      }
    } else {
      document.documentElement.dataset.brand = newBrand;
      try {
        localStorage.setItem("ds-brand", newBrand);
      } catch {
        // localStorage not available
      }
    }
  };

  return (
    <div className="theme-switcher">
      <div className="theme-switcher-section">
        <label>Mode</label>
        <div className="theme-switcher-buttons">
          <button
            type="button"
            className={mode === "light" ? "active" : ""}
            onClick={() => handleModeChange("light")}
            aria-pressed={mode === "light"}
          >
            ☀️ Light
          </button>
          <button
            type="button"
            className={mode === "dark" ? "active" : ""}
            onClick={() => handleModeChange("dark")}
            aria-pressed={mode === "dark"}
          >
            🌙 Dark
          </button>
          <button
            type="button"
            className={mode === "high-contrast" ? "active" : ""}
            onClick={() => handleModeChange("high-contrast")}
            aria-pressed={mode === "high-contrast"}
          >
            ◐ High Contrast
          </button>
        </div>
      </div>

      {brands.length > 1 && (
        <div className="theme-switcher-section">
          <label>Brand</label>
          <select
            value={brand}
            onChange={(e) => handleBrandChange(e.target.value)}
            aria-label="Select brand"
          >
            {brands.map((b) => (
              <option key={b} value={b}>
                {b.charAt(0).toUpperCase() + b.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}

      <style jsx>{`
        .theme-switcher {
          display: flex;
          gap: 1rem;
          align-items: center;
          padding: 0.5rem;
        }

        .theme-switcher-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .theme-switcher-section label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-secondary, #6b7280);
        }

        .theme-switcher-buttons {
          display: flex;
          gap: 0.25rem;
          background: var(--color-background-subtle, #f3f4f6);
          padding: 0.25rem;
          border-radius: var(--radius-md, 6px);
        }

        .theme-switcher-buttons button {
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
          border: none;
          background: transparent;
          color: var(--color-text-primary, #111827);
          border-radius: var(--radius-sm, 4px);
          cursor: pointer;
          transition: background-color 0.15s;
        }

        .theme-switcher-buttons button:hover {
          background: var(--color-background-elevated, #e5e7eb);
        }

        .theme-switcher-buttons button.active {
          background: var(--color-background-surface, #ffffff);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .theme-switcher-section select {
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
          border: 1px solid var(--color-border-default, #e5e7eb);
          border-radius: var(--radius-md, 6px);
          background: var(--color-background-surface, #ffffff);
          color: var(--color-text-primary, #111827);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
