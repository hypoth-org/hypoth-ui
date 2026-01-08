# Quickstart: Layout Primitives

**Feature**: 020-layout-primitives
**Date**: 2026-01-08

## Installation

Layout primitives are included in the core design system packages.

```bash
# If not already installed
pnpm add @ds/css @ds/wc @ds/react
```

## Setup

### 1. Import CSS

Include layout styles in your application:

```css
/* In your global CSS */
@import "@ds/css";
```

### 2. Register Web Components (Optional)

If using Web Components directly:

```typescript
// In your app entry point
import "@ds/wc/layout";
```

### 3. Import React Components (Optional)

If using React:

```tsx
import { Flow, Container, Grid, Box } from "@ds/react/layout";
```

## Basic Usage

### Flow (1D Layout)

The primary layout primitive for arranging items in a row or column.

**React:**
```tsx
// Vertical stack
<Flow direction="column" gap="md">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
</Flow>

// Horizontal row
<Flow direction="row" gap="lg" align="center">
  <Avatar />
  <Text>Username</Text>
</Flow>

// Responsive: column on mobile, row on desktop
<Flow direction={{ base: "column", md: "row" }} gap={{ base: "sm", md: "lg" }}>
  <Sidebar />
  <Content />
</Flow>
```

**Web Components:**
```html
<!-- Vertical stack -->
<ds-flow direction="column" gap="md">
  <div>Item 1</div>
  <div>Item 2</div>
</ds-flow>

<!-- Responsive -->
<ds-flow direction="base:column md:row" gap="base:sm md:lg">
  <aside>Sidebar</aside>
  <main>Content</main>
</ds-flow>
```

### Container (Width Constraint)

Constrains content width with responsive max-widths.

**React:**
```tsx
<Container size="lg" padding="md">
  <h1>Page Title</h1>
  <p>Content constrained to 1024px max width...</p>
</Container>
```

**Web Components:**
```html
<ds-container size="lg" padding="md">
  <h1>Page Title</h1>
  <p>Content constrained to 1024px max width...</p>
</ds-container>
```

### Grid (2D Layout)

Responsive grid layout for cards, galleries, etc.

**React:**
```tsx
<Grid columns={{ base: 1, md: 2, lg: 3 }} gap="lg">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</Grid>
```

**Web Components:**
```html
<ds-grid columns="base:1 md:2 lg:3" gap="lg">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</ds-grid>
```

### Box (Token-Based Styling)

Apply padding, background, and radius using only design tokens.

**React:**
```tsx
<Box p="lg" bg="surface" radius="md">
  <h2>Card Title</h2>
  <p>Card content with consistent styling...</p>
</Box>
```

**Web Components:**
```html
<ds-box p="lg" bg="surface" radius="md">
  <h2>Card Title</h2>
  <p>Card content with consistent styling...</p>
</ds-box>
```

## Page Composition

### Complete App Shell

**React:**
```tsx
import {
  Page,
  AppShell,
  Container,
  Flow
} from "@ds/react/layout";

function App() {
  return (
    <Page bg="background">
      <AppShell>
        <AppShell.Header sticky>
          <Container>
            <Flow direction="row" justify="between" align="center">
              <Logo />
              <Nav />
            </Flow>
          </Container>
        </AppShell.Header>

        <AppShell.Main id="main-content">
          <Container>
            {/* Page content */}
          </Container>
        </AppShell.Main>

        <AppShell.Footer>
          <Container>
            <FooterContent />
          </Container>
        </AppShell.Footer>
      </AppShell>
    </Page>
  );
}
```

**Web Components:**
```html
<ds-page bg="background">
  <ds-app-shell>
    <ds-header slot="header" sticky>
      <ds-container>
        <ds-flow direction="row" justify="between" align="center">
          <logo-component></logo-component>
          <nav-component></nav-component>
        </ds-flow>
      </ds-container>
    </ds-header>

    <ds-main id="main-content">
      <ds-container>
        <!-- Page content -->
      </ds-container>
    </ds-main>

    <ds-footer slot="footer">
      <ds-container>
        <footer-content></footer-content>
      </ds-container>
    </ds-footer>
  </ds-app-shell>
</ds-page>
```

## Common Patterns

### Form Layout

```tsx
<Flow direction="column" gap="md">
  <Field label="Name">
    <Input />
  </Field>
  <Field label="Email">
    <Input type="email" />
  </Field>
  <Flow direction={{ base: "column", sm: "row" }} gap="sm" justify="end">
    <Button variant="ghost">Cancel</Button>
    <Button variant="primary">Submit</Button>
  </Flow>
</Flow>
```

### Card Grid

```tsx
<Grid columns={{ base: 1, md: 2, xl: 3 }} gap="lg">
  {items.map(item => (
    <Box key={item.id} p="lg" bg="surface" radius="md">
      <Flow direction="column" gap="sm">
        <img src={item.image} alt="" />
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </Flow>
    </Box>
  ))}
</Grid>
```

### Media Object

```tsx
<Flow direction="row" gap="md" align="start">
  <Avatar src={user.avatar} size="lg" />
  <Flow direction="column" gap="xs">
    <Text weight="bold">{user.name}</Text>
    <Text color="muted">{user.bio}</Text>
  </Flow>
</Flow>
```

### Split Layout (Sidebar)

```tsx
<Split collapseAt="md" ratio="1:3" gap="lg">
  <Box as="aside" p="md" bg="surface">
    <SidebarNav />
  </Box>
  <Box as="main">
    <MainContent />
  </Box>
</Split>
```

### Tag/Chip Row

```tsx
<Wrap gap="sm">
  {tags.map(tag => (
    <Tag key={tag}>{tag}</Tag>
  ))}
</Wrap>
```

## Aliases (React Only)

For discoverability, React provides these aliases:

```tsx
import { Stack, Inline } from "@ds/react/layout";

// Stack = Flow direction="column"
<Stack gap="md">...</Stack>

// Inline = Flow direction="row"
<Inline gap="sm">...</Inline>
```

## Skip Link Pattern

For accessibility, implement a skip link to Main:

```tsx
<>
  <a href="#main-content" className="ds-skip-link">
    Skip to content
  </a>
  <AppShell>
    <AppShell.Main id="main-content" tabIndex={-1}>
      {/* Content */}
    </AppShell.Main>
  </AppShell>
</>
```

## Token Reference

| Prop | Valid Tokens |
|------|--------------|
| `gap`, `p`, `px`, `py`, `spacing`, `size` | `none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl` |
| `bg` | `background`, `surface`, `surface-raised`, `surface-sunken`, `muted` |
| `radius` | `none`, `sm`, `md`, `lg`, `xl`, `full` |
| `size` (Container) | `sm`, `md`, `lg`, `xl`, `2xl`, `full` |
| `columns` (Grid) | `1`-`12`, `auto-fit`, `auto-fill` |

## Next Steps

- [API Reference](./contracts/component-api.md) - Full prop documentation
- [CSS Classes](./contracts/css-classes.md) - Class naming and customization
- [Data Model](./data-model.md) - Token value sets and type definitions
