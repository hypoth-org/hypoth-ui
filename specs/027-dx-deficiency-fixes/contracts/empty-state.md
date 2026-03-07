# Contract: EmptyState Component

## React API

```typescript
// Compound component pattern
interface EmptyStateProps {
  className?: string;
  children?: React.ReactNode;
}

interface EmptyStateIconProps {
  className?: string;
  children?: React.ReactNode; // Icon element
}

interface EmptyStateTitleProps {
  className?: string;
  children?: React.ReactNode;
}

interface EmptyStateDescriptionProps {
  className?: string;
  children?: React.ReactNode;
}

interface EmptyStateActionProps {
  className?: string;
  children?: React.ReactNode; // Button or Link element
}

// Usage
<EmptyState>
  <EmptyState.Icon><SearchIcon /></EmptyState.Icon>
  <EmptyState.Title>No results found</EmptyState.Title>
  <EmptyState.Description>
    Try adjusting your search or filters.
  </EmptyState.Description>
  <EmptyState.Action>
    <Button onPress={handleClearFilters}>Clear filters</Button>
  </EmptyState.Action>
</EmptyState>
```

## Web Component API

```html
<ds-empty-state>
  <ds-empty-state-icon><svg>...</svg></ds-empty-state-icon>
  <ds-empty-state-title>No results found</ds-empty-state-title>
  <ds-empty-state-description>
    Try adjusting your search or filters.
  </ds-empty-state-description>
  <ds-empty-state-action>
    <ds-button>Clear filters</ds-button>
  </ds-empty-state-action>
</ds-empty-state>
```

## CSS Classes

```css
.ds-empty-state { /* centered flex column layout */ }
.ds-empty-state-icon { /* decorative icon container, aria-hidden */ }
.ds-empty-state-title { /* heading style */ }
.ds-empty-state-description { /* body text, muted color */ }
.ds-empty-state-action { /* action button container */ }
```

## Accessibility

- Container: `<section role="status">` for live region semantics
- Icon: `aria-hidden="true"` (decorative)
- Title: Rendered as `<h3>` by default
- Description: Rendered as `<p>`
- Action: Inherits accessibility from child component (Button, Link)

## Design Tokens Used

- `color.text.muted` — description text
- `color.text.default` — title text
- `color.icon.muted` — icon color
- `spacing.component.lg` — gap between sub-components
- `typography.heading.sm` — title typography
- `typography.body.md` — description typography
