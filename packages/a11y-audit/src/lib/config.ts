import type { SeverityThreshold, ViolationSeverity } from "./types.js";

/**
 * Default severity threshold: fail on Critical + Serious violations
 * This matches axe-core's default behavior and WCAG compliance requirements
 */
export const DEFAULT_SEVERITY_THRESHOLD: SeverityThreshold = {
  failOn: ["critical", "serious"],
};

/**
 * All available severity levels in order of importance
 */
export const SEVERITY_LEVELS: ViolationSeverity[] = ["critical", "serious", "moderate", "minor"];

/**
 * Environment variable name for severity threshold override
 */
export const SEVERITY_ENV_VAR = "A11Y_SEVERITY";

/**
 * Parse severity threshold from CLI flag or environment variable
 *
 * Accepts comma-separated severity levels:
 * - "critical" - fail only on critical
 * - "critical,serious" - fail on critical or serious (default)
 * - "critical,serious,moderate" - fail on critical, serious, or moderate
 * - "all" - fail on any violation
 *
 * @param value - CLI flag value or undefined to check env var
 * @returns Parsed severity threshold
 */
export function parseSeverityThreshold(value?: string): SeverityThreshold {
  const input = value ?? process.env[SEVERITY_ENV_VAR];

  if (!input) {
    return DEFAULT_SEVERITY_THRESHOLD;
  }

  if (input.toLowerCase() === "all") {
    return { failOn: [...SEVERITY_LEVELS] };
  }

  const levels = input
    .toLowerCase()
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is ViolationSeverity => SEVERITY_LEVELS.includes(s as ViolationSeverity));

  if (levels.length === 0) {
    console.warn(`Invalid severity threshold: "${input}". Using default.`);
    return DEFAULT_SEVERITY_THRESHOLD;
  }

  return { failOn: levels };
}

/**
 * Check if a violation severity should cause a failure
 *
 * @param severity - The violation severity to check
 * @param threshold - The threshold configuration
 * @returns true if this severity should cause a failure
 */
export function shouldFailOnSeverity(
  severity: ViolationSeverity,
  threshold: SeverityThreshold = DEFAULT_SEVERITY_THRESHOLD
): boolean {
  return threshold.failOn.includes(severity);
}

/**
 * Get human-readable description of the severity threshold
 */
export function describeSeverityThreshold(threshold: SeverityThreshold): string {
  if (threshold.failOn.length === SEVERITY_LEVELS.length) {
    return "all violations";
  }
  return `${threshold.failOn.join(" or ")} violations`;
}
