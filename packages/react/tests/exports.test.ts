import { describe, expect, it } from "vitest";

// Test that type-only imports work (these should have no runtime code)
import type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  InputProps,
  InputType,
  InputSize,
  LinkProps,
  LinkVariant,
  IconProps,
  IconName,
  IconSize,
  SpinnerProps,
  SpinnerSize,
  VisuallyHiddenProps,
  TextProps,
  TextSize,
  TextWeight,
  TextVariant,
  BoxProps,
  SlotProps,
  DsNavigateEventDetail,
  DsInputEventDetail,
  SpacingValue,
  DisplayValue,
  FlexDirection,
  AlignValue,
  JustifyValue,
  AsChildProps,
} from "../src/index.js";

// Test that component exports work
import {
  Button,
  Input,
  Link,
  Icon,
  Spinner,
  VisuallyHidden,
  Text,
  Box,
  Slot,
  createEventHandler,
  attachEventListeners,
  createComponent,
  composeEventHandlers,
  mergeClassNames,
  mergeStyles,
  mergeProps,
} from "../src/index.js";

describe("Package exports", () => {
  describe("component exports", () => {
    it("should export Button component", () => {
      expect(Button).toBeDefined();
      expect(typeof Button).toBe("object"); // forwardRef returns object
    });

    it("should export Input component", () => {
      expect(Input).toBeDefined();
      expect(typeof Input).toBe("object");
    });

    it("should export Link component", () => {
      expect(Link).toBeDefined();
      expect(typeof Link).toBe("object");
    });

    it("should export Icon component", () => {
      expect(Icon).toBeDefined();
      expect(typeof Icon).toBe("object");
    });

    it("should export Spinner component", () => {
      expect(Spinner).toBeDefined();
      expect(typeof Spinner).toBe("object");
    });

    it("should export VisuallyHidden component", () => {
      expect(VisuallyHidden).toBeDefined();
      expect(typeof VisuallyHidden).toBe("object");
    });

    it("should export Text component", () => {
      expect(Text).toBeDefined();
      expect(typeof Text).toBe("object");
    });

    it("should export Box primitive", () => {
      expect(Box).toBeDefined();
      expect(typeof Box).toBe("object");
    });

    it("should export Slot primitive", () => {
      expect(Slot).toBeDefined();
      expect(typeof Slot).toBe("object");
    });
  });

  describe("utility exports", () => {
    it("should export createEventHandler", () => {
      expect(createEventHandler).toBeDefined();
      expect(typeof createEventHandler).toBe("function");
    });

    it("should export attachEventListeners", () => {
      expect(attachEventListeners).toBeDefined();
      expect(typeof attachEventListeners).toBe("function");
    });

    it("should export createComponent", () => {
      expect(createComponent).toBeDefined();
      expect(typeof createComponent).toBe("function");
    });

    it("should export composeEventHandlers", () => {
      expect(composeEventHandlers).toBeDefined();
      expect(typeof composeEventHandlers).toBe("function");
    });

    it("should export mergeClassNames", () => {
      expect(mergeClassNames).toBeDefined();
      expect(typeof mergeClassNames).toBe("function");
    });

    it("should export mergeStyles", () => {
      expect(mergeStyles).toBeDefined();
      expect(typeof mergeStyles).toBe("function");
    });

    it("should export mergeProps", () => {
      expect(mergeProps).toBeDefined();
      expect(typeof mergeProps).toBe("function");
    });
  });

  describe("type exports compile correctly", () => {
    // These tests verify that TypeScript type exports work correctly.
    // If these fail to compile, the type exports are broken.

    it("should allow creating typed objects using exported types", () => {
      // This test verifies types are properly exported by using them
      const buttonProps: ButtonProps = { children: "Click me" };
      const variant: ButtonVariant = "primary";
      const size: ButtonSize = "md";

      expect(buttonProps.children).toBe("Click me");
      expect(variant).toBe("primary");
      expect(size).toBe("md");
    });

    it("should export input types", () => {
      const inputProps: InputProps = { type: "email" };
      const inputType: InputType = "password";
      const inputSize: InputSize = "lg";

      expect(inputProps.type).toBe("email");
      expect(inputType).toBe("password");
      expect(inputSize).toBe("lg");
    });

    it("should export link types", () => {
      const linkProps: LinkProps = { href: "/about" };
      const linkVariant: LinkVariant = "underline";

      expect(linkProps.href).toBe("/about");
      expect(linkVariant).toBe("underline");
    });

    it("should export icon types", () => {
      const iconProps: IconProps = { name: "check" };
      const iconName: IconName = "close";
      const iconSize: IconSize = "lg";

      expect(iconProps.name).toBe("check");
      expect(iconName).toBe("close");
      expect(iconSize).toBe("lg");
    });

    it("should export spinner types", () => {
      const spinnerProps: SpinnerProps = { size: "lg" };
      const spinnerSize: SpinnerSize = "sm";

      expect(spinnerProps.size).toBe("lg");
      expect(spinnerSize).toBe("sm");
    });

    it("should export visually hidden types", () => {
      const vhProps: VisuallyHiddenProps = { children: "Screen reader text" };
      expect(vhProps.children).toBe("Screen reader text");
    });

    it("should export text types", () => {
      const textProps: TextProps = { size: "lg", weight: "bold" };
      const textSize: TextSize = "2xl";
      const textWeight: TextWeight = "semibold";
      const textVariant: TextVariant = "muted";

      expect(textProps.size).toBe("lg");
      expect(textSize).toBe("2xl");
      expect(textWeight).toBe("semibold");
      expect(textVariant).toBe("muted");
    });

    it("should export box types", () => {
      const boxProps: BoxProps = { p: 4, display: "flex" };
      expect(boxProps.p).toBe(4);
      expect(boxProps.display).toBe("flex");
    });

    it("should export slot types", () => {
      const slotProps: SlotProps = {};
      expect(slotProps).toBeDefined();
    });

    it("should export event types", () => {
      const navigateDetail: DsNavigateEventDetail = {
        href: "/test",
        external: false,
        originalEvent: new MouseEvent("click"),
      };
      const inputDetail: DsInputEventDetail = { value: "test" };

      expect(navigateDetail.href).toBe("/test");
      expect(inputDetail.value).toBe("test");
    });

    it("should export polymorphic types", () => {
      const spacing: SpacingValue = 4;
      const display: DisplayValue = "flex";
      const direction: FlexDirection = "column";
      const align: AlignValue = "center";
      const justify: JustifyValue = "between";
      const asChild: AsChildProps = { asChild: true };

      expect(spacing).toBe(4);
      expect(display).toBe("flex");
      expect(direction).toBe("column");
      expect(align).toBe("center");
      expect(justify).toBe("between");
      expect(asChild.asChild).toBe(true);
    });
  });
});

describe("Client entry point", () => {
  it("should export components from client entry", async () => {
    const clientExports = await import("../src/client.js");

    expect(clientExports.Button).toBeDefined();
    expect(clientExports.Input).toBeDefined();
    expect(clientExports.Link).toBeDefined();
    expect(clientExports.Icon).toBeDefined();
    expect(clientExports.Spinner).toBeDefined();
    expect(clientExports.VisuallyHidden).toBeDefined();
    expect(clientExports.Text).toBeDefined();
    expect(clientExports.Box).toBeDefined();
    expect(clientExports.Slot).toBeDefined();
  });

  it("should export utilities from client entry", async () => {
    const clientExports = await import("../src/client.js");

    expect(clientExports.createEventHandler).toBeDefined();
    expect(clientExports.attachEventListeners).toBeDefined();
    expect(clientExports.createComponent).toBeDefined();
    expect(clientExports.composeEventHandlers).toBeDefined();
    expect(clientExports.mergeClassNames).toBeDefined();
    expect(clientExports.mergeStyles).toBeDefined();
    expect(clientExports.mergeProps).toBeDefined();
  });
});
