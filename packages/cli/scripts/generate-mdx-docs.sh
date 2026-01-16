#!/usr/bin/env bash
# generate-mdx-docs.sh - Generate MDX documentation from component manifests

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WC_DIR="$SCRIPT_DIR/../../wc/src/components"
DOCS_DIR="$SCRIPT_DIR/../../docs-content/components"

generate_mdx() {
  local component="$1"
  local display_name="$2"
  local category="$3"
  local order="$4"
  local description="$5"

  local dest_file="$DOCS_DIR/${component}.mdx"

  if [ -f "$dest_file" ]; then
    echo "  EXISTS: $component"
    return
  fi

  # Read manifest for accessibility info
  local manifest="$WC_DIR/$component/manifest.json"
  local a11y_keyboard="Tab"
  local a11y_aria="Standard ARIA patterns"
  local a11y_screen_reader="Follows WAI-ARIA best practices"

  if [ -f "$manifest" ]; then
    a11y_keyboard=$(jq -r '.accessibility.keyboard | if type == "array" then join(", ") else "Tab" end' "$manifest" 2>/dev/null || echo "Tab")
    a11y_aria=$(jq -r '.accessibility.ariaPatterns | if type == "array" then join(", ") else "Standard ARIA patterns" end' "$manifest" 2>/dev/null || echo "Standard ARIA patterns")
    a11y_screen_reader=$(jq -r '.accessibility.screenReader // "Follows WAI-ARIA best practices"' "$manifest" 2>/dev/null || echo "Follows WAI-ARIA best practices")
  fi

  # Convert component name to kebab-case for ds-* tag
  local ds_tag="ds-${component}"

  # Convert to PascalCase for React import
  local pascal_name=$(echo "$display_name" | sed 's/ //g')

  cat > "$dest_file" << EOF
---
title: $display_name
description: $description
component: $component
status: stable
category: $category
order: $order
---

# $display_name

$description

## Usage

### Web Component

\`\`\`html
<$ds_tag>Content</$ds_tag>
\`\`\`

### React

\`\`\`tsx
import { $pascal_name } from "@ds/react";

function Example() {
  return <$pascal_name>Content</$pascal_name>;
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`children\` | \`ReactNode\` | - | Content to display |

## Accessibility

- **Keyboard**: $a11y_keyboard
- **ARIA**: $a11y_aria
- **Screen reader**: $a11y_screen_reader

## Best Practices

### Do

- Follow component-specific guidelines from the design system
- Use semantic markup when possible
- Test with keyboard navigation

### Don't

- Avoid using non-semantic elements where semantic ones exist
- Don't override core accessibility features
- Don't use this component outside its intended context
EOF

  echo "  CREATED: $component"
}

echo "Generating MDX documentation..."
echo "Source: $WC_DIR"
echo "Target: $DOCS_DIR"
echo ""

# Generate MDX for each component
generate_mdx "accordion" "Accordion" "navigation" "10" "Vertically stacked expandable sections for organizing dense content"
generate_mdx "alert" "Alert" "feedback" "1" "Contextual feedback message with status variants"
generate_mdx "alert-dialog" "Alert Dialog" "overlays" "2" "Modal dialog for confirmations requiring explicit user action"
generate_mdx "aspect-ratio" "Aspect Ratio" "layout" "1" "Container that maintains a specified aspect ratio for responsive media"
generate_mdx "avatar" "Avatar" "data-display" "1" "User avatar with image, initials, or fallback icon"
generate_mdx "badge" "Badge" "feedback" "2" "Status indicator with variants and dot mode"
generate_mdx "breadcrumb" "Breadcrumb" "navigation" "1" "Navigation trail showing current location in hierarchy"
generate_mdx "calendar" "Calendar" "forms" "20" "Calendar widget for date selection"
generate_mdx "card" "Card" "data-display" "2" "Container for grouping related content with header, content, and footer"
generate_mdx "collapsible" "Collapsible" "utilities" "1" "Expandable/collapsible content section with animated transitions"
generate_mdx "command" "Command" "overlays" "3" "Command palette with fuzzy search, keyboard navigation, and grouping"
generate_mdx "context-menu" "Context Menu" "overlays" "4" "Right-click context menu with keyboard navigation"
generate_mdx "data-table" "Data Table" "data-display" "3" "Advanced data table with pagination, virtualization, and filtering"
generate_mdx "drawer" "Drawer" "overlays" "5" "Mobile-friendly slide-in panel with swipe-to-dismiss"
generate_mdx "dropdown-menu" "Dropdown Menu" "overlays" "6" "Action menu with checkbox items, radio groups, and keyboard navigation"
generate_mdx "hover-card" "Hover Card" "overlays" "7" "Preview card that appears on hover with configurable delays"
generate_mdx "layout" "Layout" "layout" "2" "Framework-agnostic layout primitives for page composition"
generate_mdx "list" "List" "data-display" "4" "Selectable list with keyboard navigation"
generate_mdx "navigation-menu" "Navigation Menu" "navigation" "2" "Mega-menu style navigation with viewport transitions"
generate_mdx "pagination" "Pagination" "navigation" "3" "Page navigation with previous/next and page number buttons"
generate_mdx "progress" "Progress" "feedback" "3" "Linear and circular progress indicators"
generate_mdx "scroll-area" "Scroll Area" "utilities" "2" "Custom scrollbar container with multiple visibility modes"
generate_mdx "separator" "Separator" "layout" "3" "Visual divider between content sections"
generate_mdx "sheet" "Sheet" "overlays" "8" "Slide-in panel overlay for secondary content and forms"
generate_mdx "skeleton" "Skeleton" "feedback" "4" "Loading placeholder with shimmer animation"
generate_mdx "stepper" "Stepper" "navigation" "4" "Step-by-step progress indicator for multi-step processes"
generate_mdx "table" "Table" "data-display" "5" "Data table with sorting, selection, and sticky headers"
generate_mdx "tabs" "Tabs" "navigation" "5" "Tabbed interface for organizing content into switchable panels"
generate_mdx "tag" "Tag" "feedback" "5" "Removable tag/chip for categories and selections"
generate_mdx "toast" "Toast" "feedback" "6" "Non-blocking notification with auto-dismiss and positioning"
generate_mdx "tree" "Tree" "data-display" "6" "Hierarchical tree view with expand/collapse and selection"

echo ""
echo "MDX generation complete!"
echo "Total MDX files: $(ls "$DOCS_DIR"/*.mdx 2>/dev/null | wc -l | tr -d ' ')"
