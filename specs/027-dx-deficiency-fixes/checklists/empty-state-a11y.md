# Manual Accessibility Testing Checklist: EmptyState

**Component**: EmptyState
**Created**: 2026-03-07

## Screen Reader Testing

- [ ] Container with `role="status"` is announced as a status region
- [ ] Icon content is NOT announced (verify `aria-hidden="true"` works)
- [ ] Title `<h3>` is read as a heading at level 3
- [ ] Description `<p>` is read as body text
- [ ] Action button/link within EmptyState.Action is focusable and operable

## Keyboard Navigation

- [ ] Tab key reaches any interactive elements in EmptyState.Action
- [ ] No keyboard trap within the EmptyState component
- [ ] Focus order follows visual order (Icon → Title → Description → Action)

## Visual Testing

- [ ] High contrast mode: all text (title, description) remains visible
- [ ] High contrast mode: icon is visible (or irrelevant since decorative)
- [ ] 200% zoom: layout remains usable, no content clipping
- [ ] Reduced motion: no animations to verify (component is static)

## Color & Contrast

- [ ] Title text meets WCAG 2.1 AA contrast ratio (4.5:1 for normal text)
- [ ] Description text meets WCAG 2.1 AA contrast ratio (4.5:1 for normal text)
- [ ] Both light and dark modes meet contrast requirements

## Notes

- EmptyState is a purely presentational/structural component
- All interactive behavior is inherited from child components (Button, Link)
- The `role="status"` provides live region semantics for dynamic empty states
