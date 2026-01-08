/**
 * Framework and environment detection utilities
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { DetectionResult, Framework, PackageManager } from "../types/index.js";

/**
 * Detect project framework, package manager, and TypeScript usage
 */
export function detectProject(cwd: string = process.cwd()): DetectionResult {
  const signals: string[] = [];

  // Detect package manager from lock files
  const packageManager = detectPackageManager(cwd, signals);

  // Detect TypeScript
  const { typescript, tsconfigPath } = detectTypeScript(cwd, signals);

  // Detect framework from package.json
  const framework = detectFramework(cwd, signals);

  // Detect source directory
  const srcDir = detectSrcDir(cwd, signals);

  // Calculate confidence
  const confidence = calculateConfidence(signals);

  return {
    framework,
    packageManager,
    typescript,
    tsconfigPath,
    srcDir,
    confidence,
    signals,
  };
}

/**
 * Detect package manager from lock files
 * Priority: pnpm > yarn > bun > npm (most specific first)
 */
export function detectPackageManager(cwd: string, signals: string[]): PackageManager {
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) {
    signals.push("pnpm-lock.yaml found");
    return "pnpm";
  }

  if (existsSync(join(cwd, "yarn.lock"))) {
    signals.push("yarn.lock found");
    return "yarn";
  }

  if (existsSync(join(cwd, "bun.lockb"))) {
    signals.push("bun.lockb found");
    return "bun";
  }

  if (existsSync(join(cwd, "package-lock.json"))) {
    signals.push("package-lock.json found");
    return "npm";
  }

  signals.push("No lock file found, defaulting to npm");
  return "npm";
}

/**
 * Detect TypeScript from tsconfig presence
 */
export function detectTypeScript(
  cwd: string,
  signals: string[]
): { typescript: boolean; tsconfigPath?: string } {
  const tsconfigPaths = ["tsconfig.json", "tsconfig.base.json", "jsconfig.json"];

  for (const configPath of tsconfigPaths) {
    const fullPath = join(cwd, configPath);
    if (existsSync(fullPath)) {
      const isTypescript = configPath !== "jsconfig.json";
      signals.push(`${configPath} found (TypeScript: ${isTypescript})`);
      return {
        typescript: isTypescript,
        tsconfigPath: isTypescript ? fullPath : undefined,
      };
    }
  }

  signals.push("No tsconfig.json found, assuming JavaScript");
  return { typescript: false };
}

/**
 * Detect framework from package.json dependencies
 */
export function detectFramework(cwd: string, signals: string[]): Framework | "unknown" {
  const packageJsonPath = join(cwd, "package.json");

  if (!existsSync(packageJsonPath)) {
    signals.push("No package.json found");
    return "unknown";
  }

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    // Check for Next.js (implies React)
    if (deps.next) {
      signals.push("next found in dependencies → Next.js (React)");
      return "next";
    }

    // Check for React (without Next.js)
    if (deps.react) {
      signals.push("react found in dependencies → React");
      return "react";
    }

    // Check for Lit (Web Components)
    if (deps.lit) {
      signals.push("lit found in dependencies → Web Components");
      return "wc";
    }

    // Check for @lit packages
    if (Object.keys(deps).some((key) => key.startsWith("@lit/"))) {
      signals.push("@lit/* found in dependencies → Web Components");
      return "wc";
    }

    signals.push("No recognized framework in dependencies → vanilla");
    return "vanilla";
  } catch {
    signals.push("Failed to parse package.json");
    return "unknown";
  }
}

/**
 * Detect source directory
 */
export function detectSrcDir(cwd: string, signals: string[]): string {
  // Common source directories in priority order
  const srcDirs = ["src", "app", "lib", "source"];

  for (const dir of srcDirs) {
    if (existsSync(join(cwd, dir))) {
      signals.push(`${dir}/ directory found`);
      return dir;
    }
  }

  signals.push("No common source directory found, defaulting to src");
  return "src";
}

/**
 * Calculate detection confidence based on signals
 */
function calculateConfidence(signals: string[]): "high" | "medium" | "low" {
  const positiveSignals = signals.filter(
    (s) => !s.includes("defaulting") && !s.includes("No ")
  ).length;

  if (positiveSignals >= 3) return "high";
  if (positiveSignals >= 2) return "medium";
  return "low";
}

/**
 * Check if running in a valid project (has package.json)
 */
export function isValidProject(cwd: string = process.cwd()): boolean {
  return existsSync(join(cwd, "package.json"));
}

/**
 * Get package manager command for install
 */
export function getInstallCommand(pm: PackageManager): string {
  switch (pm) {
    case "pnpm":
      return "pnpm add";
    case "yarn":
      return "yarn add";
    case "bun":
      return "bun add";
    default:
      return "npm install";
  }
}
