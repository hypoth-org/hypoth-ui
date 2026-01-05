/**
 * CLI command: audit
 *
 * Start a manual accessibility audit for a component
 */

import * as os from "node:os";
import * as path from "node:path";
import { generateArtifact, saveArtifact } from "../lib/artifact.js";
import {
  createSession,
  getAvailableCategories,
  runInteractiveSession,
} from "../lib/checklist-runner.js";

export interface AuditOptions {
  component: string;
  category: string;
  version?: string;
}

const VALID_CATEGORIES = ["form-controls", "overlays", "navigation", "data-display", "feedback"];

export async function audit(options: AuditOptions): Promise<void> {
  const { component, category, version = "0.0.0" } = options;

  // Validate component ID format
  if (!component.match(/^ds-[a-z][a-z0-9-]*$/)) {
    console.error(`❌ Invalid component ID: ${component}`);
    console.error("   Component ID must match pattern: ds-<name> (e.g., ds-button)");
    process.exit(1);
  }

  // Validate category
  if (!VALID_CATEGORIES.includes(category)) {
    console.error(`❌ Invalid category: ${category}`);
    console.error(`   Valid categories: ${VALID_CATEGORIES.join(", ")}`);
    process.exit(1);
  }

  // Resolve paths
  const templatesDir = path.resolve(process.cwd(), "packages/a11y-audit/src/templates");
  const outputDir = path.resolve(process.cwd(), "a11y-audits/records");

  // Check if templates exist
  const categories = getAvailableCategories(templatesDir);
  if (categories.length === 0) {
    console.error(`❌ No checklist templates found in: ${templatesDir}`);
    process.exit(1);
  }

  if (!categories.includes(category)) {
    console.error(`❌ Checklist template not found: ${category}`);
    console.error(`   Available: ${categories.join(", ")}`);
    process.exit(1);
  }

  console.info(`
🔍 Starting accessibility audit
   Component: ${component}
   Category:  ${category}
   Version:   ${version}
`);

  try {
    // Create session
    const session = createSession({
      component,
      category,
      version,
      templatesDir,
    });

    // Run interactive checklist
    const items = await runInteractiveSession(session);

    if (items.length === 0) {
      console.info("\n⚠️  No items completed. Audit cancelled.");
      process.exit(0);
    }

    if (items.length < session.checklist.items.length) {
      console.info(
        `\n⚠️  Audit incomplete: ${items.length}/${session.checklist.items.length} items completed`
      );
      console.info("   Run the audit again to complete remaining items.");
      process.exit(1);
    }

    // Get auditor email (use git config or fallback)
    const auditor = process.env.USER || os.userInfo().username || "unknown@example.com";

    // Generate artifact
    const record = generateArtifact({
      component,
      version,
      checklist: session.checklist,
      items,
      auditor: `${auditor}@example.com`,
      outputDir,
    });

    // Save artifact
    const filepath = saveArtifact(record, outputDir);

    // Summary
    const passCount = items.filter((i) => i.status === "pass").length;
    const failCount = items.filter((i) => i.status === "fail").length;
    const naCount = items.filter((i) => i.status === "na").length;
    const blockedCount = items.filter((i) => i.status === "blocked").length;

    console.info(`
╔═══════════════════════════════════════════════════════════════╗
║                     AUDIT COMPLETE                             ║
╠═══════════════════════════════════════════════════════════════╣
║  Overall Status: ${record.overallStatus.toUpperCase().padEnd(44)}║
║                                                               ║
║  Results:                                                      ║
║    ✅ Pass:    ${String(passCount).padEnd(48)}║
║    ❌ Fail:    ${String(failCount).padEnd(48)}║
║    ➖ N/A:     ${String(naCount).padEnd(48)}║
║    🚫 Blocked: ${String(blockedCount).padEnd(48)}║
║                                                               ║
║  Artifact saved to:                                            ║
║    ${filepath.slice(0, 59).padEnd(60)}║
╚═══════════════════════════════════════════════════════════════╝
`);

    // Remind to commit
    console.info("📝 Remember to commit this audit record to version control:");
    console.info(`   git add ${filepath}`);
    console.info(`   git commit -m "Add a11y audit for ${component} v${version}"`);
  } catch (error) {
    console.error(`\n❌ Audit failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
