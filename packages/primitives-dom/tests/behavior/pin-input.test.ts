import { describe, expect, it, vi } from "vitest";
import { createPinInputBehavior } from "../../src/behavior/pin-input";

describe("createPinInputBehavior", () => {
  describe("initialization", () => {
    it("should create pin input with default length", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
      });

      expect(pinInput.state.value).toBe("");
      expect(pinInput.state.focusedIndex).toBeNull();

      pinInput.destroy();
    });

    it("should accept default value", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
        defaultValue: "123",
      });

      expect(pinInput.state.value).toBe("123");

      pinInput.destroy();
    });

    it("should truncate default value to length", () => {
      const pinInput = createPinInputBehavior({
        length: 4,
        defaultValue: "123456",
      });

      expect(pinInput.state.value).toBe("1234");

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

      expect(pinInput.state.value).toBe("1");
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

      expect(pinInput.state.value).toBe("");

      pinInput.destroy();
    });

    it("should accept alphanumeric input when enabled", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
        alphanumeric: true,
      });

      pinInput.input(0, "a");

      expect(pinInput.state.value).toBe("a");

      pinInput.destroy();
    });

    it("should convert to uppercase in alphanumeric mode", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
        alphanumeric: true,
      });

      pinInput.input(0, "a");

      expect(pinInput.state.value).toBe("A");

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

      expect(pinInput.state.value).toBe("12");

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

    it("should clear previous digit if current is empty", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
        defaultValue: "12",
      });

      pinInput.focus(2);
      pinInput.backspace(2);

      expect(pinInput.state.value).toBe("1");
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

      expect(pinInput.state.value).toBe("123456");
      expect(onComplete).toHaveBeenCalledWith("123456");

      pinInput.destroy();
    });

    it("should truncate pasted value to length", () => {
      const pinInput = createPinInputBehavior({
        length: 4,
      });

      pinInput.paste("123456789");

      expect(pinInput.state.value).toBe("1234");

      pinInput.destroy();
    });

    it("should filter non-digit characters in numeric mode", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
        alphanumeric: false,
      });

      pinInput.paste("1a2b3c");

      expect(pinInput.state.value).toBe("123");

      pinInput.destroy();
    });

    it("should focus last filled position after paste", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
      });

      pinInput.paste("123");

      expect(pinInput.state.focusedIndex).toBe(3);

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

    it("should move focus with arrow keys", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
      });

      pinInput.focus(2);
      pinInput.focusNext();

      expect(pinInput.state.focusedIndex).toBe(3);

      pinInput.destroy();
    });

    it("should not move focus past bounds", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
      });

      pinInput.focus(5);
      pinInput.focusNext();

      expect(pinInput.state.focusedIndex).toBe(5);

      pinInput.destroy();
    });

    it("should move focus backward", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
      });

      pinInput.focus(2);
      pinInput.focusPrev();

      expect(pinInput.state.focusedIndex).toBe(1);

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

      expect(pinInput.state.value).toBe("");
      expect(onValueChange).toHaveBeenCalledWith("");

      pinInput.destroy();
    });
  });

  describe("setValue", () => {
    it("should set complete value", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
      });

      pinInput.setValue("123456");

      expect(pinInput.state.value).toBe("123456");

      pinInput.destroy();
    });

    it("should validate value", () => {
      const pinInput = createPinInputBehavior({
        length: 6,
        alphanumeric: false,
      });

      pinInput.setValue("12ab56");

      expect(pinInput.state.value).toBe("1256");

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

      expect(pinInput.state.value).toBe("");

      pinInput.destroy();
    });
  });
});
