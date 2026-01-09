/**
 * Development Mode Warnings
 *
 * Provides console warnings in development mode for common component misuse.
 * These warnings are stripped in production builds via dead code elimination.
 *
 * ## Warning Codes Reference
 *
 * | Code | Name | Description | Example Fix |
 * |------|------|-------------|-------------|
 * | DS001 | MISSING_REQUIRED_CHILD | A required child element is missing | Add `<ds-dialog-title>` to dialogs |
 * | DS002 | INVALID_PROP_COMBINATION | Two incompatible props used together | Don't use `disabled` with `loading` |
 * | DS003 | ACCESSIBILITY_VIOLATION | ARIA or accessibility issue detected | Add `aria-label` or wrap in `<ds-field>` |
 * | DS004 | DEPRECATED_USAGE | Using deprecated API | Use the suggested replacement |
 * | DS005 | MISSING_CONTEXT | Component needs parent context | Wrap input in `<ds-field>` |
 * | DS006 | INVALID_VALUE | Invalid value for a prop | Use valid variant: "primary" | "secondary" |
 *
 * ## Production Builds
 *
 * All warnings are automatically stripped in production builds via:
 * - Dead code elimination on `process.env.NODE_ENV !== 'production'` check
 * - Tree-shaking removes the warning utility if unused
 *
 * @packageDocumentation
 */

// =============================================================================
// Warning Codes
// =============================================================================

/**
 * Warning code identifiers
 *
 * - DS001: Required child element is missing (e.g., DialogTitle in Dialog)
 * - DS002: Invalid combination of props (e.g., disabled + loading together)
 * - DS003: Accessibility violation (e.g., missing label on form input)
 * - DS004: Deprecated usage (e.g., old prop name)
 * - DS005: Missing required context (e.g., Input not in Field)
 * - DS006: Invalid value for a prop (e.g., invalid variant name)
 */
export const WarningCodes = {
  MISSING_REQUIRED_CHILD: "DS001",
  INVALID_PROP_COMBINATION: "DS002",
  ACCESSIBILITY_VIOLATION: "DS003",
  DEPRECATED_USAGE: "DS004",
  MISSING_CONTEXT: "DS005",
  INVALID_VALUE: "DS006",
} as const;

export type WarningCode = keyof typeof WarningCodes;

// =============================================================================
// Warning Types
// =============================================================================

/**
 * Dev warning configuration
 */
export interface DevWarning {
  /** Warning code identifier */
  code: WarningCode;
  /** Component that emitted the warning */
  component: string;
  /** Warning message */
  message: string;
  /** Suggestion for fixing the issue */
  suggestion?: string;
  /** Additional context data */
  context?: Record<string, unknown>;
}

// =============================================================================
// Warning Emission
// =============================================================================

/**
 * Whether warnings are enabled (only in development)
 */
const isDev = typeof process !== "undefined" && process.env.NODE_ENV !== "production";

/**
 * Set of already-emitted warnings (to avoid duplicate spam)
 */
const emittedWarnings = new Set<string>();

/**
 * Emit a development-only warning.
 * Stripped in production builds via dead code elimination.
 *
 * @example
 * ```ts
 * devWarn({
 *   code: "MISSING_REQUIRED_CHILD",
 *   component: "ds-dialog",
 *   message: "Missing required ds-dialog-title for accessibility.",
 *   suggestion: "Add a <ds-dialog-title> element inside the dialog.",
 * });
 * ```
 */
export function devWarn(warning: DevWarning): void {
  if (!isDev) return;

  const prefix = `[${warning.component}]`;
  const codeStr = WarningCodes[warning.code];
  const key = `${warning.component}:${warning.code}:${warning.message}`;

  // Avoid duplicate warnings
  if (emittedWarnings.has(key)) return;
  emittedWarnings.add(key);

  const fullMessage =
    `${prefix} ${warning.message} (${codeStr})` +
    (warning.suggestion ? `\n💡 ${warning.suggestion}` : "");

  console.warn(fullMessage);

  if (warning.context) {
    console.warn("Context:", warning.context);
  }
}

/**
 * Emit a warning only once per session (by key)
 */
export function devWarnOnce(key: string, warning: DevWarning): void {
  if (emittedWarnings.has(key)) return;
  emittedWarnings.add(key);
  devWarn(warning);
}

/**
 * Clear all emitted warnings (useful for testing)
 */
export function clearWarnings(): void {
  emittedWarnings.clear();
}

// =============================================================================
// Pre-defined Warnings
// =============================================================================

/**
 * Pre-defined warnings for common misuse patterns
 */
export const Warnings = {
  /**
   * Dialog missing title element
   */
  dialogMissingTitle: (component: string): DevWarning => ({
    code: "MISSING_REQUIRED_CHILD",
    component,
    message: "Missing required ds-dialog-title for accessibility.",
    suggestion:
      "Add a <ds-dialog-title> element inside the dialog, or use aria-label on the dialog.",
  }),

  /**
   * Dialog missing description when using title
   */
  dialogMissingDescription: (component: string): DevWarning => ({
    code: "ACCESSIBILITY_VIOLATION",
    component,
    message: "Dialog has title but no description for screen readers.",
    suggestion:
      "Add a <ds-dialog-description> element, or use aria-describedby to reference existing content.",
  }),

  /**
   * Input missing accessible label
   */
  inputMissingLabel: (component: string): DevWarning => ({
    code: "ACCESSIBILITY_VIOLATION",
    component,
    message: "Input is missing an accessible label.",
    suggestion:
      "Add aria-label, aria-labelledby, or wrap in a <ds-field> with <ds-label>.",
  }),

  /**
   * Invalid variant value
   */
  invalidVariant: (
    component: string,
    variant: string,
    validVariants: string[]
  ): DevWarning => ({
    code: "INVALID_VALUE",
    component,
    message: `Invalid variant "${variant}".`,
    suggestion: `Use one of: ${validVariants.join(", ")}.`,
    context: { received: variant, valid: validVariants },
  }),

  /**
   * Invalid size value
   */
  invalidSize: (
    component: string,
    size: string,
    validSizes: string[]
  ): DevWarning => ({
    code: "INVALID_VALUE",
    component,
    message: `Invalid size "${size}".`,
    suggestion: `Use one of: ${validSizes.join(", ")}.`,
    context: { received: size, valid: validSizes },
  }),

  /**
   * Missing form field context
   */
  missingFieldContext: (component: string): DevWarning => ({
    code: "MISSING_CONTEXT",
    component,
    message: "Form input is not wrapped in a <ds-field> context.",
    suggestion:
      "Wrap your input in <ds-field> to enable automatic label association and error display.",
  }),

  /**
   * Missing form context
   */
  missingFormContext: (component: string): DevWarning => ({
    code: "MISSING_CONTEXT",
    component,
    message: "Form control is not inside a <ds-form> context.",
    suggestion:
      "Wrap your form controls in <ds-form> to enable form-level validation and submission.",
  }),

  /**
   * Deprecated prop usage
   */
  deprecatedProp: (
    component: string,
    oldProp: string,
    newProp: string
  ): DevWarning => ({
    code: "DEPRECATED_USAGE",
    component,
    message: `Prop "${oldProp}" is deprecated.`,
    suggestion: `Use "${newProp}" instead.`,
    context: { deprecated: oldProp, replacement: newProp },
  }),

  /**
   * Conflicting props
   */
  conflictingProps: (
    component: string,
    prop1: string,
    prop2: string
  ): DevWarning => ({
    code: "INVALID_PROP_COMBINATION",
    component,
    message: `Props "${prop1}" and "${prop2}" should not be used together.`,
    suggestion: `Choose one or the other based on your use case.`,
    context: { conflicting: [prop1, prop2] },
  }),

  /**
   * Required children missing
   */
  missingRequiredChild: (
    component: string,
    childType: string
  ): DevWarning => ({
    code: "MISSING_REQUIRED_CHILD",
    component,
    message: `Missing required child element <${childType}>.`,
    suggestion: `Add a <${childType}> element as a child of <${component}>.`,
  }),

  /**
   * Invalid ARIA reference
   */
  invalidAriaReference: (
    component: string,
    attribute: string,
    targetId: string
  ): DevWarning => ({
    code: "ACCESSIBILITY_VIOLATION",
    component,
    message: `${attribute} references "${targetId}" which does not exist in the document.`,
    suggestion: `Ensure an element with id="${targetId}" exists, or remove the ${attribute} attribute.`,
    context: { attribute, targetId },
  }),

  /**
   * Interactive element inside interactive element
   */
  nestedInteractive: (
    component: string,
    childType: string
  ): DevWarning => ({
    code: "ACCESSIBILITY_VIOLATION",
    component,
    message: `Interactive element <${childType}> is nested inside another interactive element.`,
    suggestion:
      "Avoid nesting interactive elements. Screen readers may not announce them correctly.",
    context: { nestedElement: childType },
  }),
};

// =============================================================================
// Validation Helpers
// =============================================================================

/**
 * Validate a prop value against a list of valid values
 */
export function validateProp<T extends string>(
  component: string,
  propName: string,
  value: T | undefined,
  validValues: readonly T[]
): boolean {
  if (value !== undefined && !validValues.includes(value)) {
    if (propName === "variant") {
      devWarn(Warnings.invalidVariant(component, value, [...validValues]));
    } else if (propName === "size") {
      devWarn(Warnings.invalidSize(component, value, [...validValues]));
    } else {
      devWarn({
        code: "INVALID_VALUE",
        component,
        message: `Invalid ${propName} "${value}".`,
        suggestion: `Use one of: ${validValues.join(", ")}.`,
      });
    }
    return false;
  }
  return true;
}

/**
 * Check if an element has an accessible label
 */
export function hasAccessibleLabel(element: HTMLElement): boolean {
  return !!(
    element.getAttribute("aria-label") ||
    element.getAttribute("aria-labelledby") ||
    element.getAttribute("title") ||
    (element as HTMLInputElement).labels?.length
  );
}

/**
 * Check if a required child element exists
 */
export function hasRequiredChild(
  parent: HTMLElement,
  selector: string
): boolean {
  return parent.querySelector(selector) !== null;
}
