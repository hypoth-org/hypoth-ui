/**
 * Deprecation Warnings
 *
 * Runtime and build-time deprecation warning utilities.
 */

import type { DeprecationRecord, DeprecationType } from "../types/index.js";
import type { DeprecationWithStatus } from "./types.js";

/** Warning severity levels */
export type WarningSeverity = "info" | "warning" | "error";

/** Formatted warning message */
export interface DeprecationWarning {
  /** Severity level */
  severity: WarningSeverity;
  /** Warning message */
  message: string;
  /** Detailed information */
  details?: string;
  /** Suggested action */
  action?: string;
  /** Documentation link */
  docsUrl?: string;
}

/**
 * Map deprecation status to severity
 */
function statusToSeverity(status: DeprecationWithStatus["status"]): WarningSeverity {
  switch (status) {
    case "removed":
      return "error";
    case "removal-imminent":
      return "error";
    case "warning":
      return "warning";
    case "active":
      return "info";
    default:
      return "info";
  }
}

/**
 * Format deprecation type for display
 */
function formatType(type: DeprecationType): string {
  switch (type) {
    case "component":
      return "Component";
    case "prop":
      return "Prop";
    case "css-variable":
      return "CSS Variable";
    case "utility":
      return "Utility";
    case "pattern":
      return "Pattern";
    default:
      return type;
  }
}

/**
 * Generate warning message for a deprecation
 */
export function generateWarning(deprecation: DeprecationWithStatus): DeprecationWarning {
  const type = formatType(deprecation.type);
  const severity = statusToSeverity(deprecation.status);

  let message: string;
  let details: string | undefined;
  let action: string | undefined;

  switch (deprecation.status) {
    case "removed":
      message = `${type} "${deprecation.item}" has been removed.`;
      if (deprecation.replacement) {
        action = `Use "${deprecation.replacement}" instead.`;
      }
      break;

    case "removal-imminent":
      message = `${type} "${deprecation.item}" will be removed in the next major version (${deprecation.removal_version}).`;
      action = "Migrate before upgrading to avoid breaking changes.";
      break;

    case "warning":
      message = `${type} "${deprecation.item}" is deprecated and will be removed in version ${deprecation.removal_version}.`;
      if (deprecation.versionsUntilRemoval) {
        details = `${deprecation.versionsUntilRemoval} major version(s) remaining.`;
      }
      break;

    case "active":
    default:
      message = `${type} "${deprecation.item}" is deprecated since version ${deprecation.deprecated_in}.`;
      if (deprecation.versionsUntilRemoval) {
        details = `Will be removed in version ${deprecation.removal_version} (${deprecation.versionsUntilRemoval} major versions remaining).`;
      }
      break;
  }

  if (deprecation.replacement) {
    action = action ?? `Use "${deprecation.replacement}" instead.`;
  }

  if (deprecation.reason) {
    details = details ? `${details} ${deprecation.reason}` : deprecation.reason;
  }

  return {
    severity,
    message,
    details,
    action,
    docsUrl: deprecation.migration_guide,
  };
}

/**
 * Format warning for console output
 */
export function formatConsoleWarning(warning: DeprecationWarning): string {
  const prefix = warning.severity === "error" ? "ERROR" : warning.severity === "warning" ? "WARN" : "INFO";
  const lines: string[] = [`[${prefix}] ${warning.message}`];

  if (warning.details) {
    lines.push(`       ${warning.details}`);
  }

  if (warning.action) {
    lines.push(`       Action: ${warning.action}`);
  }

  if (warning.docsUrl) {
    lines.push(`       Docs: ${warning.docsUrl}`);
  }

  return lines.join("\n");
}

/**
 * Log deprecation warning to console
 */
export function logDeprecationWarning(deprecation: DeprecationWithStatus): void {
  const warning = generateWarning(deprecation);
  const formatted = formatConsoleWarning(warning);

  switch (warning.severity) {
    case "error":
      console.error(formatted);
      break;
    case "warning":
      console.warn(formatted);
      break;
    default:
      console.info(formatted);
  }
}

/**
 * Create runtime deprecation warning function
 * Can be called from component code
 */
export function createDeprecationWarner(
  currentVersion: string
): (item: string, type: DeprecationType, deprecatedIn: string, replacement?: string) => void {
  const warned = new Set<string>();

  return (item, type, deprecatedIn, replacement) => {
    const key = `${type}:${item}`;

    // Only warn once per item
    if (warned.has(key)) {
      return;
    }
    warned.add(key);

    const deprecation: DeprecationWithStatus = {
      item,
      type,
      deprecated_in: deprecatedIn,
      removal_version: calculateRemovalVersion(deprecatedIn),
      replacement,
      status: "active",
      versionsUntilRemoval: 2,
    };

    logDeprecationWarning(deprecation);
  };
}

/**
 * Calculate removal version (2 major versions after deprecation)
 */
function calculateRemovalVersion(deprecatedIn: string): string {
  const parts = deprecatedIn.split(".").map(Number);
  return `${(parts[0] ?? 0) + 2}.0.0`;
}

/**
 * Generate deprecation notice for JSDoc
 */
export function generateJSDocDeprecation(record: DeprecationRecord): string {
  let doc = `@deprecated Since ${record.deprecated_in}. Will be removed in ${record.removal_version}.`;

  if (record.replacement) {
    doc += ` Use \`${record.replacement}\` instead.`;
  }

  if (record.reason) {
    doc += ` ${record.reason}`;
  }

  return doc;
}

/**
 * Generate deprecation notice for TypeScript
 */
export function generateTSDeprecation(record: DeprecationRecord): string {
  return `/** ${generateJSDocDeprecation(record)} */`;
}
