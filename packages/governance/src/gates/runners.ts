/**
 * Gate Runners
 *
 * Individual gate check implementations.
 */

import { exec } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { promisify } from "node:util";
import type { GateCheckResult, GateContext, GateRunner } from "./types.js";

const execAsync = promisify(exec);

/**
 * Run a shell command and return the result
 */
async function runCommand(
  command: string,
  cwd: string
): Promise<{ success: boolean; stdout: string; stderr: string }> {
  try {
    const { stdout, stderr } = await execAsync(command, { cwd });
    return { success: true, stdout, stderr };
  } catch (error: any) {
    return {
      success: false,
      stdout: error.stdout ?? "",
      stderr: error.stderr ?? error.message,
    };
  }
}

/**
 * Test coverage gate runner
 * Checks that test coverage meets minimum threshold (80%)
 */
export const testCoverageRunner: GateRunner = async (context) => {
  const start = Date.now();
  const threshold = 80;

  try {
    // Run tests with coverage
    const result = await runCommand("pnpm test:coverage --reporter=json", context.repoRoot);

    if (!result.success) {
      return {
        gate: "test-coverage",
        type: "automated",
        passed: false,
        error: "Test suite failed",
        details: result.stderr,
        durationMs: Date.now() - start,
      };
    }

    // Parse coverage from output (simplified - real impl would read coverage file)
    const coverageMatch = result.stdout.match(/All files\s*\|\s*(\d+\.?\d*)/);
    const coverage = coverageMatch ? parseFloat(coverageMatch[1] ?? "0") : 0;

    const passed = coverage >= threshold;

    return {
      gate: "test-coverage",
      type: "automated",
      passed,
      error: passed ? undefined : `Coverage ${coverage}% is below ${threshold}% threshold`,
      details: `Coverage: ${coverage}%`,
      durationMs: Date.now() - start,
    };
  } catch (error: any) {
    return {
      gate: "test-coverage",
      type: "automated",
      passed: false,
      error: error.message,
      durationMs: Date.now() - start,
    };
  }
};

/**
 * Accessibility gate runner
 * Runs automated accessibility tests
 */
export const accessibilityRunner: GateRunner = async (context) => {
  const start = Date.now();

  try {
    const result = await runCommand("pnpm test:a11y", context.repoRoot);

    return {
      gate: "accessibility",
      type: "automated",
      passed: result.success,
      error: result.success ? undefined : "Accessibility tests failed",
      details: result.success ? "All a11y tests passed" : result.stderr,
      durationMs: Date.now() - start,
    };
  } catch (error: any) {
    return {
      gate: "accessibility",
      type: "automated",
      passed: false,
      error: error.message,
      durationMs: Date.now() - start,
    };
  }
};

/**
 * Manifest validation gate runner
 * Validates component manifests
 */
export const manifestValidationRunner: GateRunner = async (context) => {
  const start = Date.now();

  try {
    const result = await runCommand(
      "pnpm --filter @ds/docs-core validate:manifests",
      context.repoRoot
    );

    return {
      gate: "manifest-validation",
      type: "automated",
      passed: result.success,
      error: result.success ? undefined : "Manifest validation failed",
      details: result.success ? "All manifests valid" : result.stderr,
      durationMs: Date.now() - start,
    };
  } catch (error: any) {
    return {
      gate: "manifest-validation",
      type: "automated",
      passed: false,
      error: error.message,
      durationMs: Date.now() - start,
    };
  }
};

/**
 * Docs presence gate runner
 * Checks that new components have documentation
 */
export const docsPresenceRunner: GateRunner = async (context) => {
  const start = Date.now();

  if (!context.files || context.files.length === 0) {
    return {
      gate: "docs-presence",
      type: "automated",
      passed: true,
      skipped: true,
      skipReason: "No files to check",
      durationMs: Date.now() - start,
    };
  }

  // Find new component files
  const componentFiles = context.files.filter(
    (f) =>
      f.includes("packages/wc/src/components/") &&
      f.endsWith(".ts") &&
      !f.endsWith(".test.ts")
  );

  const missingDocs: string[] = [];

  for (const file of componentFiles) {
    // Extract component name from file path
    const match = file.match(/components\/([^/]+)\//);
    if (!match?.[1]) continue;

    const componentName = match[1];
    const docsPath = path.join(
      context.repoRoot,
      "packages/docs-content/components",
      `${componentName}.mdx`
    );

    if (!fs.existsSync(docsPath)) {
      missingDocs.push(componentName);
    }
  }

  const passed = missingDocs.length === 0;

  return {
    gate: "docs-presence",
    type: "automated",
    passed,
    error: passed
      ? undefined
      : `Missing documentation for: ${missingDocs.join(", ")}`,
    details: passed
      ? "All components have documentation"
      : `${missingDocs.length} component(s) missing docs`,
    durationMs: Date.now() - start,
  };
};

/**
 * TypeScript gate runner
 */
export const typecheckRunner: GateRunner = async (context) => {
  const start = Date.now();

  try {
    const result = await runCommand("pnpm typecheck", context.repoRoot);

    return {
      gate: "typecheck",
      type: "automated",
      passed: result.success,
      error: result.success ? undefined : "TypeScript errors found",
      details: result.success ? "No type errors" : result.stderr,
      durationMs: Date.now() - start,
    };
  } catch (error: any) {
    return {
      gate: "typecheck",
      type: "automated",
      passed: false,
      error: error.message,
      durationMs: Date.now() - start,
    };
  }
};

/**
 * Lint gate runner
 */
export const lintRunner: GateRunner = async (context) => {
  const start = Date.now();

  try {
    const result = await runCommand("pnpm lint", context.repoRoot);

    return {
      gate: "lint",
      type: "automated",
      passed: result.success,
      error: result.success ? undefined : "Lint errors found",
      details: result.success ? "No lint errors" : result.stderr,
      durationMs: Date.now() - start,
    };
  } catch (error: any) {
    return {
      gate: "lint",
      type: "automated",
      passed: false,
      error: error.message,
      durationMs: Date.now() - start,
    };
  }
};

/**
 * Changeset gate runner
 * Checks that a changeset is present for non-trivial changes
 */
export const changesetRunner: GateRunner = async (context) => {
  const start = Date.now();

  if (!context.files || context.files.length === 0) {
    return {
      gate: "changeset",
      type: "automated",
      passed: true,
      skipped: true,
      skipReason: "No files to check",
      durationMs: Date.now() - start,
    };
  }

  // Check if any source files are modified
  const sourceFiles = context.files.filter(
    (f) =>
      f.includes("/src/") &&
      !f.endsWith(".test.ts") &&
      !f.endsWith(".spec.ts")
  );

  if (sourceFiles.length === 0) {
    return {
      gate: "changeset",
      type: "automated",
      passed: true,
      skipped: true,
      skipReason: "No source files modified",
      durationMs: Date.now() - start,
    };
  }

  // Check for changeset file
  const hasChangeset = context.files.some((f) => f.startsWith(".changeset/") && f.endsWith(".md"));

  return {
    gate: "changeset",
    type: "automated",
    passed: hasChangeset,
    error: hasChangeset ? undefined : "No changeset found. Run `pnpm changeset` to create one.",
    warning: hasChangeset ? undefined : "PRs with source changes should include a changeset",
    durationMs: Date.now() - start,
  };
};

/** Map of gate IDs to runners */
export const gateRunners: Record<string, GateRunner> = {
  "test-coverage": testCoverageRunner,
  accessibility: accessibilityRunner,
  "manifest-validation": manifestValidationRunner,
  "docs-presence": docsPresenceRunner,
  typecheck: typecheckRunner,
  lint: lintRunner,
  changeset: changesetRunner,
};
