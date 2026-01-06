/**
 * Vitest setup for accessibility tests
 *
 * Extends expect with axe matchers for accessibility testing
 */
import "@testing-library/jest-dom/vitest";
import { toHaveNoViolations } from "jest-axe";
import { expect } from "vitest";

// Extend Vitest's expect with jest-axe matchers
expect.extend(toHaveNoViolations);
