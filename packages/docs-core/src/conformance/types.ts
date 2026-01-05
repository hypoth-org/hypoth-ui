/**
 * Conformance types for documentation integration
 *
 * These types are used by the docs site to display accessibility conformance data
 */

export type ConformanceStatus = "conformant" | "partial" | "non-conformant" | "pending";

export interface ComponentConformance {
  id: string;
  name: string;
  category: string;
  status: ConformanceStatus;
  wcagLevel: "A" | "AA" | "AAA";
  lastAuditDate?: string;
  lastAuditor?: string;
  automatedPassed: boolean;
  manualAuditComplete: boolean;
  passCount?: number;
  failCount?: number;
  exceptionCount?: number;
}

export interface ConformanceData {
  version: string;
  generatedAt: string;
  wcagVersion: "2.0" | "2.1" | "2.2";
  targetLevel: "A" | "AA" | "AAA";
  components: ComponentConformance[];
  summary: {
    total: number;
    conformant: number;
    partial: number;
    nonConformant: number;
    pending: number;
    conformancePercentage: number;
  };
}

export interface CategoryInfo {
  id: string;
  name: string;
  count: number;
}

export interface ConformanceFilterOptions {
  category?: string;
  status?: ConformanceStatus;
  searchQuery?: string;
}

export interface TenantConformanceConfig {
  /**
   * Base conformance data to extend
   */
  extends?: string;

  /**
   * Additional components specific to this tenant
   */
  additionalComponents?: Array<{
    id: string;
    name: string;
    category: string;
    auditRecordPath?: string;
  }>;

  /**
   * Components to exclude from display
   */
  excludeComponents?: string[];

  /**
   * Custom categories for filtering
   */
  customCategories?: CategoryInfo[];
}
