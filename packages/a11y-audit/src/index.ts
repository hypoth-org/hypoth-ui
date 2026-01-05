// Types
export type {
  AuditChecklist,
  ChecklistItem,
  AuditRecord,
  AuditItem,
  AuditItemStatus,
  Exception,
  OverallStatus,
  ConformanceReport,
  ComponentStatus,
  ComponentConformanceStatus,
  AutomatedSummary,
  ManualAuditSummary,
  ConformanceSummary,
  ReportMetadata,
  ViolationSeverity,
  SeverityThreshold,
} from "./lib/types.js";

// Validation
export {
  validateChecklist,
  validateRecord,
  validateReport,
  type ValidationResult,
} from "./lib/validator.js";

// Configuration
export {
  DEFAULT_SEVERITY_THRESHOLD,
  SEVERITY_LEVELS,
  SEVERITY_ENV_VAR,
  parseSeverityThreshold,
  shouldFailOnSeverity,
  describeSeverityThreshold,
} from "./lib/config.js";
