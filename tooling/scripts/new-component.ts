#!/usr/bin/env tsx
/**
 * Component Generator Script
 *
 * Creates a new component with all required files:
 * - Web Component (packages/wc)
 * - React wrapper (packages/react)
 * - Manifest (packages/docs-content)
 * - MDX documentation (packages/docs-content)
 *
 * Usage: pnpm new-component <component-name>
 * Example: pnpm new-component card
 */

import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const ROOT_DIR = join(dirname(new URL(import.meta.url).pathname), "../..");

interface ComponentConfig {
  name: string; // kebab-case: "my-component"
  className: string; // PascalCase: "MyComponent"
  tagName: string; // ds-my-component
  category: string;
  description: string;
}

function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function generateWebComponent(config: ComponentConfig): string {
  return `import { html, css } from "lit";
import { property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.js";
import { define } from "../../registry/define.js";

export type ${config.className}Variant = "default" | "outlined";

/**
 * ${config.description}
 *
 * @element ${config.tagName}
 * @slot default - Content slot
 */
export class Ds${config.className} extends LightElement {
  /** Visual variant */
  @property({ type: String, reflect: true })
  variant: ${config.className}Variant = "default";

  /** Disabled state */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  override render() {
    return html\`
      <div
        class="${config.tagName}"
        part="container"
        ?data-disabled=\${this.disabled}
        data-variant=\${this.variant}
      >
        <slot></slot>
      </div>
    \`;
  }
}

define("${config.tagName}", Ds${config.className});

declare global {
  interface HTMLElementTagNameMap {
    "${config.tagName}": Ds${config.className};
  }
}
`;
}

function generateComponentCSS(config: ComponentConfig): string {
  return `/**
 * ${config.className} Component Styles
 */

@layer components {
  ${config.tagName} {
    display: block;
  }

  .${config.tagName} {
    padding: var(--ds-spacing-component-padding-md);
    border-radius: var(--ds-radius-md);
    background: var(--ds-color-background-default);
    border: 1px solid var(--ds-color-border-default);
  }

  .${config.tagName}[data-variant="outlined"] {
    background: transparent;
  }

  .${config.tagName}[data-disabled] {
    opacity: 0.5;
    pointer-events: none;
  }
}
`;
}

function generateReactWrapper(config: ComponentConfig): string {
  return `import React, {
  forwardRef,
  useEffect,
  useRef,
  createElement,
  type HTMLAttributes,
} from "react";

export type ${config.className}Variant = "default" | "outlined";

export interface ${config.className}Props extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Visual variant */
  variant?: ${config.className}Variant;
  /** Disabled state */
  disabled?: boolean;
  /** Content */
  children?: React.ReactNode;
}

/**
 * React wrapper for ${config.tagName} Web Component.
 */
export const ${config.className} = forwardRef<HTMLElement, ${config.className}Props>((props, forwardedRef) => {
  const {
    variant = "default",
    disabled = false,
    children,
    className,
    ...rest
  } = props;

  const internalRef = useRef<HTMLElement>(null);

  // Merge refs
  useEffect(() => {
    if (typeof forwardedRef === "function") {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = internalRef.current;
    }
  }, [forwardedRef]);

  return createElement(
    "${config.tagName}",
    {
      ref: internalRef,
      variant,
      disabled: disabled || undefined,
      class: className,
      ...rest,
    },
    children
  );
});

${config.className}.displayName = "${config.className}";
`;
}

function generateManifest(config: ComponentConfig): string {
  return JSON.stringify(
    {
      $schema: "../../../specs/001-design-system/contracts/component-manifest.schema.json",
      id: config.name,
      name: config.className,
      description: config.description,
      status: "alpha",
      since: "0.1.0",
      availabilityTags: ["public"],
      platforms: ["wc", "react"],
      a11y: {
        role: "region",
        keyboardInteractions: [],
        ariaAttributes: [],
        focusManagement: "None required",
      },
      tokensUsed: [
        "color.background.default",
        "color.border.default",
        "spacing.component.padding.md",
        "radius.md",
      ],
      props: [
        {
          name: "variant",
          type: "'default' | 'outlined'",
          default: "'default'",
          description: "Visual variant",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Whether the component is disabled",
        },
      ],
      events: [],
      examples: [
        {
          title: "Default",
          code: `<${config.tagName}>Content here</${config.tagName}>`,
        },
        {
          title: "Outlined",
          code: `<${config.tagName} variant="outlined">Content here</${config.tagName}>`,
        },
      ],
      recommendedUsage: [`Use for ${config.description.toLowerCase()}`],
      antiPatterns: ["Don't nest multiple ${config.name} components"],
      relatedComponents: [],
      category: config.category,
    },
    null,
    2
  );
}

function generateMDX(config: ComponentConfig): string {
  return `---
title: ${config.className}
description: ${config.description}
componentId: ${config.name}
category: ${config.category}
order: 1
---

# ${config.className}

${config.description}

## Usage

\`\`\`html
<${config.tagName}>Content here</${config.tagName}>
\`\`\`

### React

\`\`\`tsx
import { ${config.className} } from "@ds/react";

function MyComponent() {
  return <${config.className}>Content here</${config.className}>;
}
\`\`\`

## Variants

### Default

\`\`\`html
<${config.tagName}>Default variant</${config.tagName}>
\`\`\`

### Outlined

\`\`\`html
<${config.tagName} variant="outlined">Outlined variant</${config.tagName}>
\`\`\`

## States

### Disabled

\`\`\`html
<${config.tagName} disabled>Disabled state</${config.tagName}>
\`\`\`

## Accessibility

- Uses semantic markup
- Respects disabled state

## Best Practices

### Do

- Use for ${config.description.toLowerCase()}
- Provide meaningful content

### Don't

- Don't nest multiple ${config.name} components
`;
}

async function ensureDir(dir: string): Promise<void> {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function writeFileIfNotExists(path: string, content: string): Promise<boolean> {
  if (existsSync(path)) {
    return false;
  }
  await ensureDir(dirname(path));
  await writeFile(path, content, "utf-8");
  return true;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error("Usage: pnpm new-component <component-name>");
    console.error("Example: pnpm new-component card");
    process.exit(1);
  }

  const name = args[0]?.toLowerCase().replace(/[^a-z0-9-]/g, "-") ?? "";
  const category = args[1] || "layout";
  const description = args[2] || `A ${toPascalCase(name)} component`;

  const config: ComponentConfig = {
    name,
    className: toPascalCase(name),
    tagName: `ds-${name}`,
    category,
    description,
  };

  // Create Web Component
  const wcDir = join(ROOT_DIR, "packages/wc/src/components", name);
  await writeFileIfNotExists(join(wcDir, `${name}.ts`), generateWebComponent(config));
  await writeFileIfNotExists(join(wcDir, `${name}.css`), generateComponentCSS(config));

  // Create React wrapper
  await writeFileIfNotExists(
    join(ROOT_DIR, "packages/react/src/components", `${name}.tsx`),
    generateReactWrapper(config)
  );

  // Create manifest
  await writeFileIfNotExists(
    join(ROOT_DIR, "packages/docs-content/manifests", `${name}.json`),
    generateManifest(config)
  );

  // Create MDX documentation
  await writeFileIfNotExists(
    join(ROOT_DIR, "packages/docs-content/components", `${name}.mdx`),
    generateMDX(config)
  );
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
