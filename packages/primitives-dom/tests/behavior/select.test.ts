import { describe, expect, it, vi } from "vitest";
import { createSelectBehavior } from "../../src/behavior/select";

describe("createSelectBehavior", () => {
  const defaultItems = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];

  describe("initialization", () => {
    it("should create select behavior with default state", () => {
      const select = createSelectBehavior();

      expect(select.state.open).toBe(false);
      expect(select.state.value).toBeNull();
      expect(select.state.highlightedValue).toBeNull();

      select.destroy();
    });

    it("should accept default value", () => {
      const select = createSelectBehavior({
        defaultValue: "2",
      });

      expect(select.state.value).toBe("2");

      select.destroy();
    });

    it("should not open when disabled", () => {
      const select = createSelectBehavior({
        disabled: true,
      });

      select.open();

      expect(select.state.open).toBe(false);

      select.destroy();
    });
  });

  describe("open/close", () => {
    it("should open the select", () => {
      const onOpenChange = vi.fn();
      const select = createSelectBehavior({ onOpenChange });

      select.open();

      expect(select.state.open).toBe(true);
      expect(onOpenChange).toHaveBeenCalledWith(true);

      select.destroy();
    });

    it("should close the select", () => {
      const onOpenChange = vi.fn();
      const select = createSelectBehavior({ onOpenChange });

      select.open();
      select.close();

      expect(select.state.open).toBe(false);
      expect(onOpenChange).toHaveBeenLastCalledWith(false);

      select.destroy();
    });

    it("should toggle the select", () => {
      const select = createSelectBehavior();

      select.toggle();
      expect(select.state.open).toBe(true);

      select.toggle();
      expect(select.state.open).toBe(false);

      select.destroy();
    });
  });

  describe("selection", () => {
    it("should select a value", () => {
      const onValueChange = vi.fn();
      const select = createSelectBehavior({ onValueChange });

      select.select("2");

      expect(select.state.value).toBe("2");
      expect(onValueChange).toHaveBeenCalledWith("2");

      select.destroy();
    });

    it("should close after selection by default", () => {
      const select = createSelectBehavior();

      select.open();
      select.select("1");

      expect(select.state.open).toBe(false);

      select.destroy();
    });

    it("should clear selection when clearable", () => {
      const onValueChange = vi.fn();
      const select = createSelectBehavior({
        defaultValue: "1",
        clearable: true,
        onValueChange,
      });

      select.clear();

      expect(select.state.value).toBeNull();
      expect(onValueChange).toHaveBeenCalledWith(null);

      select.destroy();
    });
  });

  describe("keyboard navigation", () => {
    it("should highlight a value", () => {
      const select = createSelectBehavior();
      select.setItems(defaultItems);

      select.open();
      select.highlight("2");

      expect(select.state.highlightedValue).toBe("2");

      select.destroy();
    });

    it("should highlight next option", () => {
      const select = createSelectBehavior();
      select.setItems(defaultItems);

      select.open();
      select.highlightFirst();
      select.highlightNext();

      expect(select.state.highlightedValue).toBe("2");

      select.destroy();
    });

    it("should highlight previous option", () => {
      const select = createSelectBehavior();
      select.setItems(defaultItems);

      select.open();
      select.highlightLast();
      select.highlightPrev();

      expect(select.state.highlightedValue).toBe("2");

      select.destroy();
    });

    it("should highlight first option", () => {
      const select = createSelectBehavior();
      select.setItems(defaultItems);

      select.open();
      select.highlightFirst();

      expect(select.state.highlightedValue).toBe("1");

      select.destroy();
    });

    it("should highlight last option", () => {
      const select = createSelectBehavior();
      select.setItems(defaultItems);

      select.open();
      select.highlightLast();

      expect(select.state.highlightedValue).toBe("3");

      select.destroy();
    });
  });

  describe("search", () => {
    it("should update search query", () => {
      const select = createSelectBehavior({ searchable: true });

      select.search("opt");

      expect(select.state.searchQuery).toBe("opt");

      select.destroy();
    });
  });

  describe("ARIA props", () => {
    it("should return correct trigger props", () => {
      const select = createSelectBehavior();

      const props = select.getTriggerProps();

      expect(props.role).toBe("combobox");
      expect(props["aria-expanded"]).toBe(false);
      expect(props["aria-haspopup"]).toBe("listbox");

      select.destroy();
    });

    it("should return correct content props", () => {
      const select = createSelectBehavior();

      const props = select.getContentProps();

      expect(props.role).toBe("listbox");
      expect(props.id).toBe(select.contentId);

      select.destroy();
    });

    it("should return correct option props", () => {
      const select = createSelectBehavior({
        defaultValue: "1",
      });

      const props = select.getOptionProps("1", "Option 1");

      expect(props.role).toBe("option");
      expect(props["aria-selected"]).toBe(true);

      select.destroy();
    });
  });
});
