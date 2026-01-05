"use client";

import type { CategoryInfo, ConformanceStatus } from "@ds/docs-core/conformance";
import { useState } from "react";

interface CategoryFilterProps {
  categories: CategoryInfo[];
  selectedCategory: string | null;
  selectedStatus: ConformanceStatus | null;
  onCategoryChange: (category: string | null) => void;
  onStatusChange: (status: ConformanceStatus | null) => void;
  onSearchChange: (query: string) => void;
}

const STATUSES: Array<{ value: ConformanceStatus; label: string }> = [
  { value: "conformant", label: "Conformant" },
  { value: "partial", label: "Partial" },
  { value: "non-conformant", label: "Non-Conformant" },
  { value: "pending", label: "Pending" },
];

export function CategoryFilter({
  categories,
  selectedCategory,
  selectedStatus,
  onCategoryChange,
  onStatusChange,
  onSearchChange,
}: CategoryFilterProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Search */}
      <div>
        <label htmlFor="search" className="sr-only">
          Search components
        </label>
        <input
          type="search"
          id="search"
          placeholder="Search components..."
          value={searchValue}
          onChange={handleSearchChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Category filter */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            value={selectedCategory ?? ""}
            onChange={(e) => onCategoryChange(e.target.value || null)}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.count})
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            value={selectedStatus ?? ""}
            onChange={(e) => onStatusChange((e.target.value as ConformanceStatus) || null)}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear filters */}
        {(selectedCategory || selectedStatus || searchValue) && (
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                onCategoryChange(null);
                onStatusChange(null);
                setSearchValue("");
                onSearchChange("");
              }}
              className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
