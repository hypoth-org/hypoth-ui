/**
 * Conformance data loader for documentation
 *
 * Loads and transforms conformance report data for display in docs
 */

import * as fs from "node:fs";
import * as path from "node:path";
import type {
  CategoryInfo,
  ComponentConformance,
  ConformanceData,
  ConformanceFilterOptions,
  TenantConformanceConfig,
} from "./types.js";

/**
 * Category mapping for components
 */
const CATEGORY_MAP: Record<string, string> = {
  "ds-button": "form-controls",
  "ds-input": "form-controls",
  "ds-checkbox": "form-controls",
  "ds-radio": "form-controls",
  "ds-switch": "form-controls",
  "ds-textarea": "form-controls",
  "ds-field": "form-controls",
  "ds-dialog": "overlays",
  "ds-popover": "overlays",
  "ds-tooltip": "overlays",
  "ds-menu": "overlays",
  "ds-link": "navigation",
  "ds-spinner": "feedback",
  "ds-text": "data-display",
  "ds-icon": "data-display",
  "ds-visually-hidden": "utilities",
};

/**
 * Category display names
 */
const CATEGORY_NAMES: Record<string, string> = {
  "form-controls": "Form Controls",
  overlays: "Overlays",
  navigation: "Navigation",
  "data-display": "Data Display",
  feedback: "Feedback",
  utilities: "Utilities",
};

/**
 * Load conformance data from report JSON
 */
export function loadConformanceData(reportPath: string): ConformanceData | null {
  if (!fs.existsSync(reportPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(reportPath, "utf-8");
    const report = JSON.parse(content);

    // Transform report format to docs format
    const components: ComponentConformance[] = report.components.map((c: any) => ({
      id: c.component,
      name: formatComponentName(c.component),
      category: CATEGORY_MAP[c.component] ?? "uncategorized",
      status: c.status,
      wcagLevel: report.conformanceLevel,
      lastAuditDate: c.lastUpdated,
      lastAuditor: c.manualAudit?.auditor,
      automatedPassed: c.automatedResult?.passed ?? true,
      manualAuditComplete: !!c.manualAudit,
      passCount: c.manualAudit?.passCount,
      failCount: c.manualAudit?.failCount,
      exceptionCount: c.manualAudit?.exceptionCount,
    }));

    return {
      version: report.version,
      generatedAt: report.generatedAt,
      wcagVersion: report.wcagVersion,
      targetLevel: report.conformanceLevel,
      components,
      summary: report.summary,
    };
  } catch (error) {
    console.error(`Failed to load conformance data: ${error}`);
    return null;
  }
}

/**
 * Format component ID to display name
 */
function formatComponentName(id: string): string {
  return id
    .replace(/^ds-/, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get available categories from conformance data
 */
export function getCategories(data: ConformanceData): CategoryInfo[] {
  const categoryCounts = new Map<string, number>();

  for (const component of data.components) {
    const count = categoryCounts.get(component.category) ?? 0;
    categoryCounts.set(component.category, count + 1);
  }

  return Array.from(categoryCounts.entries()).map(([id, count]) => ({
    id,
    name: CATEGORY_NAMES[id] ?? id,
    count,
  }));
}

/**
 * Filter conformance data based on options
 */
export function filterConformanceData(
  data: ConformanceData,
  options: ConformanceFilterOptions
): ComponentConformance[] {
  let filtered = data.components;

  if (options.category) {
    filtered = filtered.filter((c) => c.category === options.category);
  }

  if (options.status) {
    filtered = filtered.filter((c) => c.status === options.status);
  }

  if (options.searchQuery) {
    const query = options.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (c) => c.id.toLowerCase().includes(query) || c.name.toLowerCase().includes(query)
    );
  }

  return filtered;
}

/**
 * Load tenant configuration and merge with base data
 */
export function loadTenantConformance(
  baseData: ConformanceData,
  configPath: string
): ConformanceData {
  if (!fs.existsSync(configPath)) {
    return baseData;
  }

  try {
    const content = fs.readFileSync(configPath, "utf-8");
    const config: TenantConformanceConfig = JSON.parse(content);

    let components = [...baseData.components];

    // Exclude components
    if (config.excludeComponents) {
      components = components.filter((c) => !config.excludeComponents?.includes(c.id));
    }

    // Add additional components
    if (config.additionalComponents) {
      for (const additional of config.additionalComponents) {
        // Check if already exists
        if (!components.some((c) => c.id === additional.id)) {
          components.push({
            id: additional.id,
            name: additional.name,
            category: additional.category,
            status: "pending",
            wcagLevel: baseData.targetLevel,
            automatedPassed: true,
            manualAuditComplete: false,
          });
        }
      }
    }

    // Recalculate summary
    const summary = {
      total: components.length,
      conformant: components.filter((c) => c.status === "conformant").length,
      partial: components.filter((c) => c.status === "partial").length,
      nonConformant: components.filter((c) => c.status === "non-conformant").length,
      pending: components.filter((c) => c.status === "pending").length,
      conformancePercentage: 0,
    };
    summary.conformancePercentage =
      summary.total > 0 ? Math.round((summary.conformant / summary.total) * 100) : 0;

    return {
      ...baseData,
      components,
      summary,
    };
  } catch (error) {
    console.error(`Failed to load tenant config: ${error}`);
    return baseData;
  }
}

/**
 * Get the latest report path
 */
export function getLatestReportPath(reportsDir: string): string | null {
  if (!fs.existsSync(reportsDir)) {
    return null;
  }

  const versions = fs
    .readdirSync(reportsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort((a, b) => {
      // Sort by semver
      const aParts = a.split(".").map(Number);
      const bParts = b.split(".").map(Number);
      const aMaj = aParts[0] ?? 0;
      const aMin = aParts[1] ?? 0;
      const aPatch = aParts[2] ?? 0;
      const bMaj = bParts[0] ?? 0;
      const bMin = bParts[1] ?? 0;
      const bPatch = bParts[2] ?? 0;
      if (aMaj !== bMaj) return bMaj - aMaj;
      if (aMin !== bMin) return bMin - aMin;
      return bPatch - aPatch;
    });

  const latestVersion = versions[0];
  if (!latestVersion) {
    return null;
  }

  return path.join(reportsDir, latestVersion, "report.json");
}
