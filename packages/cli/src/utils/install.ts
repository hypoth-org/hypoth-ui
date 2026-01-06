/**
 * Package installation utilities
 */

import { execa } from "execa";
import type { PackageManager } from "../types/index.js";

/**
 * Install npm packages using the detected package manager
 */
export async function installPackages(
  packages: string[],
  packageManager: PackageManager,
  options: {
    cwd?: string;
    dev?: boolean;
    silent?: boolean;
  } = {}
): Promise<void> {
  const { cwd = process.cwd(), dev = false, silent = false } = options;

  if (packages.length === 0) {
    return;
  }

  const command = getCommand(packageManager);
  const args = getArgs(packageManager, packages, dev);

  await execa(command, args, {
    cwd,
    stdio: silent ? "ignore" : "inherit",
  });
}

/**
 * Get the package manager command
 */
function getCommand(pm: PackageManager): string {
  return pm; // npm, pnpm, yarn, bun are all valid commands
}

/**
 * Get the install arguments for a package manager
 */
function getArgs(pm: PackageManager, packages: string[], dev: boolean): string[] {
  const devFlag = dev ? getDevFlag(pm) : null;
  const installCommand = getInstallSubcommand(pm);

  const args = [installCommand, ...packages];
  if (devFlag) {
    args.push(devFlag);
  }

  return args;
}

/**
 * Get the install subcommand for a package manager
 */
function getInstallSubcommand(pm: PackageManager): string {
  switch (pm) {
    case "yarn":
    case "pnpm":
    case "bun":
      return "add";
    default:
      return "install";
  }
}

/**
 * Get the dev dependency flag for a package manager
 */
function getDevFlag(pm: PackageManager): string {
  switch (pm) {
    case "yarn":
    case "pnpm":
    case "bun":
      return "-D";
    default:
      return "--save-dev";
  }
}

/**
 * Check if a package is installed by trying to resolve it
 */
export async function isPackageInstalled(
  packageName: string,
  cwd: string = process.cwd()
): Promise<boolean> {
  try {
    // Check if package exists in node_modules
    const { stdout } = await execa("node", ["-e", `require.resolve('${packageName}')`], {
      cwd,
      reject: false,
    });
    return stdout !== undefined;
  } catch {
    return false;
  }
}

/**
 * Install packages with retry logic
 */
export async function installPackagesWithRetry(
  packages: string[],
  packageManager: PackageManager,
  options: {
    cwd?: string;
    dev?: boolean;
    silent?: boolean;
    maxRetries?: number;
  } = {}
): Promise<void> {
  const { maxRetries = 3, ...installOptions } = options;

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await installPackages(packages, packageManager, installOptions);
      return;
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  throw new Error(
    `Failed to install packages after ${maxRetries} attempts: ${lastError?.message}`
  );
}
