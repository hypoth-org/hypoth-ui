/**
 * Tests for ARIA ID generator utility
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  generateAriaId,
  getAriaIdCounter,
  resetAriaIdCounter,
} from "../src/aria/id-generator.js";

describe("generateAriaId", () => {
  beforeEach(() => {
    resetAriaIdCounter();
  });

  afterEach(() => {
    resetAriaIdCounter();
  });

  it("should generate unique IDs with default prefix", () => {
    const id1 = generateAriaId();
    const id2 = generateAriaId();
    const id3 = generateAriaId();

    expect(id1).toBe("aria-1");
    expect(id2).toBe("aria-2");
    expect(id3).toBe("aria-3");
  });

  it("should generate unique IDs with custom prefix", () => {
    const id1 = generateAriaId("dialog-title");
    const id2 = generateAriaId("dialog-desc");
    const id3 = generateAriaId("dialog-title");

    expect(id1).toBe("dialog-title-1");
    expect(id2).toBe("dialog-desc-2");
    expect(id3).toBe("dialog-title-3");
  });

  it("should increment counter globally across different prefixes", () => {
    generateAriaId("title");
    generateAriaId("desc");
    const id = generateAriaId("content");

    expect(id).toBe("content-3");
    expect(getAriaIdCounter()).toBe(3);
  });

  it("should handle empty prefix", () => {
    const id = generateAriaId("");

    expect(id).toBe("-1");
  });
});

describe("resetAriaIdCounter", () => {
  it("should reset the counter to 0", () => {
    generateAriaId();
    generateAriaId();
    expect(getAriaIdCounter()).toBe(2);

    resetAriaIdCounter();
    expect(getAriaIdCounter()).toBe(0);

    const id = generateAriaId();
    expect(id).toBe("aria-1");
  });
});

describe("getAriaIdCounter", () => {
  beforeEach(() => {
    resetAriaIdCounter();
  });

  it("should return current counter value", () => {
    expect(getAriaIdCounter()).toBe(0);

    generateAriaId();
    expect(getAriaIdCounter()).toBe(1);

    generateAriaId();
    generateAriaId();
    expect(getAriaIdCounter()).toBe(3);
  });
});
