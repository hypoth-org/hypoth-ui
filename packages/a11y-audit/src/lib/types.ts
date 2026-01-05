/**
 * TypeScript types derived from JSON schemas
 * @see ../schemas/audit-checklist.schema.json
 * @see ../schemas/audit-record.schema.json
 * @see ../schemas/conformance-report.schema.json
 */

// === Audit Checklist Types ===

export interface ChecklistItem {
  id: string;
  criterion: string;
  description: string;
  procedure: string;
  expectedOutcome: string;
  tools?: string[];
  screenReaders?: string[];
}

export interface AuditChecklist {
  id: string;
  name: string;
  description: string;
  wcagVersion: "2.0" | "2.1" | "2.2";
  conformanceLevel: "A" | "AA" | "AAA";
  version: string;
  items: ChecklistItem[];
}

// === Audit Record Types ===

export type AuditItemStatus = "pass" | "fail" | "na" | "blocked";

export interface AuditItem {
  itemId: string;
  status: AuditItemStatus;
  notes?: string;
  evidence?: string;
}

export interface Exception {
  criterion: string;
  rationale: string;
  workaround?: string;
  plannedFix?: string;
}

export type OverallStatus = "conformant" | "partial" | "non-conformant";

export interface AuditRecord {
  id: string;
  component: string;
  version: string;
  checklistId: string;
  checklistVersion: string;
  auditor: string;
  auditDate: string;
  items: AuditItem[];
  overallStatus: OverallStatus;
  notes?: string;
  exceptions?: Exception[];
}

// === Conformance Report Types ===

export interface AutomatedSummary {
  passed: boolean;
  violationCount: number;
  criticalCount?: number;
  seriousCount?: number;
  runId: string;
  runDate?: string;
}

export interface ManualAuditSummary {
  status: OverallStatus;
  auditId: string;
  auditor: string;
  auditDate: string;
  passCount?: number;
  failCount?: number;
  exceptionCount?: number;
}

export type ComponentConformanceStatus = "conformant" | "partial" | "non-conformant" | "pending";

export interface ComponentStatus {
  component: string;
  version: string;
  status: ComponentConformanceStatus;
  automatedResult: AutomatedSummary;
  manualAudit?: ManualAuditSummary;
  lastUpdated: string;
}

export interface ConformanceSummary {
  totalComponents: number;
  conformant: number;
  partial: number;
  nonConformant: number;
  pending: number;
  conformancePercentage: number;
}

export interface ReportMetadata {
  schemaVersion: string;
  toolVersion: string;
  axeCoreVersion?: string;
  gitCommit?: string;
  ciRunUrl?: string;
}

export interface ConformanceReport {
  id: string;
  version: string;
  generatedAt: string;
  generatedBy: string;
  wcagVersion: "2.0" | "2.1" | "2.2";
  conformanceLevel: "A" | "AA" | "AAA";
  components: ComponentStatus[];
  summary: ConformanceSummary;
  metadata: ReportMetadata;
}

// === Severity Types ===

export type ViolationSeverity = "critical" | "serious" | "moderate" | "minor";

export interface SeverityThreshold {
  failOn: ViolationSeverity[];
}
