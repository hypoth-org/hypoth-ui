/**
 * CLI command: validate
 *
 * Validate audit records and checklist templates
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { validateChecklist, validateRecord } from "../lib/validator.js";

export interface ValidateOptions {
  path: string;
  strict: boolean;
}

interface ValidationSummary {
  total: number;
  valid: number;
  invalid: number;
  warnings: number;
  errors: Array<{ file: string; errors: string[] }>;
}

/**
 * Recursively find all JSON files in a directory
 */
function findJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findJsonFiles(fullPath));
    } else if (entry.name.endsWith(".json") && !entry.name.includes(".backup")) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Determine if a file is a checklist template or audit record
 */
function getFileType(filepath: string): "checklist" | "record" | "unknown" {
  if (filepath.includes("/templates/")) {
    return "checklist";
  }
  if (filepath.includes("/records/")) {
    return "record";
  }
  return "unknown";
}

export async function validate(options: ValidateOptions): Promise<void> {
  const { path: recordsPath, strict } = options;

  const fullPath = path.resolve(process.cwd(), recordsPath);

  console.info("\n🔍 Validating accessibility audit artifacts...");
  console.info(`   Path: ${fullPath}`);
  console.info(`   Mode: ${strict ? "Strict" : "Standard"}\n`);

  const files = findJsonFiles(fullPath);

  if (files.length === 0) {
    console.info("⚠️  No JSON files found to validate.");
    process.exit(0);
  }

  const summary: ValidationSummary = {
    total: files.length,
    valid: 0,
    invalid: 0,
    warnings: 0,
    errors: [],
  };

  for (const file of files) {
    const relativePath = path.relative(process.cwd(), file);
    const fileType = getFileType(file);

    try {
      const content = fs.readFileSync(file, "utf-8");
      const data = JSON.parse(content);

      let result: { valid: boolean; errors: string[] };

      if (fileType === "checklist") {
        result = validateChecklist(data);
      } else if (fileType === "record") {
        result = validateRecord(data);
      } else {
        // Try both
        result = validateRecord(data);
        if (!result.valid) {
          result = validateChecklist(data);
        }
      }

      if (result.valid) {
        console.info(`  ✅ ${relativePath}`);
        summary.valid++;
      } else {
        console.info(`  ❌ ${relativePath}`);
        for (const error of result.errors) {
          console.info(`     - ${error}`);
        }
        summary.invalid++;
        summary.errors.push({ file: relativePath, errors: result.errors });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.info(`  ❌ ${relativePath}`);
      console.info(`     - Parse error: ${message}`);
      summary.invalid++;
      summary.errors.push({ file: relativePath, errors: [`Parse error: ${message}`] });
    }
  }

  // Print summary
  console.info(`
═══════════════════════════════════════════════════════════════
                     VALIDATION SUMMARY
═══════════════════════════════════════════════════════════════

  Total files:  ${summary.total}
  Valid:        ${summary.valid}
  Invalid:      ${summary.invalid}

═══════════════════════════════════════════════════════════════
`);

  // Exit with error if invalid files found
  if (summary.invalid > 0) {
    console.error(`❌ Validation failed: ${summary.invalid} file(s) have errors`);
    process.exit(1);
  }

  if (strict && summary.warnings > 0) {
    console.error(`❌ Strict mode: ${summary.warnings} warning(s) treated as errors`);
    process.exit(1);
  }

  console.info("✅ All files validated successfully");
}
