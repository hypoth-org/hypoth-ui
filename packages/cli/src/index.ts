#!/usr/bin/env node
/**
 * @hypoth-ui/cli - Component installation CLI
 *
 * Usage:
 *   npx @hypoth-ui/cli init          Initialize hypoth-ui in your project
 *   npx @hypoth-ui/cli add <name>    Add a component to your project
 *   npx @hypoth-ui/cli list          List available components
 *   npx @hypoth-ui/cli diff          Check for component updates
 */

import { Command } from "commander";
import type { AddOptions, DiffOptions, InitOptions, ListOptions } from "./types/index.js";

// Package version (will be injected at build time)
const VERSION = "0.0.1";

const program = new Command();

program.name("hypoth-ui").description("CLI for installing hypoth-ui components").version(VERSION);

// =============================================================================
// init command
// =============================================================================

program
  .command("init")
  .description("Initialize hypoth-ui in your project")
  .option("-s, --style <style>", "Installation style (copy or package)")
  .option("-f, --framework <framework>", "Framework (react, next, wc, vanilla)")
  .option("-y, --yes", "Skip prompts and use defaults")
  .action(async (options: InitOptions) => {
    const { initCommand } = await import("./commands/init.js");
    await initCommand(options);
  });

// =============================================================================
// add command
// =============================================================================

program
  .command("add")
  .description("Add components to your project")
  .argument("[components...]", "Component names to add")
  .option("-o, --overwrite", "Overwrite existing components")
  .option("-a, --all", "Add all available components")
  .action(async (components: string[], options: AddOptions) => {
    const { addCommand } = await import("./commands/add.js");
    await addCommand(components, options);
  });

// =============================================================================
// list command
// =============================================================================

program
  .command("list")
  .description("List available components")
  .option("-j, --json", "Output as JSON")
  .action(async (options: ListOptions) => {
    const { listCommand } = await import("./commands/list.js");
    await listCommand(options);
  });

// =============================================================================
// diff command
// =============================================================================

program
  .command("diff")
  .description("Check for component updates")
  .option("-j, --json", "Output as JSON")
  .action(async (options: DiffOptions) => {
    const { diffCommand } = await import("./commands/diff.js");
    await diffCommand(options);
  });

// =============================================================================
// Parse and execute
// =============================================================================

program.parse();
