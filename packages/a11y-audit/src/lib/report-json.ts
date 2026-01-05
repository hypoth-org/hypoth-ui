/**
 * JSON report generation
 *
 * Creates conformance report JSON files following the schema
 */

import { randomUUID } from "node:crypto";
import type {
  ComponentStatus,
  ConformanceReport,
  ConformanceSummary,
  ReportMetadata,
} from "./types.js";

export interface JSONReportOptions {
  version: string;
  generatedBy: string;
  wcagVersion?: "2.0" | "2.1" | "2.2";
  conformanceLevel?: "A" | "AA" | "AAA";
  components: ComponentStatus[];
  gitCommit?: string;
  ciRunUrl?: string;
  axeCoreVersion?: string;
}

/**
 * Calculate conformance summary from component statuses
 */
export function calculateSummary(components: ComponentStatus[]): ConformanceSummary {
  const total = components.length;
  const conformant = components.filter((c) => c.status === "conformant").length;
  const partial = components.filter((c) => c.status === "partial").length;
  const nonConformant = components.filter((c) => c.status === "non-conformant").length;
  const pending = components.filter((c) => c.status === "pending").length;

  const conformancePercentage = total > 0 ? Math.round((conformant / total) * 100) : 0;

  return {
    totalComponents: total,
    conformant,
    partial,
    nonConformant,
    pending,
    conformancePercentage,
  };
}

/**
 * Generate a conformance report in JSON format
 */
export function generateJSONReport(options: JSONReportOptions): ConformanceReport {
  const metadata: ReportMetadata = {
    schemaVersion: "1.0.0",
    toolVersion: "0.0.0",
    axeCoreVersion: options.axeCoreVersion,
    gitCommit: options.gitCommit,
    ciRunUrl: options.ciRunUrl,
  };

  const report: ConformanceReport = {
    id: randomUUID(),
    version: options.version,
    generatedAt: new Date().toISOString(),
    generatedBy: options.generatedBy,
    wcagVersion: options.wcagVersion ?? "2.1",
    conformanceLevel: options.conformanceLevel ?? "AA",
    components: options.components,
    summary: calculateSummary(options.components),
    metadata,
  };

  return report;
}
