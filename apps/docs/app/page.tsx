import Link from "next/link";

export default function DocsHomePage() {
  return (
    <div className="docs-home">
      <h1>Design System Documentation</h1>
      <p>
        Welcome to the design system documentation. Learn how to use components, customize themes,
        and build accessible interfaces.
      </p>

      <nav className="docs-home-nav">
        <h2>Get Started</h2>
        <ul>
          <li>
            <Link href="/guides/getting-started">Getting Started</Link> - Install and set up the
            design system
          </li>
          <li>
            <Link href="/guides/theming">Theming</Link> - Customize colors, spacing, and typography
          </li>
        </ul>

        <h2>Components</h2>
        <ul>
          <li>
            <Link href="/components/button">Button</Link> - Interactive button for triggering
            actions
          </li>
        </ul>
      </nav>
    </div>
  );
}
