/**
 * Migration Guide Utilities
 *
 * Helpers for generating and managing migration guides.
 */

import type { DeprecationRecord } from "../types/index.js";
import type { MigrationGuideData, MigrationStep } from "./types.js";

/**
 * Generate migration guide markdown from structured data
 */
export function generateMigrationMarkdown(guide: MigrationGuideData): string {
  const lines: string[] = [];

  // Header
  lines.push(`# ${guide.title}`);
  lines.push("");
  lines.push(`Migration guide from version ${guide.fromVersion} to ${guide.toVersion}.`);
  lines.push("");

  // Effort indicator
  lines.push(
    `**Estimated Effort:** ${guide.effort.charAt(0).toUpperCase() + guide.effort.slice(1)}`
  );
  lines.push("");

  // Prerequisites
  if (guide.prerequisites && guide.prerequisites.length > 0) {
    lines.push("## Prerequisites");
    lines.push("");
    for (const prereq of guide.prerequisites) {
      lines.push(`- ${prereq}`);
    }
    lines.push("");
  }

  // Breaking changes
  lines.push("## Breaking Changes");
  lines.push("");

  for (const change of guide.breakingChanges) {
    lines.push(`### ${change.item}`);
    lines.push("");
    lines.push(`**Type:** ${change.type}`);
    lines.push("");
    lines.push(change.reason);
    lines.push("");

    lines.push("#### Migration Steps");
    lines.push("");

    for (let i = 0; i < change.migration.length; i++) {
      const step = change.migration[i];
      if (!step) continue;

      lines.push(`${i + 1}. ${step.description}`);
      lines.push("");

      if (step.before && step.after) {
        lines.push("   **Before:**");
        lines.push("   ```tsx");
        lines.push(`   ${step.before.split("\n").join("\n   ")}`);
        lines.push("   ```");
        lines.push("");
        lines.push("   **After:**");
        lines.push("   ```tsx");
        lines.push(`   ${step.after.split("\n").join("\n   ")}`);
        lines.push("   ```");
        lines.push("");
      }

      if (step.automated) {
        lines.push("   > This step can be automated using our codemod.");
        lines.push("");
      }
    }
  }

  return lines.join("\n");
}

/**
 * Create a simple migration step
 */
export function createMigrationStep(
  description: string,
  options: { before?: string; after?: string; automated?: boolean } = {}
): MigrationStep {
  return {
    description,
    before: options.before,
    after: options.after,
    automated: options.automated,
  };
}

/**
 * Generate migration steps from deprecation record
 */
export function deprecationToMigrationSteps(record: DeprecationRecord): MigrationStep[] {
  const steps: MigrationStep[] = [];

  switch (record.type) {
    case "component":
      if (record.replacement) {
        steps.push(
          createMigrationStep(`Replace \`<${record.item}>\` with \`<${record.replacement}>\``, {
            before: `<${record.item} />`,
            after: `<${record.replacement} />`,
          })
        );
      } else {
        steps.push(createMigrationStep(`Remove usage of \`<${record.item}>\` component`));
      }
      break;

    case "prop":
      if (record.replacement) {
        steps.push(
          createMigrationStep(`Rename prop \`${record.item}\` to \`${record.replacement}\``, {
            before: `<Component ${record.item}="value" />`,
            after: `<Component ${record.replacement}="value" />`,
          })
        );
      } else {
        steps.push(createMigrationStep(`Remove prop \`${record.item}\``));
      }
      break;

    case "css-variable":
      if (record.replacement) {
        steps.push(
          createMigrationStep(
            `Replace CSS variable \`${record.item}\` with \`${record.replacement}\``,
            {
              before: `var(${record.item})`,
              after: `var(${record.replacement})`,
              automated: true,
            }
          )
        );
      } else {
        steps.push(createMigrationStep(`Remove usage of CSS variable \`${record.item}\``));
      }
      break;

    case "utility":
      if (record.replacement) {
        steps.push(
          createMigrationStep(`Replace \`${record.item}\` with \`${record.replacement}\``, {
            before: `import { ${record.item} } from '@ds/utils'`,
            after: `import { ${record.replacement} } from '@ds/utils'`,
          })
        );
      } else {
        steps.push(createMigrationStep(`Remove usage of \`${record.item}\` utility`));
      }
      break;

    case "pattern":
      steps.push(
        createMigrationStep(`Review and update code following the \`${record.item}\` pattern`)
      );
      if (record.replacement) {
        steps.push(createMigrationStep(`Adopt the new \`${record.replacement}\` pattern`));
      }
      break;
  }

  // Add testing step
  steps.push(createMigrationStep("Run tests to verify migration was successful"));

  return steps;
}

/**
 * Estimate migration effort based on deprecation type and scope
 */
export function estimateMigrationEffort(
  deprecations: DeprecationRecord[]
): "low" | "medium" | "high" {
  // Count by type (components are harder than props)
  const componentCount = deprecations.filter((d) => d.type === "component").length;
  const patternCount = deprecations.filter((d) => d.type === "pattern").length;
  const otherCount = deprecations.length - componentCount - patternCount;

  // Weighted score
  const score = componentCount * 3 + patternCount * 2 + otherCount;

  if (score <= 2) return "low";
  if (score <= 5) return "medium";
  return "high";
}

/**
 * Generate version-to-version migration guide
 */
export function generateVersionMigration(
  fromVersion: string,
  toVersion: string,
  deprecations: DeprecationRecord[]
): MigrationGuideData {
  const breakingChanges = deprecations.map((d) => ({
    item: d.item,
    type: d.type,
    reason: d.reason ?? `${d.item} has been deprecated.`,
    migration: deprecationToMigrationSteps(d),
  }));

  return {
    title: `Migration Guide: ${fromVersion} to ${toVersion}`,
    fromVersion,
    toVersion,
    breakingChanges,
    effort: estimateMigrationEffort(deprecations),
    prerequisites: [
      `Ensure you're on version ${fromVersion} before starting`,
      "Review the changelog for this version",
      "Backup your project before making changes",
    ],
  };
}
