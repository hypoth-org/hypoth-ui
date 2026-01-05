"use client";

import type { ComponentConformance } from "@ds/docs-core/conformance";
import Link from "next/link";
import { StatusBadge } from "./StatusBadge";

interface ConformanceTableProps {
  components: ComponentConformance[];
}

export function ConformanceTable({ components }: ConformanceTableProps) {
  if (components.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">No components match the current filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
            >
              Component
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
            >
              Category
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
            >
              Automated
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
            >
              Manual Audit
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
            >
              Last Updated
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {components.map((component) => (
            <tr key={component.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className="px-4 py-3">
                <Link
                  href={`/accessibility/${component.id}`}
                  className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {component.name}
                </Link>
                <div className="text-xs text-gray-500">{component.id}</div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {component.category}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={component.status} size="sm" />
              </td>
              <td className="px-4 py-3 text-sm">
                {component.automatedPassed ? (
                  <span className="text-green-600 dark:text-green-400">✓ Passed</span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">✗ Failed</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm">
                {component.manualAuditComplete ? (
                  <span className="text-green-600 dark:text-green-400">
                    {component.passCount}/{(component.passCount ?? 0) + (component.failCount ?? 0)}{" "}
                    passed
                  </span>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">Not audited</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {component.lastAuditDate
                  ? new Date(component.lastAuditDate).toLocaleDateString()
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
