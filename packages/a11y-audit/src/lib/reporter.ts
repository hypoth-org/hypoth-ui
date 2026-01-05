/**
 * CI Reporter for accessibility test results
 *
 * Provides human-readable output for CI environments with
 * remediation guidance for each violation.
 */

import { formatRemediation } from "./remediation.js";
import type { ViolationSeverity } from "./types.js";

export interface A11yViolation {
  id: string;
  impact: ViolationSeverity;
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    target: string[];
    failureSummary?: string;
  }>;
}

export interface A11yTestResult {
  component: string;
  passed: boolean;
  violations: A11yViolation[];
  timestamp: string;
}

export interface A11yReportSummary {
  totalComponents: number;
  passedComponents: number;
  failedComponents: number;
  totalViolations: number;
  violationsBySeverity: Record<ViolationSeverity, number>;
}

/**
 * Severity icon mapping for CLI output
 */
const SEVERITY_ICONS: Record<ViolationSeverity, string> = {
  critical: "🔴",
  serious: "🟠",
  moderate: "🟡",
  minor: "🔵",
};

/**
 * Format a single violation for CLI output
 */
function formatViolation(violation: A11yViolation, _index: number): string {
  const icon = SEVERITY_ICONS[violation.impact];
  const lines = [
    "",
    `${icon} [${violation.impact.toUpperCase()}] ${violation.id}`,
    `   ${violation.help}`,
    "",
  ];

  // Show affected elements
  if (violation.nodes.length > 0) {
    lines.push(`   Affected elements (${violation.nodes.length}):`);
    violation.nodes.slice(0, 3).forEach((node, i) => {
      const selector = node.target.join(" > ");
      lines.push(`   ${i + 1}. ${selector}`);
      if (node.html.length < 100) {
        lines.push(`      HTML: ${node.html}`);
      }
    });
    if (violation.nodes.length > 3) {
      lines.push(`   ... and ${violation.nodes.length - 3} more`);
    }
  }

  // Add remediation guidance
  lines.push("", formatRemediation(violation.id));

  return lines.join("\n");
}

/**
 * Format test results for a single component
 */
export function formatComponentResult(result: A11yTestResult): string {
  const status = result.passed ? "✅" : "❌";
  const lines = ["", `${status} ${result.component}`];

  if (result.passed) {
    lines.push("   No accessibility violations detected");
  } else {
    lines.push(`   ${result.violations.length} violation(s) found`);
    result.violations.forEach((v, i) => {
      lines.push(formatViolation(v, i));
    });
  }

  return lines.join("\n");
}

/**
 * Format the overall summary for CI output
 */
export function formatSummary(summary: A11yReportSummary): string {
  const lines = [
    "",
    "═══════════════════════════════════════════════════════════════",
    "                    ACCESSIBILITY TEST SUMMARY                   ",
    "═══════════════════════════════════════════════════════════════",
    "",
    `Components: ${summary.passedComponents}/${summary.totalComponents} passed`,
    "",
  ];

  if (summary.totalViolations > 0) {
    lines.push("Violations by severity:");
    for (const severity of ["critical", "serious", "moderate", "minor"] as ViolationSeverity[]) {
      const count = summary.violationsBySeverity[severity] || 0;
      if (count > 0) {
        lines.push(`  ${SEVERITY_ICONS[severity]} ${severity}: ${count}`);
      }
    }
  } else {
    lines.push("🎉 All accessibility checks passed!");
  }

  lines.push("", "═══════════════════════════════════════════════════════════════", "");

  return lines.join("\n");
}

/**
 * Generate a full CI report
 */
export function generateCIReport(results: A11yTestResult[]): string {
  const summary: A11yReportSummary = {
    totalComponents: results.length,
    passedComponents: results.filter((r) => r.passed).length,
    failedComponents: results.filter((r) => !r.passed).length,
    totalViolations: results.reduce((sum, r) => sum + r.violations.length, 0),
    violationsBySeverity: {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
    },
  };

  // Count violations by severity
  for (const result of results) {
    for (const violation of result.violations) {
      summary.violationsBySeverity[violation.impact]++;
    }
  }

  // Build report
  const lines = ["", "🔍 Running accessibility checks...", ""];

  // Failed components first
  const failed = results.filter((r) => !r.passed);
  const passed = results.filter((r) => r.passed);

  for (const result of failed) {
    lines.push(formatComponentResult(result));
  }

  // Then passed components (condensed)
  if (passed.length > 0) {
    lines.push("", "Passed components:");
    for (const result of passed) {
      lines.push(`  ✅ ${result.component}`);
    }
  }

  lines.push(formatSummary(summary));

  return lines.join("\n");
}

/**
 * Generate JSON report for artifact storage
 */
export function generateJSONReport(results: A11yTestResult[]): object {
  const summary: A11yReportSummary = {
    totalComponents: results.length,
    passedComponents: results.filter((r) => r.passed).length,
    failedComponents: results.filter((r) => !r.passed).length,
    totalViolations: results.reduce((sum, r) => sum + r.violations.length, 0),
    violationsBySeverity: {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
    },
  };

  for (const result of results) {
    for (const violation of result.violations) {
      summary.violationsBySeverity[violation.impact]++;
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    summary,
    results,
  };
}
