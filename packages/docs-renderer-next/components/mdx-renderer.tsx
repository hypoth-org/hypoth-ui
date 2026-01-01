import { compile, run } from "@mdx-js/mdx";
import * as jsxRuntime from "react/jsx-runtime";
import * as jsxDevRuntime from "react/jsx-dev-runtime";
import type { ComponentType, ReactNode } from "react";

// Use the appropriate runtime based on environment
const runtime = process.env.NODE_ENV === "development" ? jsxDevRuntime : jsxRuntime;

interface MdxRendererProps {
  /** MDX source string */
  source: string;
  /** Custom components to use in MDX */
  components?: Record<string, ComponentType<any>>;
}

// Default MDX components
const defaultComponents: Record<string, ComponentType<any>> = {
  // Code blocks with syntax highlighting placeholder
  pre: ({ children, ...props }: { children: ReactNode }) => (
    <pre className="code-block" {...props}>
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }: { children: ReactNode; className?: string }) => {
    const isInline = !className;
    return (
      <code className={isInline ? "code-inline" : className} {...props}>
        {children}
      </code>
    );
  },
  // Table styling
  table: ({ children, ...props }: { children: ReactNode }) => (
    <div className="table-wrapper">
      <table {...props}>{children}</table>
    </div>
  ),
  // Heading anchors
  h1: ({ children, ...props }: { children: ReactNode }) => (
    <h1 {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }: { children: ReactNode }) => {
    const id =
      typeof children === "string"
        ? children.toLowerCase().replace(/\s+/g, "-")
        : undefined;
    return (
      <h2 id={id} {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }: { children: ReactNode }) => {
    const id =
      typeof children === "string"
        ? children.toLowerCase().replace(/\s+/g, "-")
        : undefined;
    return (
      <h3 id={id} {...props}>
        {children}
      </h3>
    );
  },
};

export async function MdxRenderer({ source, components = {} }: MdxRendererProps) {
  const isDev = process.env.NODE_ENV === "development";

  // Compile MDX to JavaScript
  const code = await compile(source, {
    outputFormat: "function-body",
    development: isDev,
  });

  // Run the compiled code with the appropriate runtime
  const { default: MdxContent } = await run(code, {
    ...(isDev ? jsxDevRuntime : jsxRuntime),
    baseUrl: import.meta.url,
  });

  // Merge default and custom components
  const mergedComponents = {
    ...defaultComponents,
    ...components,
  };

  return (
    <div className="mdx-content">
      <MdxContent components={mergedComponents} />
    </div>
  );
}
