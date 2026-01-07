/**
 * Add command - Add components to a project
 *
 * Usage:
 *   npx @hypoth-ui/cli add button
 *   npx @hypoth-ui/cli add button dialog menu
 *   npx @hypoth-ui/cli add --all
 */

import * as p from "@clack/prompts";
import pc from "picocolors";
import type { AddOptions, ComponentDefinition, DSConfig } from "../types/index.js";
import {
  addInstalledComponent,
  isComponentInstalled,
  readConfig,
  writeConfig,
} from "../utils/config.js";
import { copyComponentFiles, ensureComponentsDir } from "../utils/copy.js";
import { installPackages } from "../utils/install.js";
import {
  getComponent,
  getComponentNames,
  getNpmDependencies,
  isComponentCompatible,
  loadBundledRegistry,
  resolveDependencies,
} from "../utils/registry.js";

/**
 * Execute the add command
 */
export async function addCommand(componentArgs: string[], options: AddOptions = {}): Promise<void> {
  p.intro(pc.bgCyan(pc.black(" hypoth-ui add ")));

  const cwd = process.cwd();

  // Load config
  let config: DSConfig;
  try {
    config = readConfig(cwd);
  } catch (error) {
    p.cancel(pc.red((error as Error).message));
    process.exit(1);
  }

  // Load registry
  const registry = loadBundledRegistry();

  // Handle --all flag
  const components = options.all ? getComponentNames(registry) : componentArgs;

  if (options.all) {
    p.log.info(`Installing all ${components.length} components`);
  }

  // Validate at least one component specified
  if (components.length === 0) {
    p.cancel(pc.red("No components specified. Usage: npx @hypoth-ui/cli add <component>"));
    process.exit(1);
  }

  // Validate all components exist
  const invalidComponents: string[] = [];
  const validComponents: ComponentDefinition[] = [];

  for (const name of components) {
    const component = getComponent(registry, name);
    if (!component) {
      invalidComponents.push(name);
    } else if (!isComponentCompatible(component, config.framework)) {
      p.log.warn(`${pc.yellow(name)} is not compatible with ${config.framework}`);
    } else {
      validComponents.push(component);
    }
  }

  if (invalidComponents.length > 0) {
    p.log.error(`Unknown components: ${invalidComponents.join(", ")}`);
    p.log.info(`Run ${pc.cyan("npx @hypoth-ui/cli list")} to see available components`);
    if (validComponents.length === 0) {
      process.exit(1);
    }
  }

  // Check for already installed components
  const toInstall: ComponentDefinition[] = [];
  const skipped: string[] = [];

  for (const component of validComponents) {
    if (isComponentInstalled(config, component.name) && !options.overwrite) {
      skipped.push(component.name);
    } else {
      toInstall.push(component);
    }
  }

  if (skipped.length > 0) {
    p.log.info(`Skipping already installed: ${skipped.join(", ")} (use --overwrite to replace)`);
  }

  if (toInstall.length === 0) {
    p.outro(pc.yellow("No new components to install"));
    return;
  }

  // Resolve dependencies
  const componentsToInstall = resolveDependencies(
    registry,
    toInstall.map((c) => c.name)
  );

  // Filter out already installed dependencies (unless overwrite)
  const finalComponents = componentsToInstall.filter(
    (c) => !isComponentInstalled(config, c.name) || options.overwrite
  );

  if (finalComponents.length === 0) {
    p.outro(pc.yellow("All components already installed"));
    return;
  }

  p.log.info(`Installing: ${finalComponents.map((c) => pc.cyan(c.name)).join(", ")}`);

  // Install npm dependencies
  const npmDeps = getNpmDependencies(finalComponents);
  if (npmDeps.length > 0) {
    const spinner = p.spinner();
    spinner.start(`Installing npm dependencies: ${npmDeps.join(", ")}`);

    try {
      await installPackages(npmDeps, config.packageManager, { cwd });
      spinner.stop("Installed npm dependencies");
    } catch (error) {
      spinner.stop(pc.red(`Failed to install npm dependencies: ${(error as Error).message}`));
      process.exit(1);
    }
  }

  // Install components based on mode
  const spinner = p.spinner();

  if (config.style === "copy") {
    ensureComponentsDir(config, cwd);

    for (const component of finalComponents) {
      spinner.start(`Copying ${component.name}...`);

      try {
        const result = await copyComponentFiles(component, config, {
          cwd,
          overwrite: options.overwrite,
        });

        if (result.errors.length > 0) {
          spinner.stop(
            pc.red(
              `Failed to copy ${component.name}: ${result.errors[0]?.error ?? "Unknown error"}`
            )
          );
          continue;
        }

        // Update config
        config = addInstalledComponent(config, {
          name: component.name,
          version: component.version,
          mode: "copy",
        });

        spinner.stop(`Copied ${component.name}`);
      } catch (error) {
        spinner.stop(pc.red(`Failed to copy ${component.name}: ${(error as Error).message}`));
      }
    }
  } else {
    // Package mode - just track in config (npm deps already installed)
    for (const component of finalComponents) {
      config = addInstalledComponent(config, {
        name: component.name,
        version: component.version,
        mode: "package",
      });
    }
  }

  // Write updated config
  writeConfig(config, cwd);

  // Summary
  const installed = finalComponents.map((c) => c.name);
  p.outro(pc.green(`Added ${installed.length} component(s): ${installed.join(", ")}`));

  // Usage hint
  if (config.style === "copy") {
    console.log("");
    console.log(`Components copied to: ${pc.dim(config.paths.components)}`);
  }
}
