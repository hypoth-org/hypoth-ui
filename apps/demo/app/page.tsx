export default function HomePage() {
  return (
    <main className="container" style={{ paddingTop: "2rem" }}>
      <h1>Design System Demo</h1>
      <p className="text-muted">
        Demonstrating the design system components and CSS layers.
      </p>

      {/* Typography Demo Section */}
      <section className="stack-lg" style={{ marginTop: "2rem" }}>
        <h2>Typography</h2>
        <div className="stack-md">
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <h4>Heading 4</h4>
          <h5>Heading 5</h5>
          <h6>Heading 6</h6>
          <p>
            This is a paragraph with <strong>bold text</strong>,{" "}
            <em>italic text</em>, and <a href="https://example.com">a link</a>.
            The design system provides consistent typography across all
            platforms.
          </p>
          <blockquote>
            This is a blockquote. It should have a left border and muted color.
          </blockquote>
        </div>
      </section>

      {/* Lists Demo Section */}
      <section className="stack-lg" style={{ marginTop: "2rem" }}>
        <h2>Lists</h2>
        <div className="flex gap-lg">
          <div>
            <h4>Unordered List</h4>
            <ul>
              <li>First item</li>
              <li>Second item</li>
              <li>Third item</li>
            </ul>
          </div>
          <div>
            <h4>Ordered List</h4>
            <ol>
              <li>First step</li>
              <li>Second step</li>
              <li>Third step</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Code Demo Section */}
      <section className="stack-lg" style={{ marginTop: "2rem" }}>
        <h2>Code</h2>
        <p>
          Use <code>@ds/css</code> to import the design system styles.
        </p>
        <pre>
          <code>{`@layer overrides {
  :root {
    --ds-color-primary-default: #ff5500;
  }
}`}</code>
        </pre>
      </section>

      {/* Buttons Demo Section */}
      <section className="stack-lg" style={{ marginTop: "2rem" }}>
        <h2>Buttons</h2>
        <div className="flex gap-md">
          {/* @ts-expect-error - custom element */}
          <ds-button variant="primary">Primary</ds-button>
          {/* @ts-expect-error - custom element */}
          <ds-button variant="secondary">Secondary</ds-button>
          {/* @ts-expect-error - custom element */}
          <ds-button variant="ghost">Ghost</ds-button>
          {/* @ts-expect-error - custom element */}
          <ds-button variant="destructive">Destructive</ds-button>
        </div>

        <h3>Sizes</h3>
        <div className="flex gap-md items-center">
          {/* @ts-expect-error - custom element */}
          <ds-button size="sm">Small</ds-button>
          {/* @ts-expect-error - custom element */}
          <ds-button size="md">Medium</ds-button>
          {/* @ts-expect-error - custom element */}
          <ds-button size="lg">Large</ds-button>
        </div>

        <h3>States</h3>
        <div className="flex gap-md items-center">
          {/* @ts-expect-error - custom element */}
          <ds-button disabled>Disabled</ds-button>
          {/* @ts-expect-error - custom element */}
          <ds-button loading>Loading</ds-button>
        </div>
      </section>

      <hr />

      <footer style={{ paddingBottom: "2rem" }}>
        <p className="text-muted text-center">
          CSS Layers: reset → tokens → base → components → utilities →
          overrides
        </p>
      </footer>
    </main>
  );
}
