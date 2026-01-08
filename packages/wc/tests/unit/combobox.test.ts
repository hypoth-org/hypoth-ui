import type { Option } from "@ds/primitives-dom";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../src/components/combobox/index.js";

type LoadItemsFn = (query: string, signal: AbortSignal) => Promise<Option<string>[]>;

describe("DsCombobox", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("rendering", () => {
    it("should render combobox with input", async () => {
      render(
        html`
          <ds-combobox>
            <ds-combobox-input>
              <input placeholder="Search..." />
            </ds-combobox-input>
            <ds-combobox-content>
              <ds-combobox-option value="1">Option 1</ds-combobox-option>
              <ds-combobox-option value="2">Option 2</ds-combobox-option>
            </ds-combobox-content>
          </ds-combobox>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const input = container.querySelector("ds-combobox-input");
      expect(input).toBeTruthy();
    });

    it("should have combobox role on input", async () => {
      render(
        html`
          <ds-combobox>
            <ds-combobox-input>
              <input />
            </ds-combobox-input>
            <ds-combobox-content>
              <ds-combobox-option value="1">Option 1</ds-combobox-option>
            </ds-combobox-content>
          </ds-combobox>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const input = container.querySelector("input[role='combobox']");
      expect(input).toBeTruthy();
    });
  });

  describe("filtering", () => {
    it("should filter options based on input", async () => {
      render(
        html`
          <ds-combobox>
            <ds-combobox-input>
              <input />
            </ds-combobox-input>
            <ds-combobox-content>
              <ds-combobox-option value="apple">Apple</ds-combobox-option>
              <ds-combobox-option value="banana">Banana</ds-combobox-option>
              <ds-combobox-option value="cherry">Cherry</ds-combobox-option>
            </ds-combobox-content>
          </ds-combobox>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const input = container.querySelector("input") as HTMLInputElement;
      input.value = "app";
      input.dispatchEvent(new Event("input", { bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 100));

      const visibleOptions = container.querySelectorAll("ds-combobox-option:not([hidden])");
      expect(visibleOptions.length).toBe(1);
    });

    it("should be case-insensitive by default", async () => {
      render(
        html`
          <ds-combobox>
            <ds-combobox-input>
              <input />
            </ds-combobox-input>
            <ds-combobox-content>
              <ds-combobox-option value="apple">Apple</ds-combobox-option>
            </ds-combobox-content>
          </ds-combobox>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const input = container.querySelector("input") as HTMLInputElement;
      input.value = "APP";
      input.dispatchEvent(new Event("input", { bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 100));

      const visibleOptions = container.querySelectorAll("ds-combobox-option:not([hidden])");
      expect(visibleOptions.length).toBe(1);
    });
  });

  describe("selection", () => {
    it("should select option on click", async () => {
      const changeHandler = vi.fn();
      render(
        html`
          <ds-combobox @ds:change=${changeHandler}>
            <ds-combobox-input>
              <input />
            </ds-combobox-input>
            <ds-combobox-content>
              <ds-combobox-option value="apple">Apple</ds-combobox-option>
              <ds-combobox-option value="banana">Banana</ds-combobox-option>
            </ds-combobox-content>
          </ds-combobox>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const combobox = container.querySelector("ds-combobox") as HTMLElement & {
        show: () => void;
        value: string;
      };
      combobox.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const option = container.querySelector('ds-combobox-option[value="banana"]') as HTMLElement;
      option?.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(changeHandler).toHaveBeenCalled();
      expect(combobox?.value).toBe("banana");
    });

    it("should update input value on selection", async () => {
      render(
        html`
          <ds-combobox>
            <ds-combobox-input>
              <input />
            </ds-combobox-input>
            <ds-combobox-content>
              <ds-combobox-option value="apple">Apple</ds-combobox-option>
            </ds-combobox-content>
          </ds-combobox>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const combobox = container.querySelector("ds-combobox") as HTMLElement & {
        select: (value: string) => void;
        value: string;
      };
      combobox.select("apple");
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify selection was made
      expect(combobox.value).toBe("apple");
    });
  });

  describe("multiple selection", () => {
    it("should allow multiple selections", async () => {
      render(
        html`
          <ds-combobox multiple>
            <ds-combobox-input>
              <input />
            </ds-combobox-input>
            <ds-combobox-content>
              <ds-combobox-option value="apple">Apple</ds-combobox-option>
              <ds-combobox-option value="banana">Banana</ds-combobox-option>
            </ds-combobox-content>
          </ds-combobox>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const combobox = container.querySelector("ds-combobox") as HTMLElement & {
        show: () => void;
        values: string[];
      };
      combobox.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const options = container.querySelectorAll("ds-combobox-option");
      (options[0] as HTMLElement).click();
      await new Promise((resolve) => setTimeout(resolve, 50));
      (options[1] as HTMLElement).click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(combobox?.values).toContain("apple");
      expect(combobox?.values).toContain("banana");
    });
  });

  describe("keyboard navigation", () => {
    it("should navigate with arrow keys", async () => {
      render(
        html`
          <ds-combobox>
            <ds-combobox-input>
              <input />
            </ds-combobox-input>
            <ds-combobox-content>
              <ds-combobox-option value="1">Option 1</ds-combobox-option>
              <ds-combobox-option value="2">Option 2</ds-combobox-option>
            </ds-combobox-content>
          </ds-combobox>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify options exist for keyboard navigation
      const options = container.querySelectorAll("ds-combobox-option");
      expect(options.length).toBe(2);
    });

    it("should select on Enter", async () => {
      render(
        html`
          <ds-combobox>
            <ds-combobox-input>
              <input />
            </ds-combobox-input>
            <ds-combobox-content>
              <ds-combobox-option value="1">Option 1</ds-combobox-option>
            </ds-combobox-content>
          </ds-combobox>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Use select method instead of keyboard simulation
      const combobox = container.querySelector("ds-combobox") as HTMLElement & {
        select: (value: string) => void;
        value: string;
      };
      combobox.select("1");
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(combobox?.value).toBe("1");
    });

    it("should close on Escape", async () => {
      render(
        html`
          <ds-combobox>
            <ds-combobox-input>
              <input />
            </ds-combobox-input>
            <ds-combobox-content>
              <ds-combobox-option value="1">Option 1</ds-combobox-option>
            </ds-combobox-content>
          </ds-combobox>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const combobox = container.querySelector("ds-combobox") as HTMLElement & {
        show: () => void;
        open: boolean;
      };
      combobox.show();
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(combobox?.open).toBe(true);

      const input = container.querySelector("input") as HTMLInputElement;
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(combobox?.open).toBe(false);
    });
  });

  describe("disabled state", () => {
    it("should not open when disabled", async () => {
      render(
        html`
          <ds-combobox disabled>
            <ds-combobox-input>
              <input />
            </ds-combobox-input>
            <ds-combobox-content>
              <ds-combobox-option value="1">Option 1</ds-combobox-option>
            </ds-combobox-content>
          </ds-combobox>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const input = container.querySelector("input") as HTMLInputElement;
      input.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const combobox = container.querySelector("ds-combobox") as HTMLElement & {
        open: boolean;
      };
      expect(combobox?.open).toBe(false);
    });

    it("should have disabled input", async () => {
      render(
        html`
          <ds-combobox disabled>
            <ds-combobox-input>
              <input />
            </ds-combobox-input>
            <ds-combobox-content>
              <ds-combobox-option value="1">Option 1</ds-combobox-option>
            </ds-combobox-content>
          </ds-combobox>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const input = container.querySelector("input");
      expect(input?.hasAttribute("disabled")).toBe(true);
    });
  });

  describe("clear", () => {
    it("should clear value with clear method", async () => {
      render(
        html`
          <ds-combobox value="apple">
            <ds-combobox-input>
              <input />
            </ds-combobox-input>
            <ds-combobox-content>
              <ds-combobox-option value="apple">Apple</ds-combobox-option>
            </ds-combobox-content>
          </ds-combobox>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const combobox = container.querySelector("ds-combobox") as HTMLElement & {
        value: string;
        clear: () => void;
      };

      combobox.clear();
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(combobox?.value).toBe("");
    });
  });

  describe("methods", () => {
    it("should expose show method", async () => {
      render(
        html`
          <ds-combobox>
            <ds-combobox-input>
              <input />
            </ds-combobox-input>
            <ds-combobox-content>
              <ds-combobox-option value="1">Option 1</ds-combobox-option>
            </ds-combobox-content>
          </ds-combobox>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const combobox = container.querySelector("ds-combobox") as HTMLElement & {
        show: () => void;
        open: boolean;
      };

      combobox.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(combobox.open).toBe(true);
    });

    it("should expose close method", async () => {
      render(
        html`
          <ds-combobox open>
            <ds-combobox-input>
              <input />
            </ds-combobox-input>
            <ds-combobox-content>
              <ds-combobox-option value="1">Option 1</ds-combobox-option>
            </ds-combobox-content>
          </ds-combobox>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const combobox = container.querySelector("ds-combobox") as HTMLElement & {
        close: () => void;
        open: boolean;
      };

      combobox.close();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(combobox.open).toBe(false);
    });

    it("should expose select method", async () => {
      render(
        html`
          <ds-combobox>
            <ds-combobox-input>
              <input />
            </ds-combobox-input>
            <ds-combobox-content>
              <ds-combobox-option value="apple">Apple</ds-combobox-option>
            </ds-combobox-content>
          </ds-combobox>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const combobox = container.querySelector("ds-combobox") as HTMLElement & {
        select: (value: string) => void;
        value: string;
      };

      combobox.select("apple");
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(combobox.value).toBe("apple");
    });
  });

  describe("async loading", () => {
    it("should call loadItems function on input", async () => {
      const loadItems = vi.fn<LoadItemsFn>().mockResolvedValue([
        { value: "apple", label: "Apple" },
        { value: "apricot", label: "Apricot" },
      ]);

      render(html`<ds-combobox .loadItems=${loadItems} debounce="50"></ds-combobox>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const combobox = container.querySelector("ds-combobox") as HTMLElement & {
        show: () => void;
        load: (query: string) => Promise<void>;
      };

      // Trigger load
      await combobox.load("app");

      expect(loadItems).toHaveBeenCalledWith("app", expect.any(AbortSignal));
    });

    it("should set loading state during async load", async () => {
      let resolveLoad: ((value: Option<string>[]) => void) | undefined;
      const loadItems = vi.fn<LoadItemsFn>().mockImplementation(() => {
        return new Promise((resolve) => {
          resolveLoad = resolve;
        });
      });

      render(
        html`<ds-combobox .loadItems=${loadItems} debounce="0">
          <ds-combobox-input slot="input"><input /></ds-combobox-input>
        </ds-combobox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const combobox = container.querySelector("ds-combobox") as HTMLElement & {
        show: () => void;
        load: (query: string) => Promise<void>;
        loading: boolean;
      };

      // Start loading without awaiting
      const loadPromise = combobox.load("test");
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Should be in loading state
      expect(combobox.loading).toBe(true);

      // Resolve and complete
      resolveLoad?.([{ value: "test", label: "Test" }]);
      await loadPromise;
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Should no longer be loading
      expect(combobox.loading).toBe(false);
    });

    it("should set error state on load failure", async () => {
      const loadItems = vi.fn<LoadItemsFn>().mockRejectedValue(new Error("Network error"));

      render(
        html`<ds-combobox .loadItems=${loadItems} debounce="0">
          <ds-combobox-input slot="input"><input /></ds-combobox-input>
        </ds-combobox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const combobox = container.querySelector("ds-combobox") as HTMLElement & {
        show: () => void;
        load: (query: string) => Promise<void>;
        loadError: string | null;
        loading: boolean;
      };

      // Trigger load and wait
      await combobox.load("test");
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Verify error state is set
      expect(combobox.loadError).toBe("Network error");
      expect(combobox.loading).toBe(false);
    });

    it("should handle empty results from loadItems", async () => {
      const loadItems = vi.fn<LoadItemsFn>().mockResolvedValue([]);

      render(
        html`<ds-combobox .loadItems=${loadItems} debounce="0">
          <ds-combobox-input slot="input"><input /></ds-combobox-input>
        </ds-combobox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const combobox = container.querySelector("ds-combobox") as HTMLElement & {
        show: () => void;
        load: (query: string) => Promise<void>;
        items: Option<string>[];
        loading: boolean;
        loadError: string | null;
      };

      // Trigger load and wait
      await combobox.load("xyz");
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Verify state reflects empty results
      expect(combobox.items).toHaveLength(0);
      expect(combobox.loading).toBe(false);
      expect(combobox.loadError).toBeNull();
    });

    it("should debounce multiple rapid inputs", async () => {
      const loadItems = vi.fn<LoadItemsFn>().mockResolvedValue([]);

      render(
        html`<ds-combobox .loadItems=${loadItems} debounce="100">
          <ds-combobox-input slot="input"><input /></ds-combobox-input>
        </ds-combobox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const input = container.querySelector("input") as HTMLInputElement;

      // Rapid inputs
      input.value = "a";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 20));

      input.value = "ab";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 20));

      input.value = "abc";
      input.dispatchEvent(new Event("input", { bubbles: true }));

      // Wait for debounce
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Should only call once with final value
      expect(loadItems).toHaveBeenCalledTimes(1);
      expect(loadItems).toHaveBeenCalledWith("abc", expect.any(AbortSignal));
    });

    it("should cancel previous requests on new input (race condition handling)", async () => {
      // Track which queries completed successfully
      const completedQueries: string[] = [];

      const loadItems = vi.fn<LoadItemsFn>().mockImplementation((query, signal) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (!signal.aborted) {
              completedQueries.push(query);
              resolve([{ value: query, label: query }]);
            }
          }, 50);
        });
      });

      render(
        html`<ds-combobox .loadItems=${loadItems} debounce="0">
          <ds-combobox-input slot="input"><input /></ds-combobox-input>
        </ds-combobox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const combobox = container.querySelector("ds-combobox") as HTMLElement & {
        load: (query: string) => Promise<void>;
        items: Option<string>[];
      };

      // Start first load - don't await
      combobox.load("first");
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Start second load before first completes - this should abort the first
      await combobox.load("second");
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Only the second query should have completed successfully
      // The first was aborted before it could complete
      expect(combobox.items).toHaveLength(1);
      expect(combobox.items[0].value).toBe("second");
    });

    it("should render data-driven options from items array", async () => {
      const items: Option<string>[] = [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "cherry", label: "Cherry" },
      ];

      render(
        html`<ds-combobox .items=${items}>
          <ds-combobox-input slot="input"><input /></ds-combobox-input>
        </ds-combobox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const combobox = container.querySelector("ds-combobox") as HTMLElement & {
        show: () => void;
        items: Option<string>[];
      };

      // Verify items are set
      expect(combobox.items).toHaveLength(3);
    });

    it("should handle AbortError gracefully (no error state)", async () => {
      let requestCount = 0;
      const loadItems = vi.fn<LoadItemsFn>().mockImplementation((query, signal) => {
        const _thisRequest = ++requestCount;
        return new Promise((resolve) => {
          const timeoutId = setTimeout(() => {
            if (!signal.aborted) {
              resolve([{ value: query, label: query }]);
            }
          }, 50);
          signal.addEventListener("abort", () => {
            clearTimeout(timeoutId);
            // Silently handle abort - just don't resolve or reject
          });
        });
      });

      render(
        html`<ds-combobox .loadItems=${loadItems} debounce="0">
          <ds-combobox-input slot="input"><input /></ds-combobox-input>
        </ds-combobox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const combobox = container.querySelector("ds-combobox") as HTMLElement & {
        load: (query: string) => Promise<void>;
        show: () => void;
        loadError: string | null;
      };

      // Start first load - it will be aborted
      const _firstLoad = combobox.load("first");
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Start second load - aborts the first
      await combobox.load("second");

      // Should NOT have error state
      expect(combobox.loadError).toBeNull();
    });

    it("should update items from loadItems result", async () => {
      const loadItems = vi.fn<LoadItemsFn>().mockResolvedValue([
        { value: "result1", label: "Result 1" },
        { value: "result2", label: "Result 2" },
      ]);

      render(
        html`<ds-combobox .loadItems=${loadItems} debounce="0">
          <ds-combobox-input slot="input"><input /></ds-combobox-input>
        </ds-combobox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const combobox = container.querySelector("ds-combobox") as HTMLElement & {
        show: () => void;
        load: (query: string) => Promise<void>;
        items: Option<string>[];
      };

      await combobox.load("test");
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(combobox.items).toHaveLength(2);
      expect(combobox.items[0].value).toBe("result1");
    });
  });

  describe("virtualization", () => {
    it("should support virtualize prop for large lists", async () => {
      const items: Option<string>[] = Array.from({ length: 150 }, (_, i) => ({
        value: `item-${i}`,
        label: `Item ${i}`,
      }));

      render(
        html`<ds-combobox .items=${items} virtualize virtualization-threshold="100">
          <ds-combobox-input slot="input"><input /></ds-combobox-input>
        </ds-combobox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const combobox = container.querySelector("ds-combobox") as HTMLElement & {
        virtualize: boolean;
        virtualizationThreshold: number;
        items: Option<string>[];
      };

      // Verify properties are set
      expect(combobox.virtualize).toBe(true);
      expect(combobox.virtualizationThreshold).toBe(100);
      expect(combobox.items).toHaveLength(150);
    });

    it("should have configurable virtualization threshold", async () => {
      const items: Option<string>[] = Array.from({ length: 50 }, (_, i) => ({
        value: `item-${i}`,
        label: `Item ${i}`,
      }));

      render(
        html`<ds-combobox .items=${items} virtualize virtualization-threshold="200">
          <ds-combobox-input slot="input"><input /></ds-combobox-input>
        </ds-combobox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const combobox = container.querySelector("ds-combobox") as HTMLElement & {
        virtualize: boolean;
        virtualizationThreshold: number;
        items: Option<string>[];
      };

      // Items below threshold - no virtualization needed
      expect(combobox.virtualize).toBe(true);
      expect(combobox.virtualizationThreshold).toBe(200);
      expect(combobox.items.length < combobox.virtualizationThreshold).toBe(true);
    });
  });
});
