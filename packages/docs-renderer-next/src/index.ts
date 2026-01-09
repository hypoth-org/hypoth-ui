// Re-export docs-core utilities
export * from "@ds/docs-core";

// Export component paths for external use
export const COMPONENTS_PATH = "./components";
export const STYLES_PATH = "./styles";

// Export documentation components
export { SearchInput, type SearchInputProps } from "../components/search/search-input";
export { LiveExample, CodeBlock, type LiveExampleProps, type CodeBlockProps } from "../components/live-example";
