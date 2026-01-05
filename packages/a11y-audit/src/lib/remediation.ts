/**
 * Remediation guidance mapping for common axe-core violations
 *
 * Maps axe rule IDs to actionable remediation guidance for developers.
 */

export interface RemediationGuidance {
  title: string;
  description: string;
  fix: string;
  wcagCriteria: string[];
  learnMore: string;
}

/**
 * Remediation guidance for common accessibility violations
 *
 * These mappings provide developer-friendly guidance for fixing
 * violations detected by axe-core.
 */
export const REMEDIATION_MAP: Record<string, RemediationGuidance> = {
  "button-name": {
    title: "Button must have accessible name",
    description: "Buttons must have discernible text or an accessible name for screen readers.",
    fix: "Add visible text content, aria-label, or aria-labelledby to the button.",
    wcagCriteria: ["4.1.2 Name, Role, Value"],
    learnMore: "https://dequeuniversity.com/rules/axe/4.7/button-name",
  },
  "image-alt": {
    title: "Images must have alternate text",
    description: "Images must have an alt attribute describing the image content.",
    fix: 'Add an alt attribute. Use alt="" for decorative images, or descriptive text for meaningful images.',
    wcagCriteria: ["1.1.1 Non-text Content"],
    learnMore: "https://dequeuniversity.com/rules/axe/4.7/image-alt",
  },
  label: {
    title: "Form elements must have labels",
    description: "Form inputs must have programmatically associated labels.",
    fix: "Add a <label> element with for attribute matching the input id, or use aria-label/aria-labelledby.",
    wcagCriteria: ["1.3.1 Info and Relationships", "4.1.2 Name, Role, Value"],
    learnMore: "https://dequeuniversity.com/rules/axe/4.7/label",
  },
  "color-contrast": {
    title: "Elements must have sufficient color contrast",
    description: "Text must have sufficient color contrast against its background.",
    fix: "Increase contrast ratio to at least 4.5:1 for normal text or 3:1 for large text.",
    wcagCriteria: ["1.4.3 Contrast (Minimum)"],
    learnMore: "https://dequeuniversity.com/rules/axe/4.7/color-contrast",
  },
  "aria-required-attr": {
    title: "ARIA elements must have required attributes",
    description: "Elements with ARIA roles must have all required ARIA attributes.",
    fix: "Add the missing required ARIA attribute for the role.",
    wcagCriteria: ["4.1.2 Name, Role, Value"],
    learnMore: "https://dequeuniversity.com/rules/axe/4.7/aria-required-attr",
  },
  "aria-valid-attr-value": {
    title: "ARIA attributes must have valid values",
    description: "ARIA attribute values must be valid for the attribute type.",
    fix: "Correct the ARIA attribute value to match the allowed values for that attribute.",
    wcagCriteria: ["4.1.2 Name, Role, Value"],
    learnMore: "https://dequeuniversity.com/rules/axe/4.7/aria-valid-attr-value",
  },
  "aria-hidden-focus": {
    title: "aria-hidden elements must not contain focusable elements",
    description: 'Elements with aria-hidden="true" should not contain focusable elements.',
    fix: "Remove focusable elements from the aria-hidden container or remove aria-hidden.",
    wcagCriteria: ["4.1.2 Name, Role, Value"],
    learnMore: "https://dequeuniversity.com/rules/axe/4.7/aria-hidden-focus",
  },
  "focus-order-semantics": {
    title: "Focus order must follow logical sequence",
    description: "The focus order should follow a logical, meaningful sequence.",
    fix: "Ensure tabindex values create a logical focus order, or remove positive tabindex values.",
    wcagCriteria: ["2.4.3 Focus Order"],
    learnMore: "https://dequeuniversity.com/rules/axe/4.7/focus-order-semantics",
  },
  keyboard: {
    title: "Keyboard accessibility",
    description: "All interactive elements must be keyboard accessible.",
    fix: "Ensure element can receive focus and responds to keyboard events (Enter, Space).",
    wcagCriteria: ["2.1.1 Keyboard"],
    learnMore: "https://dequeuniversity.com/rules/axe/4.7/keyboard",
  },
  "link-name": {
    title: "Links must have discernible text",
    description: "Links must have text that describes the link destination.",
    fix: "Add visible link text, aria-label, or aria-labelledby.",
    wcagCriteria: ["4.1.2 Name, Role, Value", "2.4.4 Link Purpose (In Context)"],
    learnMore: "https://dequeuniversity.com/rules/axe/4.7/link-name",
  },
  list: {
    title: "List structure must be correct",
    description: "Lists must only contain li, script, or template elements.",
    fix: "Ensure list items are wrapped in proper list containers (ul, ol).",
    wcagCriteria: ["1.3.1 Info and Relationships"],
    learnMore: "https://dequeuniversity.com/rules/axe/4.7/list",
  },
  "role-img-alt": {
    title: 'Elements with role="img" must have accessible name',
    description: 'Elements with role="img" need alt text or aria-label.',
    fix: 'Add aria-label or aria-labelledby to the element with role="img".',
    wcagCriteria: ["1.1.1 Non-text Content"],
    learnMore: "https://dequeuniversity.com/rules/axe/4.7/role-img-alt",
  },
  tabindex: {
    title: "Tabindex should not be greater than 0",
    description: "Positive tabindex values disrupt natural keyboard navigation.",
    fix: 'Use tabindex="0" or tabindex="-1" instead of positive values.',
    wcagCriteria: ["2.4.3 Focus Order"],
    learnMore: "https://dequeuniversity.com/rules/axe/4.7/tabindex",
  },
};

/**
 * Get remediation guidance for a violation rule ID
 *
 * @param ruleId - The axe-core rule ID
 * @returns Remediation guidance or a generic fallback
 */
export function getRemediation(ruleId: string): RemediationGuidance {
  return (
    REMEDIATION_MAP[ruleId] ?? {
      title: `Fix accessibility issue: ${ruleId}`,
      description: "An accessibility violation was detected.",
      fix: "Review the axe-core documentation for this rule.",
      wcagCriteria: [],
      learnMore: `https://dequeuniversity.com/rules/axe/4.7/${ruleId}`,
    }
  );
}

/**
 * Format remediation guidance for CLI output
 *
 * @param ruleId - The axe-core rule ID
 * @returns Formatted string for CLI display
 */
export function formatRemediation(ruleId: string): string {
  const guidance = getRemediation(ruleId);
  const lines = [
    `  📋 ${guidance.title}`,
    `     ${guidance.description}`,
    "",
    "  🔧 How to fix:",
    `     ${guidance.fix}`,
  ];

  if (guidance.wcagCriteria.length > 0) {
    lines.push("", `  📚 WCAG: ${guidance.wcagCriteria.join(", ")}`);
  }

  lines.push(`  🔗 ${guidance.learnMore}`);

  return lines.join("\n");
}
