import Link from "next/link";

export default function PrimitivesIndexPage() {
  const primitives = [
    {
      name: "Focus Trap",
      href: "/primitives/focus-trap",
      description: "Trap Tab/Shift+Tab navigation within a container element",
    },
    {
      name: "Roving Focus",
      href: "/primitives/roving-focus",
      description: "Arrow key navigation with roving tabindex pattern",
    },
    {
      name: "Dismissable Layer",
      href: "/primitives/dismissable-layer",
      description: "Escape key and outside click dismissal with layer stacking",
    },
    {
      name: "Keyboard Helpers",
      href: "/primitives/keyboard-helpers",
      description: "Activation (Enter/Space) and arrow key handlers",
    },
    {
      name: "Type-Ahead",
      href: "/primitives/type-ahead",
      description: "Character buffer search for lists and menus",
    },
  ];

  return (
    <main className="container" style={{ paddingTop: "2rem" }}>
      <h1>Behavior Primitives</h1>
      <p className="text-muted">
        Framework-agnostic utilities for accessible component behaviors.
      </p>

      <nav style={{ marginTop: "2rem" }}>
        <ul className="stack-md" style={{ listStyle: "none", padding: 0 }}>
          {primitives.map((primitive) => (
            <li key={primitive.href}>
              <Link
                href={primitive.href}
                style={{
                  display: "block",
                  padding: "1rem",
                  border: "1px solid var(--ds-color-border-default)",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                }}
              >
                <strong>{primitive.name}</strong>
                <p className="text-muted" style={{ margin: "0.5rem 0 0" }}>
                  {primitive.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div style={{ marginTop: "2rem" }}>
        <Link href="/">← Back to Home</Link>
      </div>
    </main>
  );
}
