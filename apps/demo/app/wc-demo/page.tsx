"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Demo page for Web Components integration in Next.js.
 * Tests DsLoader, ds:* events, and Light DOM rendering.
 */
export default function WcDemoPage() {
  const [clickCount, setClickCount] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const buttonRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLElement>(null);

  // Add event listeners for ds:* custom events
  useEffect(() => {
    const button = buttonRef.current;
    const input = inputRef.current;

    const handleClick = () => setClickCount((c) => c + 1);
    const handleChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ value: string }>;
      setInputValue(customEvent.detail.value);
    };

    button?.addEventListener("ds:press", handleClick);
    input?.addEventListener("ds:change", handleChange);

    return () => {
      button?.removeEventListener("ds:press", handleClick);
      input?.removeEventListener("ds:change", handleChange);
    };
  }, []);

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Web Components Demo</h1>
      <p>
        This page demonstrates ds-* Web Components working in Next.js App Router with proper
        SSR/hydration.
      </p>

      <section style={{ marginTop: "2rem" }}>
        <h2>Button Component</h2>
        <p>Click the button to test ds:press events:</p>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <ds-button ref={buttonRef} variant="primary">
            Click me
          </ds-button>
          <span>Click count: {clickCount}</span>
        </div>

        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
          <ds-button variant="secondary">Secondary</ds-button>
          <ds-button variant="ghost">Ghost</ds-button>
          <ds-button variant="destructive">Destructive</ds-button>
          <ds-button disabled>Disabled</ds-button>
        </div>

        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <ds-button size="sm">Small</ds-button>
          <ds-button size="md">Medium</ds-button>
          <ds-button size="lg">Large</ds-button>
        </div>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Input Component</h2>
        <p>Type in the input to test ds:change events:</p>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <ds-input ref={inputRef} placeholder="Type something..." />
          <span>Value: {inputValue}</span>
        </div>

        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
          <ds-input placeholder="Small" size="sm" />
          <ds-input placeholder="Medium" size="md" />
          <ds-input placeholder="Large" size="lg" />
        </div>

        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
          <ds-input type="email" placeholder="Email" />
          <ds-input type="password" placeholder="Password" />
          <ds-input disabled placeholder="Disabled" />
        </div>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Light DOM Verification</h2>
        <p>
          Web Components render in Light DOM, meaning internal elements are directly queryable. Open
          DevTools and run:
        </p>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "1rem",
            borderRadius: "4px",
            overflow: "auto",
          }}
        >
          {`// Query button's internal element
document.querySelector("ds-button button.ds-button")

// Query input's internal element
document.querySelector("ds-input input.ds-input__field")`}
        </pre>
      </section>
    </main>
  );
}

// TypeScript declarations for JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ds-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          variant?: "primary" | "secondary" | "ghost" | "destructive";
          size?: "sm" | "md" | "lg";
          disabled?: boolean;
          loading?: boolean;
          type?: "button" | "submit" | "reset";
          ref?: React.Ref<HTMLElement>;
        },
        HTMLElement
      >;
      "ds-input": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
          size?: "sm" | "md" | "lg";
          name?: string;
          value?: string;
          placeholder?: string;
          disabled?: boolean;
          readonly?: boolean;
          required?: boolean;
          error?: boolean;
          ref?: React.Ref<HTMLElement>;
        },
        HTMLElement
      >;
    }
  }
}
