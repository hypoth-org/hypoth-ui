import { describe, expect, it, vi } from "vitest";
import { createComboboxBehavior } from "../../src/behavior/combobox";

describe("createComboboxBehavior", () => {
  const defaultItems = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
  ];

  describe("initialization", () => {
    it("should create combobox with default state", () => {
      const combobox = createComboboxBehavior({
        items: defaultItems,
      });

      expect(combobox.state.open).toBe(false);
      expect(combobox.state.inputValue).toBe("");
      expect(combobox.state.value).toBeNull();
      expect(combobox.state.highlightedValue).toBeNull();

      combobox.destroy();
    });

    it("should accept default value in single mode", () => {
      const combobox = createComboboxBehavior({
        items: defaultItems,
        defaultValue: "apple",
      });

      expect(combobox.state.value).toBe("apple");

      combobox.destroy();
    });

    it("should accept default values in multiple mode", () => {
      const combobox = createComboboxBehavior({
        items: defaultItems,
        multiple: true,
        defaultValue: ["apple", "banana"],
      });

      expect(combobox.state.value).toEqual(["apple", "banana"]);

      combobox.destroy();
    });
  });

  describe("input handling", () => {
    it("should update input value", () => {
      const onInputChange = vi.fn();
      const combobox = createComboboxBehavior({
        items: defaultItems,
        onInputChange,
      });

      combobox.setInputValue("app");

      expect(combobox.state.inputValue).toBe("app");
      expect(onInputChange).toHaveBeenCalledWith("app");

      combobox.destroy();
    });

    it("should filter options based on input", () => {
      const combobox = createComboboxBehavior({
        items: defaultItems,
      });

      combobox.setInputValue("app");

      expect(combobox.state.filteredOptions).toHaveLength(1);
      expect(combobox.state.filteredOptions[0].value).toBe("apple");

      combobox.destroy();
    });

    it("should be case-insensitive by default", () => {
      const combobox = createComboboxBehavior({
        items: defaultItems,
      });

      combobox.setInputValue("APP");

      expect(combobox.state.filteredOptions).toHaveLength(1);
      expect(combobox.state.filteredOptions[0].value).toBe("apple");

      combobox.destroy();
    });
  });

  describe("open/close", () => {
    it("should open the dropdown", () => {
      const combobox = createComboboxBehavior({
        items: defaultItems,
      });

      combobox.open();

      expect(combobox.state.open).toBe(true);

      combobox.destroy();
    });

    it("should close the dropdown", () => {
      const combobox = createComboboxBehavior({
        items: defaultItems,
      });

      combobox.open();
      combobox.close();

      expect(combobox.state.open).toBe(false);

      combobox.destroy();
    });
  });

  describe("selection", () => {
    it("should select a value", () => {
      const onValueChange = vi.fn();
      const combobox = createComboboxBehavior({
        items: defaultItems,
        onValueChange,
      });

      combobox.select("banana");

      expect(combobox.state.value).toBe("banana");
      expect(onValueChange).toHaveBeenCalledWith("banana");

      combobox.destroy();
    });

    it("should replace selection in single mode", () => {
      const combobox = createComboboxBehavior({
        items: defaultItems,
        defaultValue: "apple",
      });

      combobox.select("banana");

      expect(combobox.state.value).toBe("banana");

      combobox.destroy();
    });

    it("should add to selection in multiple mode", () => {
      const combobox = createComboboxBehavior({
        items: defaultItems,
        multiple: true,
        defaultValue: ["apple"],
      });

      combobox.select("banana");

      expect(combobox.state.value).toEqual(["apple", "banana"]);

      combobox.destroy();
    });

    it("should not add duplicate in multiple mode (use remove to unselect)", () => {
      const combobox = createComboboxBehavior({
        items: defaultItems,
        multiple: true,
        defaultValue: ["apple", "banana"],
      });

      // Selecting an already-selected value does nothing
      combobox.select("apple");

      expect(combobox.state.value).toEqual(["apple", "banana"]);

      combobox.destroy();
    });
  });

  describe("keyboard navigation", () => {
    it("should highlight next option on ArrowDown", () => {
      const combobox = createComboboxBehavior({
        items: defaultItems,
      });

      combobox.open();
      combobox.highlightNext();

      expect(combobox.state.highlightedValue).toBe("apple");

      combobox.highlightNext();

      expect(combobox.state.highlightedValue).toBe("banana");

      combobox.destroy();
    });

    it("should highlight previous option on ArrowUp", () => {
      const combobox = createComboboxBehavior({
        items: defaultItems,
      });

      combobox.open();
      combobox.highlightLast();
      combobox.highlightPrev();

      expect(combobox.state.highlightedValue).toBe("banana");

      combobox.destroy();
    });

    it("should highlight first option", () => {
      const combobox = createComboboxBehavior({
        items: defaultItems,
      });

      combobox.open();
      combobox.highlightFirst();

      expect(combobox.state.highlightedValue).toBe("apple");

      combobox.destroy();
    });

    it("should highlight last option", () => {
      const combobox = createComboboxBehavior({
        items: defaultItems,
      });

      combobox.open();
      combobox.highlightLast();

      expect(combobox.state.highlightedValue).toBe("cherry");

      combobox.destroy();
    });
  });

  describe("remove (multi-select)", () => {
    it("should remove a value", () => {
      const onValueChange = vi.fn();
      const combobox = createComboboxBehavior({
        items: defaultItems,
        multiple: true,
        defaultValue: ["apple", "banana", "cherry"],
        onValueChange,
      });

      combobox.remove("banana");

      expect(combobox.state.value).toEqual(["apple", "cherry"]);
      expect(onValueChange).toHaveBeenCalledWith(["apple", "cherry"]);

      combobox.destroy();
    });

    it("should remove last tag via removeLastTag", () => {
      const combobox = createComboboxBehavior({
        items: defaultItems,
        multiple: true,
        defaultValue: ["apple", "banana"],
      });

      combobox.removeLastTag();

      expect(combobox.state.value).toEqual(["apple"]);

      combobox.destroy();
    });
  });

  describe("clear", () => {
    it("should clear selection", () => {
      const onValueChange = vi.fn();
      const combobox = createComboboxBehavior({
        items: defaultItems,
        defaultValue: "apple",
        onValueChange,
      });

      combobox.clear();

      expect(combobox.state.value).toBeNull();
      expect(onValueChange).toHaveBeenCalledWith(null);

      combobox.destroy();
    });

    it("should clear all selections in multi mode", () => {
      const onValueChange = vi.fn();
      const combobox = createComboboxBehavior({
        items: defaultItems,
        multiple: true,
        defaultValue: ["apple", "banana"],
        onValueChange,
      });

      combobox.clear();

      expect(combobox.state.value).toEqual([]);
      expect(onValueChange).toHaveBeenCalledWith([]);

      combobox.destroy();
    });
  });

  describe("creatable mode", () => {
    it("should create new value when allowed", () => {
      const onCreateValue = vi.fn();
      const combobox = createComboboxBehavior({
        items: defaultItems,
        creatable: true,
        onCreateValue,
      });

      combobox.setInputValue("mango");
      combobox.create("mango");

      expect(onCreateValue).toHaveBeenCalledWith("mango");

      combobox.destroy();
    });
  });

  describe("ARIA props", () => {
    it("should return correct input props", () => {
      const combobox = createComboboxBehavior({
        items: defaultItems,
      });

      const props = combobox.getInputProps();

      expect(props.role).toBe("combobox");
      expect(props["aria-haspopup"]).toBe("listbox");
      expect(props["aria-expanded"]).toBe(false);

      combobox.destroy();
    });

    it("should return correct listbox props", () => {
      const combobox = createComboboxBehavior({
        items: defaultItems,
      });

      const props = combobox.getListboxProps();

      expect(props.role).toBe("listbox");
      expect(props.id).toBe(combobox.listboxId);

      combobox.destroy();
    });

    it("should return correct option props", () => {
      const combobox = createComboboxBehavior({
        items: defaultItems,
        defaultValue: "apple",
      });

      const props = combobox.getOptionProps("apple", "Apple");

      expect(props.role).toBe("option");
      expect(props["aria-selected"]).toBe(true);

      combobox.destroy();
    });
  });

  describe("disabled state", () => {
    it("should not open when disabled", () => {
      const combobox = createComboboxBehavior({
        items: defaultItems,
        disabled: true,
      });

      combobox.open();

      expect(combobox.state.open).toBe(false);

      combobox.destroy();
    });
  });
});
