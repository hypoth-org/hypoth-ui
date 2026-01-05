/**
 * Audit artifact generator
 *
 * Creates validated audit record JSON files from completed checklists
 */

import { randomUUID } from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import type { AuditChecklist, AuditItem, AuditRecord, OverallStatus } from "./types.js";
import { validateRecord } from "./validator.js";

export interface ArtifactOptions {
  component: string;
  version: string;
  checklist: AuditChecklist;
  items: AuditItem[];
  auditor: string;
  notes?: string;
  outputDir: string;
}

/**
 * Calculate overall status from item results
 */
export function calculateOverallStatus(items: AuditItem[]): OverallStatus {
  const hasBlocked = items.some((i) => i.status === "blocked");
  const hasFail = items.some((i) => i.status === "fail");
  const allPass = items.every((i) => i.status === "pass" || i.status === "na");

  if (hasBlocked) {
    return "partial"; // Cannot be fully conformant with blocked items
  }

  if (hasFail) {
    // If any failures, check if majority pass
    const failCount = items.filter((i) => i.status === "fail").length;
    const passCount = items.filter((i) => i.status === "pass").length;

    if (failCount > passCount) {
      return "non-conformant";
    }
    return "partial";
  }

  if (allPass) {
    return "conformant";
  }

  return "partial";
}

/**
 * Validate that all checklist items have been completed
 */
export function validateCompleteness(
  checklist: AuditChecklist,
  items: AuditItem[]
): { complete: boolean; missing: string[] } {
  const completedIds = new Set(items.map((i) => i.itemId));
  const missing = checklist.items
    .filter((item) => !completedIds.has(item.id))
    .map((item) => item.id);

  return {
    complete: missing.length === 0,
    missing,
  };
}

/**
 * Generate an audit record artifact
 */
export function generateArtifact(options: ArtifactOptions): AuditRecord {
  // Validate completeness
  const completeness = validateCompleteness(options.checklist, options.items);

  if (!completeness.complete) {
    throw new Error(`Incomplete audit: missing items ${completeness.missing.join(", ")}`);
  }

  const record: AuditRecord = {
    id: randomUUID(),
    component: options.component,
    version: options.version,
    checklistId: options.checklist.id,
    checklistVersion: options.checklist.version,
    auditor: options.auditor,
    auditDate: new Date().toISOString(),
    items: options.items,
    overallStatus: calculateOverallStatus(options.items),
    notes: options.notes,
  };

  // Validate against schema
  const validation = validateRecord(record);
  if (!validation.valid) {
    throw new Error(`Invalid audit record: ${validation.errors.join(", ")}`);
  }

  return record;
}

/**
 * Save audit record to file
 */
export function saveArtifact(record: AuditRecord, outputDir: string): string {
  const componentDir = path.join(outputDir, record.component);

  // Create directory if it doesn't exist
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }

  const filename = `${record.version}.json`;
  const filepath = path.join(componentDir, filename);

  // Check if file already exists
  if (fs.existsSync(filepath)) {
    // Create backup
    const backupPath = filepath.replace(".json", `.backup-${Date.now()}.json`);
    fs.renameSync(filepath, backupPath);
    console.info(`Existing record backed up to: ${backupPath}`);
  }

  fs.writeFileSync(filepath, JSON.stringify(record, null, 2));

  return filepath;
}

/**
 * Load an existing audit record
 */
export function loadArtifact(
  component: string,
  version: string,
  recordsDir: string
): AuditRecord | null {
  const filepath = path.join(recordsDir, component, `${version}.json`);

  if (!fs.existsSync(filepath)) {
    return null;
  }

  const content = fs.readFileSync(filepath, "utf-8");
  return JSON.parse(content) as AuditRecord;
}

/**
 * List all audit records for a component
 */
export function listArtifacts(component: string, recordsDir: string): string[] {
  const componentDir = path.join(recordsDir, component);

  if (!fs.existsSync(componentDir)) {
    return [];
  }

  return fs
    .readdirSync(componentDir)
    .filter((f) => f.endsWith(".json") && !f.includes(".backup"))
    .map((f) => f.replace(".json", ""));
}
