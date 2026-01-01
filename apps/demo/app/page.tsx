export default function HomePage() {
  return (
    <main className="container" style={{ paddingTop: "2rem" }}>
      <h1>Design System Demo</h1>
      <p className="text-muted">Demonstrating the design system components.</p>

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
    </main>
  );
}
