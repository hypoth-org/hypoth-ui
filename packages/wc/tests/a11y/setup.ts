import { toHaveNoViolations } from "jest-axe";
/**
 * Vitest setup for accessibility tests
 *
 * Extends expect with axe matchers for accessibility testing
 */
import { expect } from "vitest";

// Extend Vitest's expect with jest-axe matchers
expect.extend(toHaveNoViolations);
