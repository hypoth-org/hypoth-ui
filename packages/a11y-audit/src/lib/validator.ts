import Ajv from "ajv";
import addFormats from "ajv-formats";
import auditChecklistSchema from "../schemas/audit-checklist.schema.json" with { type: "json" };
import auditRecordSchema from "../schemas/audit-record.schema.json" with { type: "json" };
import conformanceReportSchema from "../schemas/conformance-report.schema.json" with {
  type: "json",
};

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);

const validateAuditChecklist = ajv.compile(auditChecklistSchema);
const validateAuditRecord = ajv.compile(auditRecordSchema);
const validateConformanceReport = ajv.compile(conformanceReportSchema);

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function formatErrors(errors: typeof ajv.errors): string[] {
  if (!errors) return [];
  return errors.map((err) => {
    const path = err.instancePath || "/";
    return `${path}: ${err.message}`;
  });
}

export function validateChecklist(data: unknown): ValidationResult {
  const valid = validateAuditChecklist(data);
  return {
    valid,
    errors: formatErrors(validateAuditChecklist.errors),
  };
}

export function validateRecord(data: unknown): ValidationResult {
  const valid = validateAuditRecord(data);
  return {
    valid,
    errors: formatErrors(validateAuditRecord.errors),
  };
}

export function validateReport(data: unknown): ValidationResult {
  const valid = validateConformanceReport(data);
  return {
    valid,
    errors: formatErrors(validateConformanceReport.errors),
  };
}
