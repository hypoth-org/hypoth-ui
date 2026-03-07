import { describe, expect, it } from "vitest";

// Test that type-only imports work from main entry (server-safe)
import type {
  AlignValue,
  AsChildProps,
  BoxProps,
  ButtonProps,
  ButtonSize,
  ButtonVariant,
  DisplayValue,
  DsInputEventDetail,
  DsNavigateEventDetail,
  FlexDirection,
  IconName,
  IconProps,
  IconSize,
  InputProps,
  InputSize,
  InputType,
  JustifyValue,
  LinkProps,
  LinkVariant,
  SlotProps,
  SpacingValue,
  SpinnerProps,
  SpinnerSize,
  TextProps,
  TextSize,
  TextVariant,
  TextWeight,
  VisuallyHiddenProps,
} from "../src/index.js";

// Test that pure utility exports work from main entry (server-safe)
import {
  composeEventHandlers,
  mergeClassNames,
  mergeProps,
  mergeStyles,
  getThemeScriptContent,
  getThemeScriptTag,
  getThemeScriptProps,
  parseThemeCookie,
  getSystemColorMode,
  syncThemeStorage,
} from "../src/index.js";

describe("Main entry (server-safe)", () => {
  describe("pure utility exports", () => {
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

  describe("server-safe theme utilities", () => {
    it("should export getThemeScriptContent", () => {
      expect(getThemeScriptContent).toBeDefined();
      expect(typeof getThemeScriptContent).toBe("function");
    });

    it("should export getThemeScriptTag", () => {
      expect(getThemeScriptTag).toBeDefined();
      expect(typeof getThemeScriptTag).toBe("function");
    });

    it("should export getThemeScriptProps", () => {
      expect(getThemeScriptProps).toBeDefined();
      expect(typeof getThemeScriptProps).toBe("function");
    });

    it("should export parseThemeCookie", () => {
      expect(parseThemeCookie).toBeDefined();
      expect(typeof parseThemeCookie).toBe("function");
    });

    it("should export getSystemColorMode", () => {
      expect(getSystemColorMode).toBeDefined();
      expect(typeof getSystemColorMode).toBe("function");
    });

    it("should export syncThemeStorage", () => {
      expect(syncThemeStorage).toBeDefined();
      expect(typeof syncThemeStorage).toBe("function");
    });
  });

  describe("type exports compile correctly", () => {
    it("should allow creating typed objects using exported types", () => {
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
  it("should export base components from client entry", async () => {
    const clientExports = await import("../src/client.js");

    expect(clientExports.DsButton).toBeDefined();
    expect(clientExports.Input).toBeDefined();
    expect(clientExports.Link).toBeDefined();
    expect(clientExports.Icon).toBeDefined();
    expect(clientExports.Spinner).toBeDefined();
    expect(clientExports.VisuallyHidden).toBeDefined();
    expect(clientExports.Text).toBeDefined();
    expect(clientExports.Box).toBeDefined();
    expect(clientExports.Slot).toBeDefined();
  });

  it("should export form controls from client entry", async () => {
    const clientExports = await import("../src/client.js");

    expect(clientExports.Field).toBeDefined();
    expect(clientExports.Label).toBeDefined();
    expect(clientExports.FieldDescription).toBeDefined();
    expect(clientExports.FieldError).toBeDefined();
    expect(clientExports.Textarea).toBeDefined();
    expect(clientExports.Checkbox).toBeDefined();
    expect(clientExports.RadioGroup).toBeDefined();
    expect(clientExports.Radio).toBeDefined();
    expect(clientExports.Switch).toBeDefined();
  });

  it("should export overlay and menu components from client entry", async () => {
    const clientExports = await import("../src/client.js");

    expect(clientExports.Dialog).toBeDefined();
    expect(clientExports.Popover).toBeDefined();
    expect(clientExports.Tooltip).toBeDefined();
    expect(clientExports.AlertDialog).toBeDefined();
    expect(clientExports.Sheet).toBeDefined();
    expect(clientExports.Drawer).toBeDefined();
    expect(clientExports.Menu).toBeDefined();
    expect(clientExports.Select).toBeDefined();
    expect(clientExports.Combobox).toBeDefined();
    expect(clientExports.DropdownMenu).toBeDefined();
    expect(clientExports.ContextMenu).toBeDefined();
  });

  it("should export layout and structure from client entry", async () => {
    const clientExports = await import("../src/client.js");

    expect(clientExports.Card).toBeDefined();
    expect(clientExports.Tabs).toBeDefined();
    expect(clientExports.Accordion).toBeDefined();
    expect(clientExports.Collapsible).toBeDefined();
    expect(clientExports.Flow).toBeDefined();
    expect(clientExports.Stack).toBeDefined();
    expect(clientExports.Container).toBeDefined();
  });

  it("should export theme providers from client entry", async () => {
    const clientExports = await import("../src/client.js");

    expect(clientExports.ThemeProvider).toBeDefined();
    expect(clientExports.DensityProvider).toBeDefined();
    expect(clientExports.useTheme).toBeDefined();
    expect(clientExports.useColorMode).toBeDefined();
  });

  it("should export EmptyState from client entry", async () => {
    const clientExports = await import("../src/client.js");

    expect(clientExports.EmptyState).toBeDefined();
    expect(clientExports.EmptyStateRoot).toBeDefined();
    expect(clientExports.EmptyStateIcon).toBeDefined();
    expect(clientExports.EmptyStateTitle).toBeDefined();
    expect(clientExports.EmptyStateDescription).toBeDefined();
    expect(clientExports.EmptyStateAction).toBeDefined();
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
