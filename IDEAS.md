# hypoth-ui Ideas Backlog

**Purpose**: Capture potential improvements and innovations for evaluation.
**Last Updated**: 2026-01-15

---

## How to Use This Document

Each idea follows this structure:
1. **Problem**: What pain point exists today?
2. **Observation**: Where did we see a better approach?
3. **Proposal**: What specific change would we make?
4. **Impact**: How do we measure success?
5. **Scores**: Standardized evaluation criteria

---

## Evaluation Criteria

| Criterion | Description | Scale |
|-----------|-------------|-------|
| **DX Impact** | Improves developer experience, reduces friction | 1-5 |
| **User Impact** | Benefits end-users (accessibility, performance, consistency) | 1-5 |
| **Differentiation** | Sets hypoth-ui apart from Radix/Chakra/shadcn | 1-5 |
| **Effort** | Implementation complexity | S/M/L/XL |
| **Breaking** | Requires breaking changes | Yes/No |

---

## IDEA-001: Hierarchical Spacing Semantics

### Problem

**Scenario**: A developer is building a settings page with form fields, sections, and action buttons. They need to add spacing between elements. They open the token docs and see:

```
--ds-space-xs: 4px
--ds-space-sm: 8px
--ds-space-md: 16px
--ds-space-lg: 24px
--ds-space-xl: 32px
```

**The questions they face:**
- "Should the gap between a label and its input be `xs` or `sm`?"
- "What about between two form fields? `sm`? `md`?"
- "The gap before the Submit button... is that `lg` or `xl`?"

**What happens today:**
- Developer A uses `md` between fields, Developer B uses `lg`
- The same app has inconsistent spacing everywhere
- Design reviews become "make this 8px smaller" nitpicking
- New developers copy existing code without understanding the reasoning
- AI assistants guess randomly because token names carry no meaning

**Root cause**: Spacing tokens describe *size* but not *intent*. `space-md` doesn't tell you *when* to use it.

### Observation

[DesignerPunk v4](https://github.com/3fn/DesignerPunkv2) solves this with two semantic categories:

1. **Layout tokens** - External spacing based on *relationship* between elements
2. **Inset tokens** - Internal spacing based on *density/comfort* level

Instead of asking "how many pixels?", developers ask "what's the relationship?" and "how dense should this feel?"

### Proposal

Add semantic spacing tokens that encode intent:

```css
/* ==============================================
   LAYOUT TOKENS - Space BETWEEN elements
   Question: "What's the relationship between these items?"
   ============================================== */

/* Grouped: Items that form a single conceptual unit */
/* Example: Icon + label, avatar + name, input + error message */
--ds-layout-grouped: var(--ds-space-xs);     /* 4px */

/* Related: Items in the same context but distinct */
/* Example: Form fields in the same section, list items */
--ds-layout-related: var(--ds-space-sm);     /* 8px */

/* Separated: Items that are distinct but on same page */
/* Example: Different form sections, card from card */
--ds-layout-separated: var(--ds-space-lg);   /* 24px */

/* Sectioned: Major divisions in the page */
/* Example: Header from content, sidebar from main */
--ds-layout-sectioned: var(--ds-space-2xl);  /* 48px */


/* ==============================================
   INSET TOKENS - Space INSIDE elements
   Question: "How dense should this container feel?"
   ============================================== */

/* Tight: Compact, information-dense interfaces */
/* Example: Data tables, toolbars, compact lists */
--ds-inset-tight: var(--ds-space-xs);        /* 4px */

/* Normal: Default density for most components */
/* Example: Buttons, inputs, standard cards */
--ds-inset-normal: var(--ds-space-sm);       /* 8px */

/* Comfortable: Relaxed feel, easier scanning */
/* Example: Marketing cards, settings panels */
--ds-inset-comfortable: var(--ds-space-md);  /* 16px */

/* Spacious: Lots of breathing room */
/* Example: Hero sections, pricing cards */
--ds-inset-spacious: var(--ds-space-lg);     /* 24px */

/* Expansive: Maximum breathing room */
/* Example: Landing page sections, empty states */
--ds-inset-expansive: var(--ds-space-xl);    /* 32px */
```

### Before/After Example

**Scenario**: Building a user profile card

```tsx
// ❌ BEFORE: Developer must decide what sizes mean
<div style={{ padding: 'var(--ds-space-md)' }}>
  <div style={{ display: 'flex', gap: 'var(--ds-space-sm)' }}>
    <Avatar />
    <span>Jane Doe</span>  {/* Why sm? Could be xs? */}
  </div>
  <p style={{ marginTop: 'var(--ds-space-md)' }}>  {/* Why md? */}
    Bio text here...
  </p>
  <div style={{ marginTop: 'var(--ds-space-lg)' }}> {/* Why lg? */}
    <Button>Edit Profile</Button>
  </div>
</div>

// ✅ AFTER: Intent is explicit and self-documenting
<div style={{ padding: 'var(--ds-inset-comfortable)' }}>
  <div style={{ display: 'flex', gap: 'var(--ds-layout-grouped)' }}>
    <Avatar />
    <span>Jane Doe</span>  {/* Grouped = single unit */}
  </div>
  <p style={{ marginTop: 'var(--ds-layout-related)' }}>
    Bio text here...  {/* Related = same context */}
  </p>
  <div style={{ marginTop: 'var(--ds-layout-separated)' }}>
    <Button>Edit Profile</Button>  {/* Separated = distinct action */}
  </div>
</div>
```

**What changes:**
- Code is self-documenting - a new developer understands the *why*
- Design reviews shift from "change to 16px" to "these should be grouped, not separated"
- AI generates correct spacing because token names carry semantic meaning
- Consistency emerges naturally because same relationships use same tokens

### Impact Criteria

| Metric | How to Measure | Target |
|--------|----------------|--------|
| Spacing consistency | Audit 5 consumer apps for spacing variance | <20% variance (currently ~60%) |
| Design review time | Track spacing-related feedback in PRs | 50% reduction |
| AI prompt accuracy | Test "add spacing between form sections" | Correct token 90% of time |
| Developer confidence | Survey: "I know which spacing token to use" | 80% agree (currently ~40%) |
| Onboarding time | Time for new dev to space a page correctly | <30 min (currently ~2 hrs) |

### Scores

| Criterion | Score | Reasoning |
|-----------|-------|-----------|
| DX Impact | 4/5 | Major reduction in decision fatigue |
| User Impact | 3/5 | Consistent UIs are easier to scan |
| Differentiation | 5/5 | No major design system does this |
| Effort | S | Token additions only, non-breaking |
| Breaking | No | Additive change |

**Priority**: HIGH - High impact, low effort, unique differentiator

---

## IDEA-002: Component Token Layer

### Problem

**Scenario**: A team adopts hypoth-ui but needs buttons with more padding to match their brand. Current options:

```css
/* Option 1: Global override (affects ALL buttons) */
:root {
  --ds-space-sm: 12px;  /* Was 8px - breaks other components! */
}

/* Option 2: CSS specificity hack */
ds-button {
  padding: 12px 20px !important;  /* Fragile, hard to maintain */
}

/* Option 3: Custom component */
/* Give up and rebuild the button from scratch */
```

**What happens today:**
- Teams fork components to customize them
- `!important` spreads through codebases
- Global token changes have unintended side effects
- Customization knowledge is tribal, not documented

**Root cause**: Tokens are either global (affect everything) or require CSS overrides. There's no middle ground for component-scoped customization.

### Observation

DesignerPunk introduces a third token tier: **component tokens** that reference semantic tokens but can be overridden per-component:

```
Primitive → Semantic → Component
space100=8   spacing.normal=space100   button.paddingY=spacing.normal
```

### Proposal

Add a `defineComponentTokens()` API that generates component-scoped CSS custom properties:

```typescript
// packages/tokens/components/button.tokens.ts
import { defineComponentTokens } from '@ds/tokens';

export const buttonTokens = defineComponentTokens('button', {
  // Reference semantic tokens (default behavior)
  paddingX: { sm: 'space.sm', md: 'space.md', lg: 'space.lg' },
  paddingY: { sm: 'space.xs', md: 'space.sm', lg: 'space.md' },
  borderRadius: 'radius.md',
  fontSize: { sm: 'fontSize.sm', md: 'fontSize.md', lg: 'fontSize.lg' },

  // Focus ring settings
  focusRing: {
    width: '2px',
    offset: '2px',
    color: 'color.focus',
  },
});
```

**Generated CSS:**
```css
/* Default component tokens */
ds-button {
  --button-padding-x: var(--ds-space-md);
  --button-padding-y: var(--ds-space-sm);
  --button-border-radius: var(--ds-radius-md);
  --button-font-size: var(--ds-font-size-md);
  --button-focus-ring-width: 2px;
  --button-focus-ring-offset: 2px;
  --button-focus-ring-color: var(--ds-color-focus);
}

/* Component uses its own tokens */
ds-button {
  padding: var(--button-padding-y) var(--button-padding-x);
  border-radius: var(--button-border-radius);
  /* ... */
}
```

**Consumer customization:**
```css
/* Clean, scoped override - no !important needed */
ds-button {
  --button-padding-x: 20px;
  --button-padding-y: 12px;
}

/* Or theme-level override */
[data-brand="acme"] ds-button {
  --button-border-radius: var(--ds-radius-full);
}
```

### Before/After Example

```css
/* ❌ BEFORE: Hacky, fragile, affects everything */
.my-brand ds-button {
  padding: 12px 20px !important;
  border-radius: 9999px !important;
}

/* ✅ AFTER: Clean, intentional, scoped */
.my-brand ds-button {
  --button-padding-x: 20px;
  --button-padding-y: 12px;
  --button-border-radius: var(--ds-radius-full);
}
```

### Impact Criteria

| Metric | How to Measure | Target |
|--------|----------------|--------|
| !important usage | Grep consumer codebases | 80% reduction |
| Component forks | Track teams that copy components | 50% reduction |
| Customization docs | Questions about "how to customize X" | 70% reduction |
| Theme switching bugs | Issues from global token changes | Near zero |

### Scores

| Criterion | Score | Reasoning |
|-----------|-------|-----------|
| DX Impact | 4/5 | Huge improvement for customization |
| User Impact | 2/5 | Indirect via better maintained code |
| Differentiation | 4/5 | Similar to Chakra recipes but CSS-native |
| Effort | M | New API, build tooling, docs |
| Breaking | No | Additive change |

**Priority**: MEDIUM - Good impact but requires tooling work

---

## IDEA-003: AI Skepticism Protocol

### Problem

**Scenario**: You ask an AI assistant to help refactor a component. It confidently suggests:

> "I recommend extracting this into a custom hook for better reusability."

You implement it. Later you realize:
- The hook is only used in one place
- It added complexity without benefit
- The AI was optimizing for a pattern it "likes" rather than actual need

**What happens today:**
- AI suggestions sound confident regardless of certainty
- Developers trust AI recommendations without scrutiny
- Over-engineering accumulates because AI loves abstractions
- Bugs slip through because AI doesn't highlight its own blind spots

**Root cause**: AI assistants have documented biases:
- **Completion bias**: Tendency to provide an answer even when uncertain
- **Solution bias**: Preference for action over "do nothing"
- **Confirmation bias**: Agreeing with the approach implied by the question

### Observation

DesignerPunk mandates a "skepticism protocol" for AI collaboration:

1. Every recommendation must include counter-arguments
2. Risks presented before benefits
3. Assumptions explicitly stated
4. Evidence required for claims

This isn't about distrusting AI - it's about building *trustworthy* AI collaboration through transparency.

### Proposal

Add to CLAUDE.md:

```markdown
## AI Collaboration Protocol

When proposing solutions, you MUST include:

### 1. Counter-Argument (Required)
Every recommendation includes: "HOWEVER, here's why this might be wrong:"
- At least one specific technical concern
- Potential edge cases or failure modes
- Alternative approaches that might be better

### 2. Risk-First Ordering
Present information in this order:
1. What could go wrong
2. What assumptions you're making
3. What the benefits are
4. Recommendation

### 3. Evidence Citations
Support recommendations with specific references:
- File paths and line numbers
- Documentation links
- Test results or benchmarks

### 4. Confidence Indicator
Rate your confidence: HIGH / MEDIUM / LOW
- HIGH: I've seen this exact pattern work, evidence is clear
- MEDIUM: This should work based on my understanding
- LOW: This is my best guess, needs validation

### Example

❌ BAD (overconfident, no caveats):
"You should use createFocusTrap() for the modal focus management."

✅ GOOD (transparent, evidence-based):
"I recommend using createFocusTrap() for the modal.

**HOWEVER, here's why this might be wrong:**
- The native <dialog> element may already handle focus trapping
- Adding a second trap could cause focus conflicts
- I haven't verified how this interacts with the existing implementation

**Assumptions I'm making:**
- The modal needs programmatic focus control
- Native dialog focus behavior is insufficient

**Evidence:**
- packages/primitives-dom/src/focus/focus-trap.ts exists and is used by Sheet
- packages/wc/src/components/dialog/dialog.ts:45 shows current focus handling

**Confidence:** MEDIUM - pattern is sound but integration needs verification"
```

### Impact Criteria

| Metric | How to Measure | Target |
|--------|----------------|--------|
| Reverted AI suggestions | PRs where AI code was later removed | 50% reduction |
| Over-engineering | Abstractions added then simplified | Track in retros |
| Bug rate from AI code | Bugs traced to AI suggestions | 30% reduction |
| PR review efficiency | Time spent questioning AI suggestions | Faster reviews |

### Scores

| Criterion | Score | Reasoning |
|-----------|-------|-----------|
| DX Impact | 3/5 | Better AI collaboration |
| User Impact | 2/5 | Indirect via code quality |
| Differentiation | 3/5 | Novel but not user-facing |
| Effort | S | Documentation only |
| Breaking | No | Process change |

**Priority**: MEDIUM - Quick win, improves AI-assisted development

---

## IDEA-004: Semantic Component Naming

### Problem

**Scenario**: A new developer needs to find "that dropdown thing for selecting options."

They search the docs:
- `ds-select`? `ds-dropdown`? `ds-menu`? `ds-combobox`?
- What's the difference between `ds-dropdown-menu` and `ds-select`?
- Is `ds-context-menu` related to `ds-menu`?

**What happens today:**
- Component names are flat and don't indicate relationships
- Similar components aren't discoverable together
- AI can't infer component families from names

### Observation

DesignerPunk uses hierarchical naming: `[Family]-[Type]-[Variant]`
- `Form-Input-Text`, `Form-Input-Email` - clearly related
- `Overlay-Dialog`, `Overlay-Sheet` - clearly related

### Proposal

Rename components to indicate family relationships:

| Current | Proposed | Family |
|---------|----------|--------|
| ds-button | ds-action-button | action |
| ds-link | ds-action-link | action |
| ds-input | ds-form-input | form |
| ds-select | ds-form-select | form |
| ds-dialog | ds-overlay-dialog | overlay |
| ds-sheet | ds-overlay-sheet | overlay |
| ds-toast | ds-feedback-toast | feedback |
| ds-alert | ds-feedback-alert | feedback |

### Why NOT To Do This

**This is a breaking change with high migration cost:**
- Every consumer must update every component reference
- Documentation, tutorials, blog posts all become outdated
- The benefit (discoverability) can be achieved through docs organization

**Alternative**: Keep current names, add family groupings in documentation and TypeScript types.

### Scores

| Criterion | Score | Reasoning |
|-----------|-------|-----------|
| DX Impact | 3/5 | Better organization |
| User Impact | 1/5 | No end-user benefit |
| Differentiation | 2/5 | Nice but not compelling |
| Effort | XL | Breaking change, massive migration |
| Breaking | Yes | Every component renamed |

**Priority**: LOW - Cost far exceeds benefit. Document families instead.

---

## IDEA-005: Relationship-Based Color Semantics

### Problem

**Scenario**: A developer is building a page with multiple buttons:
- A primary "Submit" button
- A secondary "Cancel" button
- A tertiary "Skip" link
- A destructive "Delete" button

Current tokens tell them *what* but not *why*:
```css
--ds-color-primary
--ds-color-secondary
--ds-color-destructive
--ds-color-muted
```

**Questions they face:**
- Is "secondary" for Cancel or for less important primary actions?
- When do I use "muted" vs "secondary"?
- How do I create visual hierarchy beyond primary/secondary?

**What happens today:**
- Inconsistent button emphasis across the app
- Visual hierarchy is accidental, not intentional
- New team members can't infer the system from token names

### Observation

Visual design is fundamentally about **hierarchy** - guiding the eye to what matters most. Current tokens describe *roles* but not *emphasis levels*.

### Proposal

Add emphasis and hierarchy tokens:

```css
/* ==============================================
   EMPHASIS TOKENS - How much attention should this draw?
   ============================================== */

/* High: Primary calls-to-action, critical information */
/* Example: Submit button, error alert, selected state */
--ds-emphasis-high: var(--ds-color-primary);

/* Medium: Secondary actions, supporting information */
/* Example: Cancel button, info alert, hover state */
--ds-emphasis-medium: var(--ds-color-secondary);

/* Low: Tertiary actions, supplementary information */
/* Example: "Learn more" link, timestamps, metadata */
--ds-emphasis-low: var(--ds-color-muted-foreground);

/* Minimal: Barely visible, appears on interaction */
/* Example: Ghost buttons, placeholder text */
--ds-emphasis-minimal: var(--ds-color-muted);


/* ==============================================
   SURFACE TOKENS - Visual depth/layering
   ============================================== */

/* Base: The default page background */
--ds-surface-base: var(--ds-color-background);

/* Raised: Cards, panels that sit above base */
--ds-surface-raised: var(--ds-color-card);

/* Overlay: Popovers, dropdowns, modals */
--ds-surface-overlay: var(--ds-color-popover);

/* Sunken: Inset areas, wells, code blocks */
--ds-surface-sunken: var(--ds-color-muted);


/* ==============================================
   CONTENT TOKENS - Text/icon hierarchy
   ============================================== */

/* Primary: Main headings, important text */
--ds-content-primary: var(--ds-color-foreground);

/* Secondary: Body text, descriptions */
--ds-content-secondary: var(--ds-color-muted-foreground);

/* Tertiary: Captions, timestamps, metadata */
--ds-content-tertiary: var(--ds-color-muted-foreground); /* lighter */

/* Disabled: Inactive elements */
--ds-content-disabled: var(--ds-color-disabled);
```

### Before/After Example

**Scenario**: A confirmation dialog with multiple actions

```tsx
// ❌ BEFORE: Role-based, doesn't express hierarchy
<Dialog>
  <DialogTitle>Delete account?</DialogTitle>
  <DialogDescription>This cannot be undone.</DialogDescription>
  <DialogFooter>
    <Button variant="ghost">Learn more</Button>     {/* Why ghost? */}
    <Button variant="secondary">Cancel</Button>     {/* Is this less important than primary? */}
    <Button variant="destructive">Delete</Button>   {/* This is the focus */}
  </DialogFooter>
</Dialog>

// ✅ AFTER: Emphasis is explicit
<Dialog>
  <DialogTitle>Delete account?</DialogTitle>
  <DialogDescription>This cannot be undone.</DialogDescription>
  <DialogFooter>
    <Button emphasis="minimal">Learn more</Button>   {/* Barely visible, discoverable */}
    <Button emphasis="medium">Cancel</Button>        {/* Clear secondary option */}
    <Button emphasis="high" intent="destructive">Delete</Button>  {/* Primary focus, dangerous */}
  </DialogFooter>
</Dialog>
```

### Impact Criteria

| Metric | How to Measure | Target |
|--------|----------------|--------|
| Visual hierarchy consistency | Audit button usage across apps | Consistent patterns |
| Design handoff clarity | Designer feedback on implementation | "Matches design" rate up |
| Accessibility | Automated contrast checking by level | Guaranteed WCAG by tier |
| Developer decision time | Time to choose button variant | 50% reduction |

### Scores

| Criterion | Score | Reasoning |
|-----------|-------|-----------|
| DX Impact | 4/5 | Clearer mental model for hierarchy |
| User Impact | 4/5 | Better visual hierarchy = better UX |
| Differentiation | 4/5 | Unique approach to color semantics |
| Effort | M | Token additions, component API updates |
| Breaking | No | Additive, can coexist with current tokens |

**Priority**: HIGH - Meaningful UX improvement, moderate effort

---

## IDEA-006: Concept-Based Documentation (AI-Optimized)

### Problem

**Scenario**: An AI assistant is helping build a custom modal. It reads the Dialog MDX docs:

```tsx
// From docs
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

The AI copies this pattern exactly. But:
- What if the new modal doesn't need a trigger?
- What if it needs different focus behavior?
- The AI learned the *implementation* but not the *concept*

**What happens today:**
- AI pattern-matches on code examples
- Variations from examples cause confusion
- AI doesn't understand *why* the code is structured this way

**Root cause**: Code examples teach "what to type" but not "what to think."

### Observation

DesignerPunk uses "contamination prevention" - concept-based docs without implementation details, so AI learns the behavior contract rather than specific code patterns.

### Proposal

Add a secondary documentation format focused on concepts:

```markdown
## Dialog: Behavior Contract

### Purpose
A Dialog interrupts the user's workflow to request information or confirmation.
It demands attention and blocks interaction with content behind it.

### Focus Behavior
- On open: Focus moves to the first focusable element inside the dialog
- On close: Focus returns to the element that triggered the dialog
- While open: Focus is trapped - Tab cycles only through dialog content
- Exception: If `initialFocus` is specified, focus that element instead

### Dismissal Behavior
- Escape key: Always closes the dialog
- Click outside: Closes by default, disable with `modal={true}`
- Programmatic: Call `close()` method or set `open={false}`

### Accessibility Contract
- Role: `dialog` (or `alertdialog` for confirmations)
- Required: `aria-labelledby` pointing to title element
- Optional: `aria-describedby` pointing to description
- Announce: Title is announced to screen readers on open

### States
- closed → opening → open → closing → closed
- Opening/closing states enable animations

### Anti-patterns
- Don't nest dialogs (use a single dialog with changing content)
- Don't auto-open dialogs on page load (disorienting)
- Don't use for non-blocking information (use Toast instead)
```

**When to use which:**
- **Code examples**: Human developers learning the API
- **Concept docs**: AI assistants understanding behavior contracts

### Impact Criteria

| Metric | How to Measure | Target |
|--------|----------------|--------|
| AI implementation accuracy | Test AI with concept-only context | Higher correctness |
| Novel use cases | AI handling of non-standard requirements | Better adaptation |
| Documentation maintenance | Example staleness over time | Lower maintenance |

### Scores

| Criterion | Score | Reasoning |
|-----------|-------|-----------|
| DX Impact | 2/5 | Niche benefit for AI workflows |
| User Impact | 1/5 | No direct user benefit |
| Differentiation | 3/5 | Novel approach |
| Effort | L | Dual documentation system |
| Breaking | No | Additive |

**Priority**: LOW - Interesting research direction but uncertain ROI

---

## Summary

### Recommended for Implementation

| Priority | ID | Idea | Effort | First Step |
|----------|-----|------|--------|------------|
| 🔴 High | IDEA-001 | Hierarchical Spacing | S | Draft token schema |
| 🔴 High | IDEA-005 | Emphasis Color Tokens | M | Draft token schema |
| 🟡 Medium | IDEA-003 | AI Skepticism Protocol | S | Update CLAUDE.md |
| 🟡 Medium | IDEA-002 | Component Token Layer | M | Design API |

### Not Recommended

| ID | Idea | Reason |
|----|------|--------|
| IDEA-004 | Semantic Naming | Breaking change, document families instead |
| IDEA-006 | Concept Docs | Uncertain benefit, research later |

### Suggested Approach

1. **Quick win**: Add IDEA-003 (AI Protocol) to CLAUDE.md now
2. **Combined spec**: Create "Semantic Token Enhancement" spec combining IDEA-001 + IDEA-005
3. **Future**: Evaluate IDEA-002 after semantic tokens are adopted
