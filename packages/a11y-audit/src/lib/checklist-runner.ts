/**
 * Interactive checklist workflow runner
 *
 * Provides CLI-based workflow for completing manual accessibility audits
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline";
import type { AuditChecklist, AuditItem, AuditItemStatus, ChecklistItem } from "./types.js";

export interface ChecklistRunnerOptions {
  component: string;
  category: string;
  version?: string;
  templatesDir: string;
}

export interface ChecklistSession {
  checklist: AuditChecklist;
  component: string;
  version: string;
  items: AuditItem[];
  startedAt: string;
}

/**
 * Load a checklist template by category
 */
export function loadChecklist(category: string, templatesDir: string): AuditChecklist {
  const templatePath = path.join(templatesDir, `${category}.json`);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Checklist template not found: ${category}`);
  }

  const content = fs.readFileSync(templatePath, "utf-8");
  return JSON.parse(content) as AuditChecklist;
}

/**
 * Get available checklist categories
 */
export function getAvailableCategories(templatesDir: string): string[] {
  if (!fs.existsSync(templatesDir)) {
    return [];
  }

  return fs
    .readdirSync(templatesDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}

/**
 * Create a new checklist session
 */
export function createSession(options: ChecklistRunnerOptions): ChecklistSession {
  const checklist = loadChecklist(options.category, options.templatesDir);

  return {
    checklist,
    component: options.component,
    version: options.version ?? "0.0.0",
    items: [],
    startedAt: new Date().toISOString(),
  };
}

/**
 * Format a checklist item for display
 */
function _formatItem(item: ChecklistItem, index: number, total: number): string {
  const lines = [
    "",
    "═══════════════════════════════════════════════════════════════",
    `Item ${index + 1}/${total}: ${item.id}`,
    "═══════════════════════════════════════════════════════════════",
    "",
    `📋 ${item.description}`,
    "",
    `WCAG: ${item.criterion}`,
    "",
    "📝 Procedure:",
    `   ${item.procedure}`,
    "",
    "✅ Expected Outcome:",
    `   ${item.expectedOutcome}`,
  ];

  if (item.tools && item.tools.length > 0) {
    lines.push("", `🔧 Recommended tools: ${item.tools.join(", ")}`);
  }

  if (item.screenReaders && item.screenReaders.length > 0) {
    lines.push(`🔊 Screen readers: ${item.screenReaders.join(", ")}`);
  }

  lines.push("", "Status options: [p]ass, [f]ail, [n]a, [b]locked, [s]kip", "");

  return lines.join("\n");
}

/**
 * Parse status input
 */
function parseStatus(input: string): AuditItemStatus | "skip" | null {
  const normalized = input.toLowerCase().trim();

  switch (normalized) {
    case "p":
    case "pass":
      return "pass";
    case "f":
    case "fail":
      return "fail";
    case "n":
    case "na":
    case "n/a":
      return "na";
    case "b":
    case "blocked":
      return "blocked";
    case "s":
    case "skip":
      return "skip";
    default:
      return null;
  }
}

/**
 * Run interactive checklist session
 */
export async function runInteractiveSession(session: ChecklistSession): Promise<AuditItem[]> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => rl.question(prompt, resolve));

  const results: AuditItem[] = [];

  for (let i = 0; i < session.checklist.items.length; i++) {
    const item = session.checklist.items[i];

    let status: AuditItemStatus | null = null;

    while (!status) {
      const input = await question("Enter status: ");
      const parsed = parseStatus(input);

      if (parsed === "skip") {
        break;
      }

      if (parsed === null) {
        continue;
      }

      status = parsed;
    }

    if (status) {
      let notes = "";

      if (status === "fail" || status === "blocked") {
        notes = await question("Enter notes (required for fail/blocked): ");
        while (!notes.trim()) {
          notes = await question("Notes are required. Please enter notes: ");
        }
      } else {
        const notesInput = await question("Enter notes (optional, press Enter to skip): ");
        notes = notesInput.trim();
      }

      results.push({
        itemId: item.id,
        status,
        notes: notes || undefined,
      });
    }
  }

  rl.close();

  return results;
}

/**
 * Check if session is complete
 */
export function isSessionComplete(session: ChecklistSession): boolean {
  return session.items.length === session.checklist.items.length;
}

/**
 * Get incomplete items
 */
export function getIncompleteItems(session: ChecklistSession): ChecklistItem[] {
  const completedIds = new Set(session.items.map((i) => i.itemId));
  return session.checklist.items.filter((item) => !completedIds.has(item.id));
}
