import { describe, expect, it, vi } from "vitest";
import { createPinInputBehavior } from "../../src/behavior/pin-input";

describe("createPinInputBehavior", () => {
  describe("initialization", () => {
    it("should create pin input with default length", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
      });

      expect(pinInput.getValueAt(0)).toBe("");
      expect(pinInput.state.focusedIndex).toBeNull();
      expect(pinInput.state.length).toBe(6);

      pinInput.destroy();
    });

    it("should accept default value", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
        defaultValue: "123",
      });

      expect(pinInput.getValueAt(0)).toBe("1");
      expect(pinInput.getValueAt(1)).toBe("2");
      expect(pinInput.getValueAt(2)).toBe("3");
      expect(pinInput.getValueAt(3)).toBe("");

      pinInput.destroy();
    });

    it("should truncate default value to length", () => {
      const pinInput = createPinInputBehavior({
        length: 4,
        defaultValue: "123456",
      });

      expect(pinInput.getValueAt(0)).toBe("1");
      expect(pinInput.getValueAt(1)).toBe("2");
      expect(pinInput.getValueAt(2)).toBe("3");
      expect(pinInput.getValueAt(3)).toBe("4");

      pinInput.destroy();
    });
  });

  describe("input handling", () => {
    it("should accept digit input", () => {
      const onValueChange = vi.fn();
      const pinInput = createPinInputBehavior({
        length: 6,
        onValueChange,
      });

      pinInput.input(0, "1");

      expect(pinInput.getValueAt(0)).toBe("1");
      expect(onValueChange).toHaveBeenCalledWith("1");

      pinInput.destroy();
    });

    it("should auto-advance focus after input", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
      });

      pinInput.focus(0);
      pinInput.input(0, "1");

      expect(pinInput.state.focusedIndex).toBe(1);

      pinInput.destroy();
    });

    it("should reject non-digit input in numeric mode", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
        alphanumeric: false,
      });

      pinInput.input(0, "a");

      expect(pinInput.getValueAt(0)).toBe("");

      pinInput.destroy();
    });

    it("should accept alphanumeric input when enabled", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
        alphanumeric: true,
      });

      pinInput.input(0, "A");

      expect(pinInput.getValueAt(0)).toBe("A");

      pinInput.destroy();
    });
  });

  describe("completion", () => {
    it("should call onComplete when all digits entered", () => {
      const onComplete = vi.fn();
      const pinInput = createPinInputBehavior({
        length: 4,
        onComplete,
      });

      pinInput.input(0, "1");
      pinInput.input(1, "2");
      pinInput.input(2, "3");
      pinInput.input(3, "4");

      expect(onComplete).toHaveBeenCalledWith("1234");

      pinInput.destroy();
    });

    it("should not call onComplete with partial input", () => {
      const onComplete = vi.fn();
      const pinInput = createPinInputBehavior({
        length: 4,
        onComplete,
      });

      pinInput.input(0, "1");
      pinInput.input(1, "2");

      expect(onComplete).not.toHaveBeenCalled();

      pinInput.destroy();
    });
  });

  describe("backspace handling", () => {
    it("should clear current digit on backspace", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
        defaultValue: "123",
      });

      pinInput.focus(2);
      pinInput.backspace(2);

      expect(pinInput.getValueAt(2)).toBe("");

      pinInput.destroy();
    });

    it("should move focus to previous field after backspace", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
        defaultValue: "123",
      });

      pinInput.focus(2);
      pinInput.backspace(2);

      expect(pinInput.state.focusedIndex).toBe(1);

      pinInput.destroy();
    });

    it("should clear previous digit if current is empty (after input)", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
      });

      // Input some values to ensure internal state is properly padded
      pinInput.input(0, "1");
      pinInput.input(1, "2");
      // Now at position 2 (auto-advanced), position 2 is properly empty (space)

      pinInput.backspace(2);

      expect(pinInput.getValueAt(1)).toBe("");
      expect(pinInput.state.focusedIndex).toBe(1);

      pinInput.destroy();
    });
  });

  describe("paste handling", () => {
    it("should handle paste of complete code", () => {
      const onComplete = vi.fn();
      const pinInput = createPinInputBehavior({
        length: 6,
        onComplete,
      });

      pinInput.paste("123456");

      expect(pinInput.getValueAt(0)).toBe("1");
      expect(pinInput.getValueAt(5)).toBe("6");
      expect(onComplete).toHaveBeenCalledWith("123456");

      pinInput.destroy();
    });

    it("should truncate pasted value to length", () => {
      const pinInput = createPinInputBehavior({
        length: 4,
      });

      pinInput.paste("123456789");

      expect(pinInput.getValueAt(0)).toBe("1");
      expect(pinInput.getValueAt(3)).toBe("4");

      pinInput.destroy();
    });

    it("should filter non-digit characters in numeric mode", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
        alphanumeric: false,
      });

      pinInput.paste("1a2b3c");

      expect(pinInput.getValueAt(0)).toBe("1");
      expect(pinInput.getValueAt(1)).toBe("2");
      expect(pinInput.getValueAt(2)).toBe("3");

      pinInput.destroy();
    });

    it("should update focus after paste", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
      });

      pinInput.paste("123");

      // Focus should be at last filled position
      expect(pinInput.state.focusedIndex).toBe(2);

      pinInput.destroy();
    });
  });

  describe("focus management", () => {
    it("should focus specific index", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
      });

      pinInput.focus(2);

      expect(pinInput.state.focusedIndex).toBe(2);

      pinInput.destroy();
    });

    it("should move focus forward with focusNext", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
      });

      pinInput.focus(2);
      pinInput.focusNext();

      expect(pinInput.state.focusedIndex).toBe(3);

      pinInput.destroy();
    });

    it("should not move focus past end", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
      });

      pinInput.focus(5);
      pinInput.focusNext();

      expect(pinInput.state.focusedIndex).toBe(5);

      pinInput.destroy();
    });

    it("should move focus backward with focusPrev", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
      });

      pinInput.focus(2);
      pinInput.focusPrev();

      expect(pinInput.state.focusedIndex).toBe(1);

      pinInput.destroy();
    });

    it("should not move focus before start", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
      });

      pinInput.focus(0);
      pinInput.focusPrev();

      expect(pinInput.state.focusedIndex).toBe(0);

      pinInput.destroy();
    });
  });

  describe("clear", () => {
    it("should clear all values", () => {
      const onValueChange = vi.fn();
      const pinInput = createPinInputBehavior({
        length: 6,
        defaultValue: "123456",
        onValueChange,
      });

      pinInput.clear();

      expect(pinInput.getValueAt(0)).toBe("");
      expect(pinInput.getValueAt(5)).toBe("");
      expect(onValueChange).toHaveBeenCalledWith("");

      pinInput.destroy();
    });

    it("should reset focus to first position", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
        defaultValue: "123",
      });

      pinInput.focus(3);
      pinInput.clear();

      expect(pinInput.state.focusedIndex).toBe(0);

      pinInput.destroy();
    });
  });

  describe("setValue", () => {
    it("should set complete value", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
      });

      pinInput.setValue("123456");

      expect(pinInput.getValueAt(0)).toBe("1");
      expect(pinInput.getValueAt(5)).toBe("6");

      pinInput.destroy();
    });

    it("should validate value in numeric mode", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
        alphanumeric: false,
      });

      pinInput.setValue("12ab56");

      // setValue should filter invalid chars
      expect(pinInput.getValueAt(0)).toBe("1");
      expect(pinInput.getValueAt(1)).toBe("2");

      pinInput.destroy();
    });
  });

  describe("getValueAt", () => {
    it("should get value at specific index", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
        defaultValue: "123",
      });

      expect(pinInput.getValueAt(0)).toBe("1");
      expect(pinInput.getValueAt(1)).toBe("2");
      expect(pinInput.getValueAt(2)).toBe("3");
      expect(pinInput.getValueAt(3)).toBe("");

      pinInput.destroy();
    });
  });

  describe("ARIA props", () => {
    it("should return correct container props", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
      });

      const props = pinInput.getContainerProps();

      expect(props.role).toBe("group");

      pinInput.destroy();
    });

    it("should return correct input props", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
      });

      const props = pinInput.getInputProps(0);

      expect(props.type).toBe("text");
      expect(props.inputMode).toBe("numeric");
      expect(props.maxLength).toBe(1);
      expect(props["aria-label"]).toContain("1");

      pinInput.destroy();
    });

    it("should return text inputMode for alphanumeric", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
        alphanumeric: true,
      });

      const props = pinInput.getInputProps(0);

      expect(props.inputMode).toBe("text");

      pinInput.destroy();
    });
  });

  describe("disabled state", () => {
    it("should not accept input when disabled", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
        disabled: true,
      });

      pinInput.input(0, "1");

      expect(pinInput.getValueAt(0)).toBe("");

      pinInput.destroy();
    });

    it("should not clear when disabled", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
        defaultValue: "123",
        disabled: true,
      });

      pinInput.clear();

      expect(pinInput.getValueAt(0)).toBe("1");

      pinInput.destroy();
    });
  });
});
