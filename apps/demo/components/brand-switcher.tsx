"use client";

import { useEffect, useState } from "react";

type Brand = "default" | "acme";
type Mode = "light" | "dark" | "system";

export function BrandSwitcher() {
  const [brand, setBrand] = useState<Brand>("default");
  const [mode, setMode] = useState<Mode>("system");

  // Load/unload tenant stylesheet
  useEffect(() => {
    const existingLink = document.getElementById("tenant-stylesheet");

    if (brand === "acme") {
      // Only create if not already present
      if (!existingLink) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/tenant-acme.css";
        link.id = "tenant-stylesheet";
        document.head.appendChild(link);
      }
    } else {
      // Remove tenant stylesheet if present
      if (existingLink) {
        existingLink.remove();
      }
    }

    return () => {
      // Cleanup on unmount
      const link = document.getElementById("tenant-stylesheet");
      if (link) {
        link.remove();
      }
    };
  }, [brand]);

  // Handle mode changes
  useEffect(() => {
    const root = document.documentElement;

    if (mode === "system") {
      root.removeAttribute("data-mode");
    } else {
      root.setAttribute("data-mode", mode);
    }
  }, [mode]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        padding: "1rem",
        backgroundColor: "var(--ds-color-background-elevated, #f9fafb)",
        border: "1px solid var(--ds-color-border-default, #e5e7eb)",
        borderRadius: "0.5rem",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        minWidth: "180px",
      }}
    >
      <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>Theme Controls</div>

      {/* Brand Switcher */}
      <div>
        <label
          htmlFor="brand-select"
          style={{ display: "block", fontSize: "0.75rem", marginBottom: "0.25rem" }}
        >
          Brand
        </label>
        <select
          id="brand-select"
          value={brand}
          onChange={(e) => setBrand(e.target.value as Brand)}
          style={{
            width: "100%",
            padding: "0.375rem 0.5rem",
            borderRadius: "0.25rem",
            border: "1px solid var(--ds-color-border-default, #e5e7eb)",
            backgroundColor: "var(--ds-color-background-default, #fff)",
            fontSize: "0.875rem",
          }}
        >
          <option value="default">Default</option>
          <option value="acme">Tenant: Acme</option>
        </select>
      </div>

      {/* Mode Switcher */}
      <div>
        <label
          htmlFor="mode-select"
          style={{ display: "block", fontSize: "0.75rem", marginBottom: "0.25rem" }}
        >
          Color Mode
        </label>
        <select
          id="mode-select"
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          style={{
            width: "100%",
            padding: "0.375rem 0.5rem",
            borderRadius: "0.25rem",
            border: "1px solid var(--ds-color-border-default, #e5e7eb)",
            backgroundColor: "var(--ds-color-background-default, #fff)",
            fontSize: "0.875rem",
          }}
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      {/* Status indicator */}
      <div
        style={{
          fontSize: "0.625rem",
          color: "var(--ds-color-foreground-muted, #6b7280)",
          textAlign: "center",
        }}
      >
        {brand === "acme" ? "🟠 Acme Theme Active" : "⚪ Default Theme"}
      </div>
    </div>
  );
}
