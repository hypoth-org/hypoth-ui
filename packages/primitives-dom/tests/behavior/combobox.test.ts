import { describe, expect, it, vi } from "vitest";
import { createComboboxBehavior } from "../../src/behavior/combobox";

describe("createComboboxBehavior", () => {
  const defaultOptions = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
  ];

  describe("initialization", () => {
    it("should create combobox with default state", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
      });

      expect(combobox.state.isOpen).toBe(false);
      expect(combobox.state.inputValue).toBe("");
      expect(combobox.state.selectedValues).toEqual([]);
      expect(combobox.state.highlightedIndex).toBe(-1);

      combobox.destroy();
    });

    it("should accept default value in single mode", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
        defaultValue: "apple",
      });

      expect(combobox.state.selectedValues).toEqual(["apple"]);

      combobox.destroy();
    });

    it("should accept default values in multiple mode", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
        multiple: true,
        defaultValue: ["apple", "banana"],
      });

      expect(combobox.state.selectedValues).toEqual(["apple", "banana"]);

      combobox.destroy();
    });
  });

  describe("input handling", () => {
    it("should update input value", () => {
      const onInputChange = vi.fn();
      const combobox = createComboboxBehavior({
        options: defaultOptions,
        onInputChange,
      });

      combobox.setInputValue("app");

      expect(combobox.state.inputValue).toBe("app");
      expect(onInputChange).toHaveBeenCalledWith("app");

      combobox.destroy();
    });

    it("should open on input", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
      });

      combobox.setInputValue("a");

      expect(combobox.state.isOpen).toBe(true);

      combobox.destroy();
    });

    it("should filter options based on input", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
      });

      combobox.setInputValue("app");
      const filtered = combobox.getFilteredOptions();

      expect(filtered).toHaveLength(1);
      expect(filtered[0].value).toBe("apple");

      combobox.destroy();
    });

    it("should be case-insensitive by default", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
      });

      combobox.setInputValue("APP");
      const filtered = combobox.getFilteredOptions();

      expect(filtered).toHaveLength(1);
      expect(filtered[0].value).toBe("apple");

      combobox.destroy();
    });
  });

  describe("selection", () => {
    it("should select an option", () => {
      const onValueChange = vi.fn();
      const combobox = createComboboxBehavior({
        options: defaultOptions,
        onValueChange,
      });

      combobox.selectValue("banana");

      expect(combobox.state.selectedValues).toEqual(["banana"]);
      expect(onValueChange).toHaveBeenCalledWith(["banana"]);

      combobox.destroy();
    });

    it("should replace selection in single mode", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
        defaultValue: "apple",
      });

      combobox.selectValue("banana");

      expect(combobox.state.selectedValues).toEqual(["banana"]);

      combobox.destroy();
    });

    it("should add to selection in multiple mode", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
        multiple: true,
        defaultValue: ["apple"],
      });

      combobox.selectValue("banana");

      expect(combobox.state.selectedValues).toEqual(["apple", "banana"]);

      combobox.destroy();
    });

    it("should toggle selection in multiple mode", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
        multiple: true,
        defaultValue: ["apple", "banana"],
      });

      combobox.selectValue("apple");

      expect(combobox.state.selectedValues).toEqual(["banana"]);

      combobox.destroy();
    });

    it("should close after selection in single mode", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
      });

      combobox.open();
      combobox.selectValue("apple");

      expect(combobox.state.isOpen).toBe(false);

      combobox.destroy();
    });

    it("should stay open after selection in multiple mode", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
        multiple: true,
      });

      combobox.open();
      combobox.selectValue("apple");

      expect(combobox.state.isOpen).toBe(true);

      combobox.destroy();
    });
  });

  describe("keyboard navigation", () => {
    it("should highlight next option on ArrowDown", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
      });

      combobox.open();
      combobox.highlightNext();

      expect(combobox.state.highlightedIndex).toBe(0);

      combobox.highlightNext();
      expect(combobox.state.highlightedIndex).toBe(1);

      combobox.destroy();
    });

    it("should highlight previous option on ArrowUp", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
      });

      combobox.open();
      combobox.highlightIndex(2);
      combobox.highlightPrev();

      expect(combobox.state.highlightedIndex).toBe(1);

      combobox.destroy();
    });

    it("should select highlighted option on Enter", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
      });

      combobox.open();
      combobox.highlightIndex(1);
      combobox.selectHighlighted();

      expect(combobox.state.selectedValues).toEqual(["banana"]);

      combobox.destroy();
    });

    it("should close on Escape", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
      });

      combobox.open();
      combobox.close();

      expect(combobox.state.isOpen).toBe(false);

      combobox.destroy();
    });

    it("should remove last tag on Backspace in multiple mode", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
        multiple: true,
        defaultValue: ["apple", "banana"],
      });

      combobox.removeLastValue();

      expect(combobox.state.selectedValues).toEqual(["apple"]);

      combobox.destroy();
    });

    it("should not remove tag on Backspace if input has value", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
        multiple: true,
        defaultValue: ["apple", "banana"],
      });

      combobox.setInputValue("ch");
      combobox.removeLastValue();

      // Should not remove because input has value
      expect(combobox.state.selectedValues).toEqual(["apple", "banana"]);

      combobox.destroy();
    });
  });

  describe("creatable mode", () => {
    it("should allow creating new values", () => {
      const onCreate = vi.fn();
      const combobox = createComboboxBehavior({
        options: defaultOptions,
        creatable: true,
        onCreate,
      });

      combobox.setInputValue("mango");
      combobox.createValue("mango");

      expect(onCreate).toHaveBeenCalledWith("mango");

      combobox.destroy();
    });

    it("should show create option when no match", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
        creatable: true,
      });

      combobox.setInputValue("mango");

      expect(combobox.shouldShowCreateOption()).toBe(true);

      combobox.destroy();
    });

    it("should not show create option when exact match exists", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
        creatable: true,
      });

      combobox.setInputValue("apple");

      expect(combobox.shouldShowCreateOption()).toBe(false);

      combobox.destroy();
    });
  });

  describe("clear", () => {
    it("should clear all selections", () => {
      const onValueChange = vi.fn();
      const combobox = createComboboxBehavior({
        options: defaultOptions,
        defaultValue: "apple",
        onValueChange,
      });

      combobox.clear();

      expect(combobox.state.selectedValues).toEqual([]);
      expect(combobox.state.inputValue).toBe("");
      expect(onValueChange).toHaveBeenCalledWith([]);

      combobox.destroy();
    });

    it("should remove specific value", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
        multiple: true,
        defaultValue: ["apple", "banana", "cherry"],
      });

      combobox.removeValue("banana");

      expect(combobox.state.selectedValues).toEqual(["apple", "cherry"]);

      combobox.destroy();
    });
  });

  describe("ARIA props", () => {
    it("should return correct input props", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
      });

      const props = combobox.getInputProps();

      expect(props.role).toBe("combobox");
      expect(props["aria-expanded"]).toBe(false);
      expect(props["aria-autocomplete"]).toBe("list");

      combobox.destroy();
    });

    it("should return correct listbox props", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
      });

      const props = combobox.getListboxProps();

      expect(props.role).toBe("listbox");

      combobox.destroy();
    });

    it("should return correct option props", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
        defaultValue: "apple",
      });

      const props = combobox.getOptionProps(0);

      expect(props.role).toBe("option");
      expect(props["aria-selected"]).toBe(true);

      combobox.destroy();
    });
  });

  describe("loading state", () => {
    it("should track loading state", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
      });

      combobox.setLoading(true);

      expect(combobox.state.isLoading).toBe(true);

      combobox.setLoading(false);

      expect(combobox.state.isLoading).toBe(false);

      combobox.destroy();
    });
  });

  describe("disabled state", () => {
    it("should not open when disabled", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
        disabled: true,
      });

      combobox.open();

      expect(combobox.state.isOpen).toBe(false);

      combobox.destroy();
    });

    it("should not select when disabled", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
        disabled: true,
      });

      combobox.selectValue("apple");

      expect(combobox.state.selectedValues).toEqual([]);

      combobox.destroy();
    });
  });

  describe("selected labels", () => {
    it("should get selected option labels", () => {
      const combobox = createComboboxBehavior({
        options: defaultOptions,
        multiple: true,
        defaultValue: ["apple", "banana"],
      });

      const labels = combobox.getSelectedLabels();

      expect(labels).toEqual(["Apple", "Banana"]);

      combobox.destroy();
    });
  });
});
