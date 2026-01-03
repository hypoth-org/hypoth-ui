#!/usr/bin/env npx tsx
/**
 * AST-based enforcement script to detect side-effect customElements.define() calls.
 *
 * This script scans TypeScript/JavaScript files for top-level customElements.define()
 * calls that happen at module load time (i.e., as side effects). Such calls can cause
 * double-registration errors and prevent proper tree-shaking.
 *
 * @example
 * # Check all component files
 * npx tsx tooling/scripts/check-auto-define.ts --include "packages/wc/src/components/**\/*.ts"
 *
 * # Exclude test files
 * npx tsx tooling/scripts/check-auto-define.ts --include "src/**\/*.ts" --exclude "**\/*.test.ts"
 *
 * # Output as JSON for CI
 * npx tsx tooling/scripts/check-auto-define.ts --format json
 *
 * # GitHub Actions annotation format
 * npx tsx tooling/scripts/check-auto-define.ts --format github
 */

import { Project, SyntaxKind, type SourceFile, type CallExpression } from "ts-morph";
import { glob } from "glob";
import { resolve, relative } from "path";

// Types
interface Violation {
  file: string;
  line: number;
  column: number;
  message: string;
  code: string;
}

interface ScanResult {
  violations: Violation[];
  filesScanned: number;
}

interface CliArgs {
  include: string[];
  exclude: string[];
  format: "text" | "json" | "github";
  help: boolean;
}

// Parse CLI arguments
function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = {
    include: [],
    exclude: [],
    format: "text",
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "--include") {
      const value = args[++i];
      if (value) result.include.push(value);
    } else if (arg === "--exclude") {
      const value = args[++i];
      if (value) result.exclude.push(value);
    } else if (arg === "--format") {
      const value = args[++i] as "text" | "json" | "github";
      if (["text", "json", "github"].includes(value)) {
        result.format = value;
      }
    }
  }

  // Default include pattern
  if (result.include.length === 0) {
    result.include.push("packages/wc/src/**/*.ts");
  }

  // Default exclude patterns - exclude test files but not test fixture directories
  if (result.exclude.length === 0) {
    result.exclude.push("**/*.test.ts", "**/*.spec.ts");
  }

  return result;
}

// Print help message
function printHelp(): void {
  console.log(`
check-auto-define.ts - Detect side-effect customElements.define() calls

USAGE:
  npx tsx tooling/scripts/check-auto-define.ts [OPTIONS]

OPTIONS:
  --include <pattern>   Glob pattern for files to include (can be repeated)
                        Default: "packages/wc/src/**/*.ts"

  --exclude <pattern>   Glob pattern for files to exclude (can be repeated)
                        Default: "**/*.test.ts", "**/*.spec.ts", "**/tests/**"

  --format <format>     Output format: text, json, github
                        Default: text

  --help, -h            Show this help message

EXAMPLES:
  # Check all component files
  npx tsx tooling/scripts/check-auto-define.ts --include "packages/wc/src/components/**/*.ts"

  # Exclude test files
  npx tsx tooling/scripts/check-auto-define.ts --exclude "**/*.test.ts"

  # Output as JSON for CI
  npx tsx tooling/scripts/check-auto-define.ts --format json

  # GitHub Actions annotation format
  npx tsx tooling/scripts/check-auto-define.ts --format github

EXIT CODES:
  0 - No violations found
  1 - Violations found or error occurred
`);
}

/**
 * Check if a call expression is a customElements.define() call
 */
function isCustomElementsDefineCall(call: CallExpression): boolean {
  const expression = call.getExpression();

  // Check for customElements.define(...)
  if (expression.getKind() === SyntaxKind.PropertyAccessExpression) {
    const text = expression.getText();
    return text === "customElements.define" || text === "window.customElements.define";
  }

  return false;
}

/**
 * Check if a call expression is at the top level of the module (side effect)
 */
function isTopLevelCall(call: CallExpression): boolean {
  let parent = call.getParent();

  while (parent) {
    const kind = parent.getKind();

    // If we find a function, method, or class, it's not a top-level call
    if (
      kind === SyntaxKind.FunctionDeclaration ||
      kind === SyntaxKind.FunctionExpression ||
      kind === SyntaxKind.ArrowFunction ||
      kind === SyntaxKind.MethodDeclaration ||
      kind === SyntaxKind.Constructor ||
      kind === SyntaxKind.GetAccessor ||
      kind === SyntaxKind.SetAccessor
    ) {
      return false;
    }

    // If we reach the source file, it's a top-level call
    if (kind === SyntaxKind.SourceFile) {
      return true;
    }

    parent = parent.getParent();
  }

  return true;
}

/**
 * Scan a source file for violations
 */
export function scanFile(sourceFile: SourceFile): Violation[] {
  const violations: Violation[] = [];
  const filePath = sourceFile.getFilePath();

  // Get all call expressions in the file
  const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);

  for (const call of callExpressions) {
    if (isCustomElementsDefineCall(call) && isTopLevelCall(call)) {
      const line = call.getStartLineNumber();
      const column = call.getStartLinePos();
      const code = call.getText();

      violations.push({
        file: filePath,
        line,
        column,
        message: "Top-level customElements.define() call detected. Use the registry pattern instead.",
        code,
      });
    }
  }

  return violations;
}

/**
 * Scan a single file for auto-define violations
 */
export function checkFile(filePath: string): Violation[] {
  const project = new Project({
    skipAddingFilesFromTsConfig: true,
  });

  const sourceFile = project.addSourceFileAtPath(filePath);
  return scanFile(sourceFile);
}

/**
 * Scan multiple files for violations
 */
export function scanForAutoDefine(patterns: string[], excludePatterns: string[]): ScanResult {
  const project = new Project({
    skipAddingFilesFromTsConfig: true,
  });

  // Collect all files matching patterns
  const files: string[] = [];
  for (const pattern of patterns) {
    const matches = glob.sync(pattern, {
      ignore: excludePatterns,
      absolute: true,
    });
    files.push(...matches);
  }

  // Deduplicate files
  const uniqueFiles = [...new Set(files)];

  // Add files to project
  for (const file of uniqueFiles) {
    project.addSourceFileAtPath(file);
  }

  // Scan all files
  const violations: Violation[] = [];
  for (const sourceFile of project.getSourceFiles()) {
    violations.push(...scanFile(sourceFile));
  }

  return {
    violations,
    filesScanned: uniqueFiles.length,
  };
}

// Formatters
function formatText(result: ScanResult, rootDir: string): string {
  if (result.violations.length === 0) {
    return `✓ No auto-define violations found (${result.filesScanned} files scanned)`;
  }

  const lines: string[] = [
    `✗ Found ${result.violations.length} auto-define violation(s):`,
    "",
  ];

  for (const v of result.violations) {
    const relPath = relative(rootDir, v.file);
    lines.push(`  ${relPath}:${v.line}:${v.column}`);
    lines.push(`    ${v.message}`);
    lines.push(`    Code: ${v.code.substring(0, 80)}${v.code.length > 80 ? "..." : ""}`);
    lines.push("");
  }

  return lines.join("\n");
}

function formatJson(result: ScanResult, rootDir: string): string {
  const output = {
    success: result.violations.length === 0,
    filesScanned: result.filesScanned,
    violationCount: result.violations.length,
    violations: result.violations.map((v) => ({
      ...v,
      file: relative(rootDir, v.file),
    })),
  };

  return JSON.stringify(output, null, 2);
}

function formatGitHub(result: ScanResult, rootDir: string): string {
  if (result.violations.length === 0) {
    return "";
  }

  // GitHub Actions annotation format
  // ::error file={name},line={line},col={col}::{message}
  return result.violations
    .map((v) => {
      const relPath = relative(rootDir, v.file);
      return `::error file=${relPath},line=${v.line},col=${v.column}::${v.message}`;
    })
    .join("\n");
}

// Main execution
async function main(): Promise<void> {
  const args = parseArgs();

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const rootDir = process.cwd();
  const result = scanForAutoDefine(args.include, args.exclude);

  let output: string;
  switch (args.format) {
    case "json":
      output = formatJson(result, rootDir);
      break;
    case "github":
      output = formatGitHub(result, rootDir);
      break;
    default:
      output = formatText(result, rootDir);
  }

  console.log(output);

  // Exit with error code if violations found
  if (result.violations.length > 0) {
    process.exit(1);
  }
}

// Run if executed directly
main().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
