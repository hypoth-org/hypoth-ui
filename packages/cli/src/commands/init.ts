/**
 * Init command - Initialize hypoth-ui in a project
 *
 * Usage:
 *   npx @hypoth-ui/cli init
 *   npx @hypoth-ui/cli init --style copy --framework react
 *   npx @hypoth-ui/cli init -y
 */

import * as p from "@clack/prompts";
import pc from "picocolors";
import type { DSConfig, Framework, InitOptions, PackageManager } from "../types/index.js";
import { configExists, createConfig, readConfig, writeConfig } from "../utils/config.js";
import { detectProject, isValidProject } from "../utils/detect.js";
import { installPackages } from "../utils/install.js";

/**
 * Core packages that are always installed (never copied)
 */
const CORE_PACKAGES = ["@hypoth-ui/tokens"];

/**
 * Execute the init command
 */
export async function initCommand(options: InitOptions = {}): Promise<void> {
  p.intro(pc.bgCyan(pc.black(" hypoth-ui init ")));

  const cwd = process.cwd();

  // Check for valid project
  if (!isValidProject(cwd)) {
    p.cancel(
      pc.red("No package.json found. Please run this command in a valid project directory.")
    );
    process.exit(1);
  }

  // Check for existing config
  if (configExists(cwd)) {
    const shouldReset = await handleExistingConfig(cwd, options);
    if (!shouldReset) {
      p.cancel("Init cancelled.");
      process.exit(0);
    }
  }

  // Detect project environment
  const detection = detectProject(cwd);

  p.log.info(
    `Detected: ${pc.cyan(detection.framework)} framework, ${pc.cyan(detection.packageManager)} package manager, TypeScript: ${pc.cyan(String(detection.typescript))}`
  );

  // Gather configuration
  const config = options.yes
    ? createConfigFromDefaults(detection)
    : await promptForConfig(detection, options);

  // Write configuration
  const spinner = p.spinner();
  spinner.start("Creating ds.config.json");

  writeConfig(config, cwd);
  spinner.stop("Created ds.config.json");

  // Install core packages
  spinner.start(`Installing ${CORE_PACKAGES.join(", ")}...`);

  try {
    await installPackages(CORE_PACKAGES, config.packageManager, { cwd });
    spinner.stop(`Installed ${CORE_PACKAGES.join(", ")}`);
  } catch (error) {
    spinner.stop(pc.red(`Failed to install packages: ${(error as Error).message}`));
    p.log.warn("You may need to install packages manually:");
    p.log.info(`  ${getInstallCommandForDisplay(config.packageManager, CORE_PACKAGES)}`);
  }

  // Success message
  p.outro(pc.green("hypoth-ui initialized successfully!"));

  displayNextSteps(config);
}

/**
 * Handle existing configuration
 */
async function handleExistingConfig(cwd: string, options: InitOptions): Promise<boolean> {
  if (options.yes) {
    p.log.warn("Overwriting existing ds.config.json");
    return true;
  }

  const existingConfig = readConfig(cwd);
  const componentsCount = existingConfig.components.length;

  p.log.warn(`Found existing ds.config.json with ${componentsCount} installed component(s)`);

  const action = await p.select({
    message: "What would you like to do?",
    options: [
      { value: "cancel", label: "Cancel" },
      { value: "reset", label: "Reset configuration (keep installed components)" },
      { value: "overwrite", label: "Overwrite completely (lose component tracking)" },
    ],
  });

  if (p.isCancel(action) || action === "cancel") {
    return false;
  }

  if (action === "reset") {
    // Keep components list when resetting
    p.log.info("Component tracking will be preserved.");
  }

  return true;
}

/**
 * Prompt user for configuration options
 */
async function promptForConfig(
  detection: ReturnType<typeof detectProject>,
  options: InitOptions
): Promise<DSConfig> {
  const style = options.style ?? (await promptForStyle());
  const framework = options.framework ?? (await promptForFramework(detection));
  const paths = await promptForPaths(detection, framework);

  return createConfig({
    style,
    framework,
    typescript: detection.typescript,
    packageManager: detection.packageManager,
    paths,
    aliases: {
      components: `@/${paths.components.replace(/^src\//, "")}`,
      lib: `@/${paths.utils.replace(/^src\//, "")}`,
    },
  });
}

/**
 * Prompt for installation style
 */
async function promptForStyle(): Promise<"copy" | "package"> {
  const style = await p.select({
    message: "How would you like to install components?",
    options: [
      {
        value: "package",
        label: "Package mode (recommended)",
        hint: "Install as npm packages - easier updates, tree-shakeable",
      },
      {
        value: "copy",
        label: "Copy mode",
        hint: "Copy source files - full customization, you own the code",
      },
    ],
  });

  if (p.isCancel(style)) {
    p.cancel("Init cancelled.");
    process.exit(0);
  }

  return style as "copy" | "package";
}

/**
 * Prompt for framework selection
 */
async function promptForFramework(detection: ReturnType<typeof detectProject>): Promise<Framework> {
  // If detection is confident, use it
  if (detection.framework !== "unknown" && detection.confidence === "high") {
    const useDetected = await p.confirm({
      message: `Use detected framework: ${detection.framework}?`,
      initialValue: true,
    });

    if (p.isCancel(useDetected)) {
      p.cancel("Init cancelled.");
      process.exit(0);
    }

    if (useDetected) {
      return detection.framework as Framework;
    }
  }

  const framework = await p.select({
    message: "Which framework are you using?",
    options: [
      { value: "next", label: "Next.js (React)" },
      { value: "react", label: "React" },
      { value: "wc", label: "Web Components (Lit)" },
      { value: "vanilla", label: "Vanilla JS (Web Components)" },
    ],
    initialValue: detection.framework !== "unknown" ? detection.framework : "react",
  });

  if (p.isCancel(framework)) {
    p.cancel("Init cancelled.");
    process.exit(0);
  }

  return framework as Framework;
}

/**
 * Prompt for path configuration
 */
async function promptForPaths(
  detection: ReturnType<typeof detectProject>,
  framework: Framework
): Promise<{ components: string; utils: string }> {
  const srcDir = detection.srcDir;

  // Framework-specific defaults
  const defaultComponentsPath =
    framework === "next" ? `${srcDir}/components/ui` : `${srcDir}/components/ui`;

  const defaultUtilsPath = framework === "next" ? `${srcDir}/lib` : `${srcDir}/lib`;

  const componentsPath = await p.text({
    message: "Where should components be placed?",
    initialValue: defaultComponentsPath,
    placeholder: defaultComponentsPath,
  });

  if (p.isCancel(componentsPath)) {
    p.cancel("Init cancelled.");
    process.exit(0);
  }

  const utilsPath = await p.text({
    message: "Where should utility files be placed?",
    initialValue: defaultUtilsPath,
    placeholder: defaultUtilsPath,
  });

  if (p.isCancel(utilsPath)) {
    p.cancel("Init cancelled.");
    process.exit(0);
  }

  return {
    components: componentsPath as string,
    utils: utilsPath as string,
  };
}

/**
 * Create config from defaults (for -y flag)
 */
function createConfigFromDefaults(detection: ReturnType<typeof detectProject>): DSConfig {
  const framework = detection.framework !== "unknown" ? detection.framework : "react";
  const srcDir = detection.srcDir;

  return createConfig({
    style: "package",
    framework: framework as Framework,
    typescript: detection.typescript,
    packageManager: detection.packageManager,
    paths: {
      components: `${srcDir}/components/ui`,
      utils: `${srcDir}/lib`,
    },
    aliases: {
      components: "@/components/ui",
      lib: "@/lib",
    },
  });
}

/**
 * Display next steps after successful init
 */
function displayNextSteps(config: DSConfig): void {
  console.log("");
  console.log(pc.bold("Next steps:"));
  console.log("");
  console.log(`  ${pc.cyan("1.")} Add a component:`);
  console.log(`     ${pc.dim("npx @hypoth-ui/cli add button")}`);
  console.log("");
  console.log(`  ${pc.cyan("2.")} List available components:`);
  console.log(`     ${pc.dim("npx @hypoth-ui/cli list")}`);
  console.log("");

  if (config.style === "copy") {
    console.log(
      `  ${pc.cyan("3.")} Components will be copied to: ${pc.dim(config.paths.components)}`
    );
    console.log("");
  }
}

/**
 * Get display-friendly install command
 */
function getInstallCommandForDisplay(pm: PackageManager, packages: string[]): string {
  const pkgList = packages.join(" ");
  switch (pm) {
    case "pnpm":
      return `pnpm add ${pkgList}`;
    case "yarn":
      return `yarn add ${pkgList}`;
    case "bun":
      return `bun add ${pkgList}`;
    default:
      return `npm install ${pkgList}`;
  }
}
