import { describe, expect, it, vi } from "vitest";
import { createSelectBehavior } from "../../src/behavior/select";

describe("createSelectBehavior", () => {
  describe("initialization", () => {
    it("should create select behavior with default state", () => {
      const select = createSelectBehavior({
        options: [
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
        ],
      });

      expect(select.state.isOpen).toBe(false);
      expect(select.state.selectedValue).toBeNull();
      expect(select.state.highlightedIndex).toBe(-1);

      select.destroy();
    });

    it("should accept default value", () => {
      const select = createSelectBehavior({
        options: [
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
        ],
        defaultValue: "2",
      });

      expect(select.state.selectedValue).toBe("2");

      select.destroy();
    });

    it("should accept disabled state", () => {
      const select = createSelectBehavior({
        options: [{ value: "1", label: "Option 1" }],
        disabled: true,
      });

      expect(select.state.disabled).toBe(true);

      select.destroy();
    });
  });

  describe("open/close", () => {
    it("should open the select", () => {
      const onOpenChange = vi.fn();
      const select = createSelectBehavior({
        options: [{ value: "1", label: "Option 1" }],
        onOpenChange,
      });

      select.open();

      expect(select.state.isOpen).toBe(true);
      expect(onOpenChange).toHaveBeenCalledWith(true);

      select.destroy();
    });

    it("should close the select", () => {
      const onOpenChange = vi.fn();
      const select = createSelectBehavior({
        options: [{ value: "1", label: "Option 1" }],
        onOpenChange,
      });

      select.open();
      select.close();

      expect(select.state.isOpen).toBe(false);
      expect(onOpenChange).toHaveBeenLastCalledWith(false);

      select.destroy();
    });

    it("should toggle the select", () => {
      const select = createSelectBehavior({
        options: [{ value: "1", label: "Option 1" }],
      });

      select.toggle();
      expect(select.state.isOpen).toBe(true);

      select.toggle();
      expect(select.state.isOpen).toBe(false);

      select.destroy();
    });

    it("should not open when disabled", () => {
      const select = createSelectBehavior({
        options: [{ value: "1", label: "Option 1" }],
        disabled: true,
      });

      select.open();

      expect(select.state.isOpen).toBe(false);

      select.destroy();
    });
  });

  describe("selection", () => {
    it("should select an option", () => {
      const onValueChange = vi.fn();
      const select = createSelectBehavior({
        options: [
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
        ],
        onValueChange,
      });

      select.selectValue("2");

      expect(select.state.selectedValue).toBe("2");
      expect(onValueChange).toHaveBeenCalledWith("2");

      select.destroy();
    });

    it("should close after selection by default", () => {
      const select = createSelectBehavior({
        options: [
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
        ],
      });

      select.open();
      select.selectValue("1");

      expect(select.state.isOpen).toBe(false);

      select.destroy();
    });

    it("should get selected option label", () => {
      const select = createSelectBehavior({
        options: [
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
        ],
        defaultValue: "2",
      });

      expect(select.getSelectedLabel()).toBe("Option 2");

      select.destroy();
    });

    it("should return placeholder when nothing selected", () => {
      const select = createSelectBehavior({
        options: [{ value: "1", label: "Option 1" }],
        placeholder: "Select an option",
      });

      expect(select.getSelectedLabel()).toBe("Select an option");

      select.destroy();
    });

    it("should not select disabled option", () => {
      const select = createSelectBehavior({
        options: [
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2", disabled: true },
        ],
      });

      select.selectValue("2");

      expect(select.state.selectedValue).toBeNull();

      select.destroy();
    });
  });

  describe("keyboard navigation", () => {
    it("should highlight next option on ArrowDown", () => {
      const select = createSelectBehavior({
        options: [
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
          { value: "3", label: "Option 3" },
        ],
      });

      select.open();
      select.highlightNext();

      expect(select.state.highlightedIndex).toBe(0);

      select.highlightNext();
      expect(select.state.highlightedIndex).toBe(1);

      select.destroy();
    });

    it("should highlight previous option on ArrowUp", () => {
      const select = createSelectBehavior({
        options: [
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
          { value: "3", label: "Option 3" },
        ],
      });

      select.open();
      select.highlightIndex(2);
      select.highlightPrev();

      expect(select.state.highlightedIndex).toBe(1);

      select.destroy();
    });

    it("should highlight first option on Home", () => {
      const select = createSelectBehavior({
        options: [
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
          { value: "3", label: "Option 3" },
        ],
      });

      select.open();
      select.highlightIndex(2);
      select.highlightFirst();

      expect(select.state.highlightedIndex).toBe(0);

      select.destroy();
    });

    it("should highlight last option on End", () => {
      const select = createSelectBehavior({
        options: [
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
          { value: "3", label: "Option 3" },
        ],
      });

      select.open();
      select.highlightLast();

      expect(select.state.highlightedIndex).toBe(2);

      select.destroy();
    });

    it("should select highlighted option on Enter", () => {
      const select = createSelectBehavior({
        options: [
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
        ],
      });

      select.open();
      select.highlightIndex(1);
      select.selectHighlighted();

      expect(select.state.selectedValue).toBe("2");

      select.destroy();
    });

    it("should skip disabled options when navigating", () => {
      const select = createSelectBehavior({
        options: [
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2", disabled: true },
          { value: "3", label: "Option 3" },
        ],
      });

      select.open();
      select.highlightIndex(0);
      select.highlightNext();

      expect(select.state.highlightedIndex).toBe(2);

      select.destroy();
    });
  });

  describe("typeahead", () => {
    it("should highlight matching option on type", () => {
      const select = createSelectBehavior({
        options: [
          { value: "apple", label: "Apple" },
          { value: "banana", label: "Banana" },
          { value: "cherry", label: "Cherry" },
        ],
      });

      select.open();
      select.typeAhead("b");

      expect(select.state.highlightedIndex).toBe(1);

      select.destroy();
    });

    it("should cycle through options with same starting letter", () => {
      const select = createSelectBehavior({
        options: [
          { value: "apple", label: "Apple" },
          { value: "apricot", label: "Apricot" },
          { value: "avocado", label: "Avocado" },
        ],
      });

      select.open();
      select.typeAhead("a");
      expect(select.state.highlightedIndex).toBe(0);

      select.typeAhead("a");
      expect(select.state.highlightedIndex).toBe(1);

      select.destroy();
    });
  });

  describe("ARIA props", () => {
    it("should return correct trigger props", () => {
      const select = createSelectBehavior({
        options: [{ value: "1", label: "Option 1" }],
      });

      const props = select.getTriggerProps();

      expect(props.role).toBe("combobox");
      expect(props["aria-expanded"]).toBe(false);
      expect(props["aria-haspopup"]).toBe("listbox");

      select.destroy();
    });

    it("should return correct listbox props", () => {
      const select = createSelectBehavior({
        options: [{ value: "1", label: "Option 1" }],
      });

      const props = select.getListboxProps();

      expect(props.role).toBe("listbox");

      select.destroy();
    });

    it("should return correct option props", () => {
      const select = createSelectBehavior({
        options: [
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
        ],
        defaultValue: "1",
      });

      const props = select.getOptionProps(0);

      expect(props.role).toBe("option");
      expect(props["aria-selected"]).toBe(true);

      select.destroy();
    });
  });

  describe("clear", () => {
    it("should clear selection", () => {
      const onValueChange = vi.fn();
      const select = createSelectBehavior({
        options: [{ value: "1", label: "Option 1" }],
        defaultValue: "1",
        onValueChange,
      });

      select.clear();

      expect(select.state.selectedValue).toBeNull();
      expect(onValueChange).toHaveBeenCalledWith(null);

      select.destroy();
    });
  });
});
