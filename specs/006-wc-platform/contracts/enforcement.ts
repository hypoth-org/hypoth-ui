/**
 * Enforcement Script API Contract
 * AST-based detection of side-effect customElements.define() calls
 *
 * @package tooling
 * @path tooling/scripts/check-auto-define.ts
 */

/**
 * A detected violation of the no-auto-define rule
 */
export interface Violation {
  /** Line number (1-indexed) */
  line: number;
  /** Column number (1-indexed) */
  column: number;
  /** The tag name being registered, if determinable */
  tagName: string | null;
  /** Code snippet showing the violation */
  code: string;
}

/**
 * Result of scanning a single file
 */
export interface FileResult {
  /** Absolute path to the scanned file */
  filePath: string;
  /** List of detected violations */
  violations: Violation[];
  /** Whether the file passed (no violations) */
  passed: boolean;
}

/**
 * Result of scanning multiple files
 */
export interface ScanResult {
  /** Total files scanned */
  totalFiles: number;
  /** Number of files that passed */
  passedFiles: number;
  /** Number of files with violations */
  failedFiles: number;
  /** Detailed results per file */
  files: FileResult[];
  /** Overall pass/fail status */
  passed: boolean;
}

/**
 * Options for the enforcement scanner
 */
export interface ScanOptions {
  /**
   * Glob patterns for files to scan
   * @default ['packages/wc/src/components/** /*.ts']
   */
  include?: string[];

  /**
   * Glob patterns to exclude
   * @default ['** /*.test.ts', '** /*.spec.ts']
   */
  exclude?: string[];

  /**
   * Output format
   * @default 'text'
   */
  format?: "text" | "json" | "github";

  /**
   * Fail on first violation (useful for CI)
   * @default false
   */
  failFast?: boolean;

  /**
   * Working directory
   * @default process.cwd()
   */
  cwd?: string;
}

/**
 * Scan files for side-effect customElements.define() calls
 *
 * A side-effect call is one that executes at module load time,
 * i.e., at the top level of the file (not inside a function/class).
 *
 * @param options - Scan configuration
 * @returns Scan results
 *
 * @example
 * ```typescript
 * const result = await scanForAutoDefine({
 *   include: ['packages/wc/src/components/** /*.ts'],
 *   format: 'github'
 * });
 *
 * if (!result.passed) {
 *   process.exit(1);
 * }
 * ```
 */
export declare function scanForAutoDefine(
  options?: ScanOptions
): Promise<ScanResult>;

/**
 * Check a single file for violations
 *
 * @param filePath - Path to the file to check
 * @returns File result with any violations found
 */
export declare function checkFile(filePath: string): Promise<FileResult>;

/**
 * CLI entry point
 *
 * Usage:
 *   pnpm check:auto-define [options]
 *
 * Options:
 *   --include <glob>  Files to scan (can specify multiple)
 *   --exclude <glob>  Files to exclude (can specify multiple)
 *   --format <type>   Output format: text, json, github
 *   --fail-fast       Exit on first violation
 *   --help            Show help
 *
 * Exit codes:
 *   0 - All files passed
 *   1 - Violations found
 *   2 - Error (invalid options, file not found, etc.)
 */
