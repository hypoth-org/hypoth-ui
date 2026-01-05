/**
 * Gates Types
 *
 * Types for contribution gates checking.
 */

import type { GateType } from "../types/index.js";

/** Gate check context */
export interface GateContext {
  /** Root directory of the repository */
  repoRoot: string;
  /** Package being checked (if applicable) */
  package?: string;
  /** Files being modified */
  files?: string[];
  /** Current branch name */
  branch?: string;
  /** Is this a PR check */
  isPR?: boolean;
  /** PR number if applicable */
  prNumber?: number;
}

/** Individual gate check result */
export interface GateCheckResult {
  /** Gate identifier */
  gate: string;
  /** Gate type */
  type: GateType;
  /** Whether gate passed */
  passed: boolean;
  /** Error message if failed */
  error?: string;
  /** Warning message (passed but with notes) */
  warning?: string;
  /** Detailed output */
  details?: string;
  /** Duration in milliseconds */
  durationMs?: number;
  /** Whether this was skipped */
  skipped?: boolean;
  /** Skip reason if skipped */
  skipReason?: string;
}

/** Overall gates check result */
export interface GatesReport {
  /** All gates passed */
  passed: boolean;
  /** Number of gates checked */
  total: number;
  /** Number of gates passed */
  passedCount: number;
  /** Number of gates failed */
  failedCount: number;
  /** Number of gates skipped */
  skippedCount: number;
  /** Individual results */
  results: GateCheckResult[];
  /** Total duration in milliseconds */
  durationMs: number;
  /** Timestamp */
  timestamp: string;
}

/** Gate runner function signature */
export type GateRunner = (context: GateContext) => Promise<GateCheckResult>;

/** Gate definition */
export interface GateDefinition {
  /** Gate identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Description */
  description: string;
  /** Gate type */
  type: GateType;
  /** Whether gate is required (blocks merge if failed) */
  required: boolean;
  /** Command to run (for automated gates) */
  command?: string;
  /** Custom runner function */
  runner?: GateRunner;
  /** Packages this gate applies to (empty = all) */
  packages?: string[];
}
