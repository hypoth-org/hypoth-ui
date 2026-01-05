"use client";

import type { CategoryInfo, ConformanceData, ConformanceStatus } from "@ds/docs-core";
import { useMemo, useState } from "react";
import { CategoryFilter } from "./CategoryFilter";
import { ConformanceTable } from "./ConformanceTable";

// Placeholder data - in production, this would be loaded from the conformance report
const PLACEHOLDER_DATA: ConformanceData = {
  version: "0.0.0",
  generatedAt: new Date().toISOString(),
  wcagVersion: "2.1",
  targetLevel: "AA",
  components: [
    {
      id: "ds-button",
      name: "Button",
      category: "form-controls",
      status: "conformant",
      wcagLevel: "AA",
      automatedPassed: true,
      manualAuditComplete: true,
      passCount: 10,
      failCount: 0,
    },
    {
      id: "ds-input",
      name: "Input",
      category: "form-controls",
      status: "conformant",
      wcagLevel: "AA",
      automatedPassed: true,
      manualAuditComplete: true,
      passCount: 10,
      failCount: 0,
    },
    {
      id: "ds-checkbox",
      name: "Checkbox",
      category: "form-controls",
      status: "pending",
      wcagLevel: "AA",
      automatedPassed: true,
      manualAuditComplete: false,
    },
    {
      id: "ds-dialog",
      name: "Dialog",
      category: "overlays",
      status: "conformant",
      wcagLevel: "AA",
      automatedPassed: true,
      manualAuditComplete: true,
      passCount: 12,
      failCount: 0,
    },
    {
      id: "ds-tooltip",
      name: "Tooltip",
      category: "overlays",
      status: "partial",
      wcagLevel: "AA",
      automatedPassed: true,
      manualAuditComplete: true,
      passCount: 8,
      failCount: 2,
    },
  ],
  summary: {
    total: 5,
    conformant: 3,
    partial: 1,
    nonConformant: 0,
    pending: 1,
    conformancePercentage: 60,
  },
};

export default function AccessibilityPage() {
  const [data] = useState<ConformanceData>(PLACEHOLDER_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ConformanceStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get categories
  const categories = useMemo<CategoryInfo[]>(() => {
    const counts = new Map<string, number>();
    for (const c of data.components) {
      counts.set(c.category, (counts.get(c.category) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([id, count]) => ({
      id,
      name: id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      count,
    }));
  }, [data.components]);

  // Filter components
  const filteredComponents = useMemo(() => {
    let result = data.components;

    if (selectedCategory) {
      result = result.filter((c) => c.category === selectedCategory);
    }

    if (selectedStatus) {
      result = result.filter((c) => c.status === selectedStatus);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) => c.id.toLowerCase().includes(query) || c.name.toLowerCase().includes(query)
      );
    }

    return result;
  }, [data.components, selectedCategory, selectedStatus, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Accessibility Conformance
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          WCAG {data.wcagVersion} Level {data.targetLevel} conformance status for all components in
          the design system.
        </p>
      </header>

      {/* Summary cards */}
      <section className="mb-8 grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {data.summary.total}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Components</div>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <div className="text-2xl font-bold text-green-700 dark:text-green-400">
            {data.summary.conformant}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">Conformant</div>
        </div>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
            {data.summary.partial}
          </div>
          <div className="text-sm text-yellow-600 dark:text-yellow-400">Partial</div>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="text-2xl font-bold text-red-700 dark:text-red-400">
            {data.summary.nonConformant}
          </div>
          <div className="text-sm text-red-600 dark:text-red-400">Non-Conformant</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-400">
            {data.summary.pending}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Pending Audit</div>
        </div>
      </section>

      {/* Progress bar */}
      <section className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Conformance Progress</span>
          <span>{data.summary.conformancePercentage}%</span>
        </div>
        <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${data.summary.conformancePercentage}%` }}
          />
        </div>
      </section>

      {/* Filters */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        onCategoryChange={setSelectedCategory}
        onStatusChange={setSelectedStatus}
        onSearchChange={setSearchQuery}
      />

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredComponents.length} of {data.components.length} components
      </div>

      {/* Component table */}
      <ConformanceTable components={filteredComponents} />

      {/* Footer info */}
      <footer className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        <p>
          Last updated: {new Date(data.generatedAt).toLocaleDateString()} • Version: {data.version}
        </p>
      </footer>
    </div>
  );
}
