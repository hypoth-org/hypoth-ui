/**
 * Cross-reference validation between docs and manifests
 */

import type { ContractManifest, DocsFrontmatter } from "../types/manifest.js";
import type { ValidationError, ValidationWarning } from "../types/validation.js";
import { createCrossRefError, createStatusMismatchWarning } from "./error-messages.js";

/**
 * Map of component ID to manifest for quick lookup
 */
export type ManifestMap = Map<string, ContractManifest>;

/**
 * Build a manifest map from an array of manifests
 */
export function buildManifestMap(manifests: ContractManifest[]): ManifestMap {
  const map = new Map<string, ContractManifest>();
  for (const manifest of manifests) {
    map.set(manifest.id, manifest);
  }
  return map;
}

/**
 * Validate cross-references for a single docs file
 * Note: Only validates docs that have a component field (component docs)
 */
export function validateCrossRefs(
  filePath: string,
  frontmatter: DocsFrontmatter,
  manifestMap: ManifestMap
): { errors: ValidationError[]; warnings: ValidationWarning[] } {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Skip validation if this is not a component doc
  if (!frontmatter.component) {
    return { errors, warnings };
  }

  // Check if referenced component exists
  const manifest = manifestMap.get(frontmatter.component);

  if (!manifest) {
    errors.push(
      createCrossRefError(
        filePath,
        "/component",
        frontmatter.component,
        "Referenced component not found in manifests"
      )
    );
    return { errors, warnings };
  }

  // Check status match
  if (frontmatter.status && frontmatter.status !== manifest.status) {
    warnings.push(createStatusMismatchWarning(filePath, frontmatter.status, manifest.status));
  }

  // Check edition subset (if docs specify editions)
  if (frontmatter.editions && frontmatter.editions.length > 0) {
    const invalidEditions = frontmatter.editions.filter((e) => !manifest.editions.includes(e));

    if (invalidEditions.length > 0) {
      warnings.push({
        file: filePath,
        field: "/editions",
        message: `Editions [${invalidEditions.join(", ")}] not available in component manifest`,
        code: "EDITION_OVERRIDE",
      });
    }
  }

  return { errors, warnings };
}

/**
 * Validate all cross-references between docs and manifests
 */
export function validateAllCrossRefs(
  docsResults: Array<{ filePath: string; frontmatter: DocsFrontmatter }>,
  manifestMap: ManifestMap
): { errors: ValidationError[]; warnings: ValidationWarning[] } {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationWarning[] = [];

  for (const { filePath, frontmatter } of docsResults) {
    const { errors, warnings } = validateCrossRefs(filePath, frontmatter, manifestMap);
    allErrors.push(...errors);
    allWarnings.push(...warnings);
  }

  return { errors: allErrors, warnings: allWarnings };
}

/**
 * Check for orphaned docs (docs referencing non-existent components)
 * Only considers docs that have a component field
 */
export function findOrphanedDocs(
  docsResults: Array<{ filePath: string; frontmatter: DocsFrontmatter }>,
  manifestMap: ManifestMap
): string[] {
  return docsResults
    .filter(({ frontmatter }) => frontmatter.component && !manifestMap.has(frontmatter.component))
    .map(({ filePath }) => filePath);
}

/**
 * Check for undocumented components (manifests without corresponding docs)
 */
export function findUndocumentedComponents(
  manifestMap: ManifestMap,
  documentedComponents: Set<string>
): ContractManifest[] {
  const undocumented: ContractManifest[] = [];

  for (const [id, manifest] of manifestMap) {
    if (!documentedComponents.has(id)) {
      undocumented.push(manifest);
    }
  }

  return undocumented;
}

/**
 * Generate a cross-reference report
 */
export interface CrossRefReport {
  /** Components with both manifest and docs */
  documented: string[];
  /** Components with manifest but no docs */
  undocumented: string[];
  /** Docs referencing non-existent components */
  orphanedDocs: string[];
  /** Status mismatches between docs and manifests */
  statusMismatches: Array<{
    component: string;
    docStatus: string;
    manifestStatus: string;
  }>;
}

export function generateCrossRefReport(
  docsResults: Array<{ filePath: string; frontmatter: DocsFrontmatter }>,
  manifestMap: ManifestMap
): CrossRefReport {
  const documentedComponents = new Set<string>();
  const orphanedDocs: string[] = [];
  const statusMismatches: CrossRefReport["statusMismatches"] = [];

  for (const { filePath, frontmatter } of docsResults) {
    // Skip docs without component reference (guides, etc.)
    if (!frontmatter.component) {
      continue;
    }

    const manifest = manifestMap.get(frontmatter.component);

    if (!manifest) {
      orphanedDocs.push(filePath);
    } else {
      documentedComponents.add(frontmatter.component);

      if (frontmatter.status && frontmatter.status !== manifest.status) {
        statusMismatches.push({
          component: frontmatter.component,
          docStatus: frontmatter.status,
          manifestStatus: manifest.status,
        });
      }
    }
  }

  const undocumented = findUndocumentedComponents(manifestMap, documentedComponents);

  return {
    documented: Array.from(documentedComponents),
    undocumented: undocumented.map((m) => m.id),
    orphanedDocs,
    statusMismatches,
  };
}
