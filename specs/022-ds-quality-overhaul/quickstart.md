# Quickstart: Design System Quality Overhaul

**Feature**: 022-ds-quality-overhaul
**Date**: 2026-01-09
**Phase**: 1 (Design)

This guide provides quick implementation examples for the new features introduced in this overhaul.

---

## 1. Style Props (React Only)

Style props enable Chakra-like inline styling with design token integration.

### Basic Usage

```tsx
import { Box, Flex, Text } from "@ds/react";

function Card() {
  return (
    <Box
      p={4}
      bg="neutral.2"
      rounded="lg"
      borderColor="neutral.6"
      border="default"
    >
      <Text fontSize="lg" fontWeight="semibold" color="neutral.12">
        Card Title
      </Text>
      <Text fontSize="sm" color="neutral.11">
        Card description text
      </Text>
    </Box>
  );
}
```

### Responsive Syntax

```tsx
function ResponsiveLayout() {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      gap={{ base: 2, md: 4 }}
      p={{ base: 4, lg: 8 }}
    >
      <Box w={{ base: "full", md: "1/3" }}>Sidebar</Box>
      <Box w={{ base: "full", md: "2/3" }}>Main Content</Box>
    </Flex>
  );
}
```

### Grid Layout

```tsx
function GridExample() {
  return (
    <Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
      <Box bg="primary.3" p={4}>Item 1</Box>
      <Box bg="primary.3" p={4}>Item 2</Box>
      <Box bg="primary.3" p={4}>Item 3</Box>
      <Box bg="primary.3" p={4}>Item 4</Box>
    </Grid>
  );
}
```

---

## 2. 16-Step Color Scales

Access colors by step number for precise control over contrast, hierarchy, and surface layering.

### Step Reference

| Steps | Usage |
|-------|-------|
| 1-4 | Backgrounds (page, card, nested, deep nested) |
| 5-7 | Interactive backgrounds (element, hover, active) |
| 8-10 | Borders (subtle, default, strong/focus) |
| 11-14 | Solid colors (default, hover, active, emphasis) |
| 15-16 | Text (muted, default) |

### React Usage

```tsx
// Layered surfaces (the key benefit of 16-step!)
<Box bg="neutral.1">                    {/* Page */}
  <Box bg="neutral.2" p={4}>            {/* Card */}
    <Box bg="neutral.3" p={3}>          {/* Nested card */}
      <Box bg="neutral.4" p={2}>        {/* Deep nested */}
        Four levels of layering!
      </Box>
    </Box>
  </Box>
</Box>

// Semantic color aliases
<Box bg="primary.subtle">Subtle primary background (step 2)</Box>
<Box bg="primary.default">Solid primary background (step 11)</Box>
<Text color="primary.muted">Muted primary text (step 15)</Text>
<Text color="neutral.16">Default body text</Text>

// Direct step access
<Box bg="blue.5">Blue element background</Box>
<Box borderColor="blue.9">Blue default border</Box>
```

### CSS Variables

```css
.custom-component {
  background: var(--ds-color-primary-2);   /* subtle bg */
  border-color: var(--ds-color-primary-9); /* default border */
  color: var(--ds-color-primary-16);       /* text */
}

.button-primary {
  background: var(--ds-color-primary-11);  /* solid default */
  color: var(--ds-color-primary-foreground);
}

.button-primary:hover {
  background: var(--ds-color-primary-12);  /* solid hover */
}

.button-primary:active {
  background: var(--ds-color-primary-13);  /* solid active */
}

/* Layered card example */
.page { background: var(--ds-color-neutral-1); }
.card { background: var(--ds-color-neutral-2); }
.nested-card { background: var(--ds-color-neutral-3); }
.deep-nested { background: var(--ds-color-neutral-4); }
```

---

## 3. Theme Provider (Color Mode + Density)

The `ThemeProvider` is the root wrapper that manages both color mode (light/dark) and density (compact/default/spacious). It handles persistence and SSR.

### Basic Setup

```tsx
// app/providers.tsx
"use client";

import { ThemeProvider } from "@ds/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      defaultColorMode="system"
      defaultDensity="default"
      storageStrategy="localStorage"
    >
      {children}
    </ThemeProvider>
  );
}

// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### SSR-Safe Setup (Next.js App Router)

For SSR, use cookies to avoid hydration mismatch:

```tsx
// app/layout.tsx
import { cookies } from "next/headers";
import { ThemeProvider, parseThemeCookie, getThemeScript } from "@ds/react";

export default function RootLayout({ children }) {
  const cookieStore = cookies();
  const themePrefs = parseThemeCookie(cookieStore.get("ds-theme")?.value);

  return (
    <html
      data-color-mode={themePrefs.colorMode ?? "system"}
      data-density={themePrefs.density ?? "default"}
    >
      <head>
        {/* Prevents flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: getThemeScript({ storageKey: "ds-theme" }),
          }}
        />
      </head>
      <body>
        <ThemeProvider storageStrategy="cookie" ssrValues={themePrefs}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Theme Toggle Component

```tsx
import { useTheme } from "@ds/react";

function ThemeToggle() {
  const { colorMode, setColorMode, density, setDensity } = useTheme();

  return (
    <div className="settings">
      <label>
        Color Mode
        <select
          value={colorMode}
          onChange={(e) => setColorMode(e.target.value as ColorMode)}
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>

      <label>
        Density
        <select
          value={density}
          onChange={(e) => setDensity(e.target.value as DensityMode)}
        >
          <option value="compact">Compact</option>
          <option value="default">Default</option>
          <option value="spacious">Spacious</option>
        </select>
      </label>
    </div>
  );
}
```

### Nested Density Override

Use `DensityProvider` for local overrides within a section:

```tsx
import { ThemeProvider, DensityProvider } from "@ds/react";

function App() {
  return (
    <ThemeProvider defaultDensity="default">
      <MainLayout>
        {/* Sidebar uses compact density */}
        <DensityProvider density="compact">
          <Sidebar />
        </DensityProvider>
        {/* Main content uses default density */}
        <MainContent />
      </MainLayout>
    </ThemeProvider>
  );
}
```

### Controlled Mode (External State)

For full control (e.g., Redux, Zustand):

```tsx
function App() {
  const { colorMode, setColorMode, density, setDensity } = useMyStore();

  return (
    <ThemeProvider
      colorMode={colorMode}
      onColorModeChange={setColorMode}
      density={density}
      onDensityChange={setDensity}
      storageStrategy="none"
    >
      <App />
    </ThemeProvider>
  );
}
```

### CSS Integration

Components automatically respond via CSS variables and data attributes:

```css
.my-component {
  /* Density-aware spacing */
  padding: var(--ds-spacing-4);
  gap: var(--ds-spacing-2);
}

/* Color mode-aware (optional - CSS vars auto-switch) */
[data-color-mode="dark"] .my-component {
  background: var(--ds-color-neutral-2);
}
```

### Integration with next-themes

If you're already using `next-themes` for color mode, use `disableColorMode` to avoid conflicts:

```tsx
// app/providers.tsx
"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ThemeProvider as DSProvider } from "@ds/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <DSProvider
        disableColorMode                      // next-themes handles color mode
        externalColorModeAttribute="data-theme"
        defaultDensity="default"
      >
        {children}
      </DSProvider>
    </NextThemeProvider>
  );
}
```

Use both hooks together in settings:

```tsx
import { useTheme as useNextTheme } from "next-themes";
import { useTheme as useDSTheme } from "@ds/react";

function Settings() {
  const { theme, setTheme } = useNextTheme();       // Color mode
  const { density, setDensity } = useDSTheme();     // Density

  // Render your settings UI...
}
```

---

## 4. Standardized Events

Consistent event naming across all components.

### React Callbacks

```tsx
// Button - press events
<Button onPress={(e) => console.log("Pressed!", e.isKeyboard)}>
  Click Me
</Button>

// Select - value change events
<Select
  onValueChange={(value) => setSelected(value)}
  onOpenChange={(open) => console.log("Menu:", open ? "opened" : "closed")}
>
  {/* options */}
</Select>

// Dialog - open change events
<Dialog
  onOpenChange={(open, { reason }) => {
    if (reason === "escape") {
      console.log("User pressed Escape");
    }
  }}
>
  {/* content */}
</Dialog>

// Tree - expansion events
<Tree
  onExpandedChange={({ key, expanded }) => {
    console.log(`${key} is now ${expanded ? "expanded" : "collapsed"}`);
  }}
>
  {/* items */}
</Tree>
```

### Web Component Events

```ts
// Listen to custom events with ds: prefix
button.addEventListener("ds:press", (e) => {
  console.log("Pressed!", e.detail.isKeyboard);
});

select.addEventListener("ds:change", (e) => {
  console.log("New value:", e.detail.value);
});

dialog.addEventListener("ds:open-change", (e) => {
  console.log("Open:", e.detail.open, "Reason:", e.detail.reason);
});
```

---

## 5. SSR-Safe IDs

Use the `useStableId` hook for hydration-safe ID generation.

### Basic Usage

```tsx
import { useStableId } from "@ds/react";

function FormField({ label, children }) {
  const id = useStableId();

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {cloneElement(children, { id })}
    </div>
  );
}
```

### Multiple Related IDs

```tsx
import { useStableIds } from "@ds/react";

function CustomDialog({ title, description, children }) {
  const ids = useStableIds(["title", "description", "content"]);

  return (
    <div
      role="dialog"
      aria-labelledby={ids.title}
      aria-describedby={ids.description}
    >
      <h2 id={ids.title}>{title}</h2>
      <p id={ids.description}>{description}</p>
      <div id={ids.content}>{children}</div>
    </div>
  );
}
```

---

## 6. Loading States

Built-in loading support for async data components.

### Select with Loading

```tsx
function AsyncSelect() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOptions().then((data) => {
      setOptions(data);
      setLoading(false);
    });
  }, []);

  return (
    <Select loading={loading} onValueChange={handleChange}>
      {options.map((opt) => (
        <SelectItem key={opt.value} value={opt.value}>
          {opt.label}
        </SelectItem>
      ))}
    </Select>
  );
}
```

### Table with Loading

```tsx
function DataTable({ data, loading }) {
  return (
    <Table loading={loading}>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Tree with Node Loading

```tsx
function LazyTree() {
  const [loadingNodes, setLoadingNodes] = useState(new Set());

  const handleExpand = async ({ key }) => {
    if (!loadedChildren.has(key)) {
      setLoadingNodes((prev) => new Set(prev).add(key));
      const children = await fetchChildren(key);
      setLoadedChildren((prev) => new Map(prev).set(key, children));
      setLoadingNodes((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  return (
    <Tree onExpandedChange={handleExpand}>
      {items.map((item) => (
        <TreeItem key={item.id} loading={loadingNodes.has(item.id)}>
          {item.name}
        </TreeItem>
      ))}
    </Tree>
  );
}
```

---

## 7. CLI Copy Command

Copy component source code into your project for full customization.

### Initialize Config

```bash
npx @ds/cli init

# Creates ds.config.json:
# {
#   "outputDir": "components/ui",
#   "alias": "@/components/ui",
#   "style": "css",
#   "typescript": true,
#   "rsc": true
# }
```

### Copy Components

```bash
# Copy a single component
npx @ds/cli copy button

# Output:
# ✓ Created components/ui/button.tsx
# ✓ Created components/ui/button.css

# Copy with dependencies
npx @ds/cli copy dialog
# Dialog requires: Button, Portal. Copy all? (Y/n)
# ✓ Created components/ui/dialog.tsx
# ✓ Created components/ui/dialog.css
# ✓ Created components/ui/button.tsx
# ✓ Created components/ui/button.css
# ✓ Created components/ui/portal.tsx
```

### List Available Components

```bash
npx @ds/cli list

# Output:
# Actions:
#   button, icon-button, toggle, toggle-group
#
# Inputs:
#   input, textarea, select, checkbox, radio...
#
# Overlays:
#   dialog, alert-dialog, popover, tooltip...
```

### Use Copied Components

```tsx
// Import from your local path (not @ds/react)
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

// Full customization - modify the source files directly!
```

---

## 8. Dev Mode Warnings

Get helpful warnings for common mistakes during development.

### Automatic Warnings

```tsx
// Missing accessibility
<Dialog>
  <DialogContent>
    {/* Warning: Missing required ds-dialog-title for accessibility */}
    <p>Content without title!</p>
  </DialogContent>
</Dialog>

// Invalid props
<Button variant="invalid">
  {/* Warning: Invalid variant "invalid" */}
</Button>

// Missing form context
<Input />
{/* Warning: Input is missing an accessible label */}
```

### Console Output

```
[ds-dialog] Missing required ds-dialog-title for accessibility. (DS001)
💡 Add a <ds-dialog-title> element inside the dialog.

[ds-input] Input is missing an accessible label. (DS003)
💡 Add aria-label, aria-labelledby, or wrap in a <ds-field> with <ds-label>.
```

### Disable in Production

Warnings are automatically stripped in production builds via dead code elimination when `NODE_ENV=production`.

---

## Migration Checklist

When upgrading to use these new features:

- [ ] Install updated packages (`pnpm update @ds/react @ds/tokens`)
- [ ] Import new CSS (`@ds/tokens/density.css` for density support)
- [ ] Update event handlers to new naming (e.g., `onClick` → `onPress`)
- [ ] Consider wrapping app in `<DensityProvider>` if using density
- [ ] Run `pnpm build` to compile style props (if using Panda CSS)
- [ ] Test SSR rendering for ID consistency (if using Next.js)
