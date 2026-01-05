/**
 * Conformance module exports
 *
 * Provides utilities for loading and displaying accessibility conformance data
 */

// Types
export type {
  ConformanceStatus,
  ComponentConformance,
  ConformanceData,
  CategoryInfo,
  ConformanceFilterOptions,
  TenantConformanceConfig,
} from "./types.js";

// Loader
export {
  loadConformanceData,
  getCategories,
  filterConformanceData,
  loadTenantConformance,
  getLatestReportPath,
} from "./loader.js";

// Tenant configuration
export {
  createTenantConformanceLoader,
  createTenantConfig,
  DEFAULT_TENANT_CONFIG,
  type TenantConformanceOptions,
} from "./tenant-config.js";
