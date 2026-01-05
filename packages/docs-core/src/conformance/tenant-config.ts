/**
 * Tenant extension configuration for conformance data
 *
 * Allows white-label tenants to customize the conformance display
 */

import { getLatestReportPath, loadConformanceData, loadTenantConformance } from "./loader.js";
import type { ConformanceData, TenantConformanceConfig } from "./types.js";

export interface TenantConformanceOptions {
  /**
   * Base reports directory
   */
  reportsDir: string;

  /**
   * Tenant config file path
   */
  tenantConfigPath?: string;

  /**
   * Specific version to load (defaults to latest)
   */
  version?: string;
}

/**
 * Create a tenant conformance loader
 */
export function createTenantConformanceLoader(options: TenantConformanceOptions) {
  return {
    /**
     * Load conformance data for the tenant
     */
    load(): ConformanceData | null {
      // Get report path
      const reportPath = options.version
        ? `${options.reportsDir}/${options.version}/report.json`
        : getLatestReportPath(options.reportsDir);

      if (!reportPath) {
        return null;
      }

      // Load base data
      const baseData = loadConformanceData(reportPath);

      if (!baseData) {
        return null;
      }

      // Apply tenant customizations
      if (options.tenantConfigPath) {
        return loadTenantConformance(baseData, options.tenantConfigPath);
      }

      return baseData;
    },
  };
}

/**
 * Default tenant config for the core design system
 */
export const DEFAULT_TENANT_CONFIG: TenantConformanceConfig = {
  // No customizations for core
};

/**
 * Example tenant config factory
 */
export function createTenantConfig(
  overrides: Partial<TenantConformanceConfig> = {}
): TenantConformanceConfig {
  return {
    ...DEFAULT_TENANT_CONFIG,
    ...overrides,
  };
}
