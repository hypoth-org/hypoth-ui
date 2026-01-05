/**
 * Report aggregator
 *
 * Aggregates automated test results and manual audit records
 * into a unified conformance status per component.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import type {
  AuditRecord,
  AutomatedSummary,
  ComponentConformanceStatus,
  ComponentStatus,
  ManualAuditSummary,
} from "./types.js";

export interface AggregatorOptions {
  recordsDir: string;
  automatedResultsPath?: string;
  version: string;
}

export interface ComponentData {
  component: string;
  version: string;
  automatedResult?: AutomatedSummary;
  manualAudit?: AuditRecord;
}

/**
 * Load all audit records from the records directory
 */
export function loadAuditRecords(recordsDir: string): Map<string, AuditRecord[]> {
  const records = new Map<string, AuditRecord[]>();

  if (!fs.existsSync(recordsDir)) {
    return records;
  }

  const components = fs.readdirSync(recordsDir, { withFileTypes: true });

  for (const component of components) {
    if (!component.isDirectory()) continue;

    const componentPath = path.join(recordsDir, component.name);
    const files = fs
      .readdirSync(componentPath)
      .filter((f) => f.endsWith(".json") && !f.includes(".backup"));

    const componentRecords: AuditRecord[] = [];

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(componentPath, file), "utf-8");
        const record = JSON.parse(content) as AuditRecord;
        componentRecords.push(record);
      } catch {
        console.warn(`Warning: Could not parse ${path.join(componentPath, file)}`);
      }
    }

    if (componentRecords.length > 0) {
      records.set(component.name, componentRecords);
    }
  }

  return records;
}

/**
 * Get the latest audit record for a component version
 */
export function getLatestRecord(records: AuditRecord[], version?: string): AuditRecord | undefined {
  if (version) {
    return records.find((r) => r.version === version);
  }

  // Get most recent by date
  return records.sort(
    (a, b) => new Date(b.auditDate).getTime() - new Date(a.auditDate).getTime()
  )[0];
}

/**
 * Calculate component conformance status from automated + manual data
 */
export function calculateConformanceStatus(data: ComponentData): ComponentConformanceStatus {
  const hasAutomated = data.automatedResult !== undefined;
  const hasManual = data.manualAudit !== undefined;

  // No data at all = pending
  if (!hasAutomated && !hasManual) {
    return "pending";
  }

  // Only automated, no manual = pending (manual audit required)
  if (hasAutomated && !hasManual) {
    return "pending";
  }

  // Check automated result
  if (hasAutomated && data.automatedResult?.passed === false) {
    return "non-conformant";
  }

  // Check manual audit result
  if (hasManual && data.manualAudit) {
    switch (data.manualAudit.overallStatus) {
      case "conformant":
        return "conformant";
      case "partial":
        return "partial";
      case "non-conformant":
        return "non-conformant";
    }
  }

  return "pending";
}

/**
 * Create a ManualAuditSummary from an AuditRecord
 */
export function createManualAuditSummary(record: AuditRecord): ManualAuditSummary {
  const passCount = record.items.filter((i) => i.status === "pass").length;
  const failCount = record.items.filter((i) => i.status === "fail").length;
  const exceptionCount = record.exceptions?.length ?? 0;

  return {
    status: record.overallStatus,
    auditId: record.id,
    auditor: record.auditor,
    auditDate: record.auditDate,
    passCount,
    failCount,
    exceptionCount,
  };
}

/**
 * Create a ComponentStatus from aggregated data
 */
export function createComponentStatus(data: ComponentData): ComponentStatus {
  const status = calculateConformanceStatus(data);

  // Default automated result if none provided
  const automatedResult: AutomatedSummary = data.automatedResult ?? {
    passed: true,
    violationCount: 0,
    runId: "pending",
  };

  const lastUpdated = data.manualAudit?.auditDate ?? new Date().toISOString();

  return {
    component: data.component,
    version: data.version,
    status,
    automatedResult,
    manualAudit: data.manualAudit ? createManualAuditSummary(data.manualAudit) : undefined,
    lastUpdated,
  };
}

/**
 * Aggregate all component data for a release
 */
export function aggregateForRelease(
  components: string[],
  recordsDir: string,
  version: string
): ComponentStatus[] {
  const allRecords = loadAuditRecords(recordsDir);
  const statuses: ComponentStatus[] = [];

  for (const component of components) {
    const records = allRecords.get(component) ?? [];
    const latestRecord = getLatestRecord(records, version) ?? getLatestRecord(records);

    const data: ComponentData = {
      component,
      version,
      manualAudit: latestRecord,
    };

    statuses.push(createComponentStatus(data));
  }

  return statuses;
}
