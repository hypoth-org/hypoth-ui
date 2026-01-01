import Link from "next/link";

export default function HomePage() {
  return (
    <div className="docs-home">
      <h1>Design System Documentation</h1>
      <p>Welcome to the design system documentation.</p>

      <nav className="docs-home-nav">
        <h2>Get Started</h2>
        <ul>
          <li>
            <Link href="/guides/getting-started">Getting Started</Link>
          </li>
          <li>
            <Link href="/guides/theming">Theming</Link>
          </li>
        </ul>

        <h2>Components</h2>
        <ul>
          <li>
            <Link href="/components/button">Button</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
