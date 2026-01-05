#!/usr/bin/env node
import { Command } from "commander";
import { describeSeverityThreshold, parseSeverityThreshold } from "../lib/config.js";

const program = new Command();

program
  .name("a11y-audit")
  .description(
    "Accessibility audit tooling for automated checks, manual checklists, and conformance reporting"
  )
  .version("0.0.0");

program
  .command("audit")
  .description("Start a manual accessibility audit for a component")
  .requiredOption("-c, --component <id>", "Component ID (e.g., ds-button)")
  .requiredOption(
    "--category <category>",
    "Component category (form-controls, overlays, navigation, data-display, feedback)"
  )
  .option("-v, --version <version>", "Component version (default: current)")
  .action(async (options) => {
    const { audit } = await import("./audit.js");
    await audit(options);
  });

program
  .command("validate")
  .description("Validate audit records and checklist templates")
  .option("-p, --path <path>", "Path to audit records directory", "a11y-audits/records")
  .option("--strict", "Fail on any validation warning")
  .action(async (options) => {
    const { validate } = await import("./validate.js");
    await validate(options);
  });

program
  .command("report")
  .description("Generate a conformance report for a release")
  .requiredOption("-v, --version <version>", "Release version (e.g., 1.0.0)")
  .option("-o, --output <dir>", "Output directory", "a11y-audits/reports")
  .option("--format <formats>", "Output formats (json,html)", "json,html")
  .action(async (options) => {
    const { report } = await import("./report.js");
    await report(options);
  });

program
  .command("check")
  .description("Run automated accessibility checks (used by CI)")
  .option(
    "-s, --severity <levels>",
    'Severity threshold (critical,serious,moderate,minor or "all")'
  )
  .option("--json", "Output results as JSON")
  .action(async (options) => {
    const threshold = parseSeverityThreshold(options.severity);
    console.info(`Running a11y checks, failing on ${describeSeverityThreshold(threshold)}`);
    // CI check implementation will be added in Phase 3
    console.info("Automated check command - implementation pending");
  });

program.parse();
