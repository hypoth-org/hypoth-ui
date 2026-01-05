"use client";

import type { ConformanceStatus } from "@ds/docs-core/conformance";

interface StatusBadgeProps {
  status: ConformanceStatus;
  size?: "sm" | "md";
}

const STATUS_CONFIG: Record<ConformanceStatus, { icon: string; label: string; className: string }> =
  {
    conformant: {
      icon: "✅",
      label: "Conformant",
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    partial: {
      icon: "⚠️",
      label: "Partial",
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    },
    "non-conformant": {
      icon: "❌",
      label: "Non-Conformant",
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
    pending: {
      icon: "⏳",
      label: "Pending Audit",
      className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    },
  };

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.className} ${sizeClasses}`}
    >
      <span aria-hidden="true">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
