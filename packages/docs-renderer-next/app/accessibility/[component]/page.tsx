"use client";

import type { ComponentConformance } from "@ds/docs-core";
import Link from "next/link";
import { use } from "react";
import { StatusBadge } from "../StatusBadge";

// Placeholder component data
const COMPONENT_DATA: Record<string, ComponentConformance> = {
  "ds-button": {
    id: "ds-button",
    name: "Button",
    category: "form-controls",
    status: "conformant",
    wcagLevel: "AA",
    lastAuditDate: "2026-01-04T10:00:00Z",
    lastAuditor: "auditor@example.com",
    automatedPassed: true,
    manualAuditComplete: true,
    passCount: 10,
    failCount: 0,
    exceptionCount: 0,
  },
};

interface ComponentPageProps {
  params: Promise<{
    component: string;
  }>;
}

export default function ComponentDetailPage({ params }: ComponentPageProps) {
  const { component: componentId } = use(params);
  const component = COMPONENT_DATA[componentId];

  if (!component) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Component Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No accessibility data found for component: {componentId}
        </p>
        <Link
          href="/accessibility"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          ← Back to Accessibility Conformance
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link
          href="/accessibility"
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          Accessibility Conformance
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-900 dark:text-gray-100">{component.name}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{component.name}</h1>
          <StatusBadge status={component.status} />
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {component.id} • {component.category}
        </p>
      </header>

      {/* Status summary */}
      <section className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {component.automatedPassed ? "✓ Passed" : "✗ Failed"}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Automated Tests</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {component.manualAuditComplete ? "Complete" : "Pending"}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Manual Audit</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            WCAG {component.wcagLevel}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Target Level</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {component.lastAuditDate ? new Date(component.lastAuditDate).toLocaleDateString() : "—"}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Last Audit</div>
        </div>
      </section>

      {/* Manual audit results */}
      {component.manualAuditComplete && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Manual Audit Results
          </h2>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {component.passCount ?? 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {component.failCount ?? 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {component.exceptionCount ?? 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Exceptions</div>
              </div>
            </div>
            {component.lastAuditor && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                Audited by: {component.lastAuditor}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Component documentation link */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Documentation
        </h2>
        <Link
          href={`/components/${component.id.replace("ds-", "")}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          View {component.name} component documentation →
        </Link>
      </section>

      {/* Back link */}
      <Link
        href="/accessibility"
        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        ← Back to Accessibility Conformance
      </Link>
    </div>
  );
}
