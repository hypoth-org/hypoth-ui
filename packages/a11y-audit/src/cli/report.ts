/**
 * CLI command: report
 *
 * Generate a conformance report for a release
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { aggregateForRelease } from "../lib/aggregator.js";
import { loadComponentList } from "../lib/manifest-loader.js";
import { generateHTMLReport } from "../lib/report-html.js";
import { generateJSONReport } from "../lib/report-json.js";
import { validateReport } from "../lib/validator.js";

export interface ReportOptions {
  version: string;
  output: string;
  format: string;
}

export async function report(options: ReportOptions): Promise<void> {
  const { version, output, format } = options;

  // Validate version format
  if (!version.match(/^\d+\.\d+\.\d+$/)) {
    console.error(`❌ Invalid version format: ${version}`);
    console.error("   Use semver format: 1.0.0, 2.1.0, etc.");
    process.exit(1);
  }

  const formats = format.split(",").map((f) => f.trim().toLowerCase());
  const validFormats = ["json", "html"];

  for (const fmt of formats) {
    if (!validFormats.includes(fmt)) {
      console.error(`❌ Invalid format: ${fmt}`);
      console.error(`   Valid formats: ${validFormats.join(", ")}`);
      process.exit(1);
    }
  }

  console.info(`
🔍 Generating conformance report
   Version: ${version}
   Output:  ${output}
   Formats: ${formats.join(", ")}
`);

  // Load component list
  const components = loadComponentList();
  console.info(`Found ${components.length} components`);

  // Aggregate data
  const recordsDir = path.resolve(process.cwd(), "a11y-audits/records");
  const componentStatuses = aggregateForRelease(components, recordsDir, version);

  // Generate JSON report
  const jsonReport = generateJSONReport({
    version,
    generatedBy: process.env.GITHUB_RUN_ID ?? "manual",
    components: componentStatuses,
    gitCommit: process.env.GITHUB_SHA,
    ciRunUrl: process.env.GITHUB_RUN_ID
      ? `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : undefined,
  });

  // Validate JSON report against schema
  const validation = validateReport(jsonReport);
  if (!validation.valid) {
    console.error("❌ Generated report failed validation:");
    for (const error of validation.errors) {
      console.error(`   - ${error}`);
    }
    process.exit(1);
  }

  // Create output directory
  const outputDir = path.resolve(process.cwd(), output, version);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write outputs
  const outputs: string[] = [];

  if (formats.includes("json")) {
    const jsonPath = path.join(outputDir, "report.json");
    fs.writeFileSync(jsonPath, JSON.stringify(jsonReport, null, 2));
    outputs.push(jsonPath);
    console.info(`  ✅ JSON: ${jsonPath}`);
  }

  if (formats.includes("html")) {
    const htmlContent = generateHTMLReport(jsonReport);
    const htmlPath = path.join(outputDir, "report.html");
    fs.writeFileSync(htmlPath, htmlContent);
    outputs.push(htmlPath);
    console.info(`  ✅ HTML: ${htmlPath}`);
  }

  // Print summary
  const { summary } = jsonReport;

  console.info(`
╔═══════════════════════════════════════════════════════════════╗
║                  CONFORMANCE REPORT GENERATED                  ║
╠═══════════════════════════════════════════════════════════════╣
║  Version: ${version.padEnd(51)}║
║  WCAG: ${jsonReport.wcagVersion} Level ${jsonReport.conformanceLevel.padEnd(43)}║
║                                                               ║
║  Summary:                                                      ║
║    Total Components: ${String(summary.totalComponents).padEnd(42)}║
║    ✅ Conformant:    ${String(summary.conformant).padEnd(42)}║
║    ⚠️  Partial:       ${String(summary.partial).padEnd(42)}║
║    ❌ Non-Conformant: ${String(summary.nonConformant).padEnd(42)}║
║    ⏳ Pending:        ${String(summary.pending).padEnd(42)}║
║                                                               ║
║  Conformance: ${String(`${summary.conformancePercentage}%`).padEnd(48)}║
╚═══════════════════════════════════════════════════════════════╝
`);

  // Warning if not fully conformant
  if (summary.nonConformant > 0 || summary.pending > 0) {
    console.info("⚠️  Release gate check:");

    if (summary.nonConformant > 0) {
      console.info(`   ❌ ${summary.nonConformant} component(s) are non-conformant`);
    }

    if (summary.pending > 0) {
      console.info(`   ⏳ ${summary.pending} component(s) pending manual audit`);
    }

    console.info("");
    console.info("   Complete manual audits before release to achieve full conformance.");
  }
}
