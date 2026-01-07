/**
 * Gates Checker
 *
 * Runs contribution gates and generates reports.
 */

import * as fs from "node:fs";
import type { ContributionGate, GatesConfig } from "../types/index.js";
import { gateRunners } from "./runners.js";
import type { GateCheckResult, GateContext, GateDefinition, GatesReport } from "./types.js";

/**
 * Load gates configuration from file
 */
export function loadGatesConfig(configPath: string): GatesConfig {
  if (!fs.existsSync(configPath)) {
    throw new Error(`Gates config not found: ${configPath}`);
  }

  const content = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(content) as GatesConfig;
}

/**
 * Convert config gate to definition
 */
function gateToDefinition(gate: ContributionGate): GateDefinition {
  return {
    id: gate.id,
    name: gate.name,
    description: gate.description,
    type: gate.type,
    required: gate.required,
    command: gate.command,
    runner: gateRunners[gate.id],
  };
}

/**
 * Run a single gate check
 */
async function runGate(definition: GateDefinition, context: GateContext): Promise<GateCheckResult> {
  const start = Date.now();

  // Use custom runner if available
  if (definition.runner) {
    return definition.runner(context);
  }

  // For manual gates, always mark as skipped (require human action)
  if (definition.type === "manual") {
    return {
      gate: definition.id,
      type: definition.type,
      passed: true,
      skipped: true,
      skipReason: "Manual gate - requires human review",
      durationMs: Date.now() - start,
    };
  }

  // No runner and no command - skip
  if (!definition.command) {
    return {
      gate: definition.id,
      type: definition.type,
      passed: true,
      skipped: true,
      skipReason: "No runner or command defined",
      durationMs: Date.now() - start,
    };
  }

  // Run command (this is a placeholder - real impl would use exec)
  return {
    gate: definition.id,
    type: definition.type,
    passed: false,
    error: "Command execution not implemented",
    durationMs: Date.now() - start,
  };
}

/**
 * Run all gates and generate report
 */
export async function runGates(
  config: GatesConfig,
  context: GateContext,
  options: { parallel?: boolean; gates?: string[] } = {}
): Promise<GatesReport> {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Filter gates if specific ones requested
  let gates = config.gates;
  if (options.gates && options.gates.length > 0) {
    gates = gates.filter((g) => options.gates?.includes(g.id));
  }

  const definitions = gates.map(gateToDefinition);
  let results: GateCheckResult[];

  if (options.parallel) {
    // Run gates in parallel
    results = await Promise.all(definitions.map((d) => runGate(d, context)));
  } else {
    // Run gates sequentially
    results = [];
    for (const definition of definitions) {
      const result = await runGate(definition, context);
      results.push(result);

      // Stop on first failure if gate is required
      const gate = gates.find((g) => g.id === definition.id);
      if (!result.passed && gate?.required && !result.skipped) {
        break;
      }
    }
  }

  const passedCount = results.filter((r) => r.passed && !r.skipped).length;
  const failedCount = results.filter((r) => !r.passed && !r.skipped).length;
  const skippedCount = results.filter((r) => r.skipped).length;

  return {
    passed: failedCount === 0,
    total: results.length,
    passedCount,
    failedCount,
    skippedCount,
    results,
    durationMs: Date.now() - start,
    timestamp,
  };
}

/**
 * Format gates report for console output
 */
export function formatGatesReport(report: GatesReport): string {
  const lines: string[] = [];

  lines.push("=== Contribution Gates Report ===");
  lines.push("");
  lines.push(
    `Status: ${report.passed ? "PASSED" : "FAILED"} (${report.passedCount}/${report.total - report.skippedCount} passed)`
  );
  lines.push(`Duration: ${report.durationMs}ms`);
  lines.push("");
  lines.push("Results:");
  lines.push("");

  for (const result of report.results) {
    const status = result.skipped ? "SKIP" : result.passed ? "PASS" : "FAIL";
    const icon = result.skipped ? "⊘" : result.passed ? "✓" : "✗";

    lines.push(`  ${icon} [${status}] ${result.gate}`);

    if (result.error) {
      lines.push(`       Error: ${result.error}`);
    }
    if (result.warning) {
      lines.push(`       Warning: ${result.warning}`);
    }
    if (result.skipReason) {
      lines.push(`       Reason: ${result.skipReason}`);
    }
    if (result.durationMs) {
      lines.push(`       Duration: ${result.durationMs}ms`);
    }
  }

  lines.push("");
  lines.push(`Generated: ${report.timestamp}`);

  return lines.join("\n");
}

/**
 * Check if gates would pass (dry run)
 */
export async function checkGates(
  configPath: string,
  context: GateContext,
  options: { parallel?: boolean; gates?: string[] } = {}
): Promise<GatesReport> {
  const config = loadGatesConfig(configPath);
  return runGates(config, context, options);
}

/**
 * Get required gates that failed
 */
export function getRequiredFailures(report: GatesReport, config: GatesConfig): GateCheckResult[] {
  const requiredGateIds = config.gates.filter((g) => g.required).map((g) => g.id);

  return report.results.filter((r) => !r.passed && !r.skipped && requiredGateIds.includes(r.gate));
}
