import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/file-upload/index.js";

describe("DsFileUpload", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  const _createMockFile = (name: string, size: number, type: string): File => {
    const blob = new Blob(["x".repeat(size)], { type });
    return new File([blob], name, { type });
  };

  describe("rendering", () => {
    it("should render dropzone", async () => {
      render(html`<ds-file-upload></ds-file-upload>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const dropzone = container.querySelector(".ds-file-upload__dropzone");
      expect(dropzone).toBeTruthy();
    });

    it("should render file input", async () => {
      render(html`<ds-file-upload></ds-file-upload>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const input = container.querySelector("input[type='file']");
      expect(input).toBeTruthy();
    });

    it("should have hidden file input", async () => {
      render(html`<ds-file-upload></ds-file-upload>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const input = container.querySelector("input[type='file']") as HTMLInputElement;
      // Input is hidden via class or aria-hidden
      expect(input?.getAttribute("aria-hidden")).toBe("true");
    });
  });

  describe("file selection", () => {
    it("should allow multiple files when enabled", async () => {
      render(html`<ds-file-upload multiple></ds-file-upload>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const input = container.querySelector("input[type='file']");
      expect(input?.hasAttribute("multiple")).toBe(true);
    });
  });

  describe("dropzone interaction", () => {
    it("should have button role on dropzone", async () => {
      render(html`<ds-file-upload></ds-file-upload>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const dropzone = container.querySelector(".ds-file-upload__dropzone");
      expect(dropzone?.getAttribute("role")).toBe("button");
    });

    it("should be keyboard accessible", async () => {
      render(html`<ds-file-upload></ds-file-upload>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const dropzone = container.querySelector(".ds-file-upload__dropzone");
      expect(dropzone?.getAttribute("tabindex")).toBe("0");
    });
  });

  describe("drag and drop", () => {
    it("should show drag state on dragenter", async () => {
      render(html`<ds-file-upload></ds-file-upload>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const dropzone = container.querySelector(".ds-file-upload__dropzone") as HTMLElement;
      dropzone?.dispatchEvent(new DragEvent("dragenter", { bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      // Check for data-dragging attribute
      expect(dropzone?.hasAttribute("data-dragging")).toBe(true);
    });

    it("should remove drag state on dragleave", async () => {
      render(html`<ds-file-upload></ds-file-upload>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const dropzone = container.querySelector(".ds-file-upload__dropzone") as HTMLElement;
      dropzone?.dispatchEvent(new DragEvent("dragenter", { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 50));

      dropzone?.dispatchEvent(new DragEvent("dragleave", { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(dropzone?.hasAttribute("data-dragging")).toBe(false);
    });
  });

  describe("disabled state", () => {
    it("should have disabled input when disabled", async () => {
      render(html`<ds-file-upload disabled></ds-file-upload>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const input = container.querySelector("input[type='file']");
      expect(input?.hasAttribute("disabled")).toBe(true);
    });

    it("should have aria-disabled on dropzone when disabled", async () => {
      render(html`<ds-file-upload disabled></ds-file-upload>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const dropzone = container.querySelector(".ds-file-upload__dropzone");
      expect(dropzone?.getAttribute("aria-disabled")).toBe("true");
    });
  });

  describe("file management methods", () => {
    it("should expose getFiles method", async () => {
      render(html`<ds-file-upload></ds-file-upload>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const fileUpload = container.querySelector("ds-file-upload") as HTMLElement & {
        getFiles: () => unknown[];
      };

      expect(typeof fileUpload.getFiles).toBe("function");
      expect(fileUpload.getFiles()).toEqual([]);
    });

    it("should expose clearFiles method", async () => {
      render(html`<ds-file-upload></ds-file-upload>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const fileUpload = container.querySelector("ds-file-upload") as HTMLElement & {
        clearFiles: () => void;
      };

      expect(typeof fileUpload.clearFiles).toBe("function");
    });

    it("should expose removeFile method", async () => {
      render(html`<ds-file-upload></ds-file-upload>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const fileUpload = container.querySelector("ds-file-upload") as HTMLElement & {
        removeFile: (id: string) => void;
      };

      expect(typeof fileUpload.removeFile).toBe("function");
    });
  });

  describe("accept attribute", () => {
    it("should set accept on input", async () => {
      render(html`<ds-file-upload accept="image/*"></ds-file-upload>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const input = container.querySelector("input[type='file']");
      expect(input?.getAttribute("accept")).toBe("image/*");
    });
  });

  describe("ARIA attributes", () => {
    it("should have accessible dropzone", async () => {
      render(html`<ds-file-upload></ds-file-upload>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const dropzone = container.querySelector(".ds-file-upload__dropzone");
      expect(dropzone?.getAttribute("role")).toBe("button");
      expect(dropzone?.getAttribute("tabindex")).toBe("0");
    });

    it("should have aria-label on dropzone", async () => {
      render(html`<ds-file-upload aria-label="Upload files"></ds-file-upload>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const dropzone = container.querySelector(".ds-file-upload__dropzone");
      expect(dropzone?.getAttribute("aria-label")).toBeTruthy();
    });
  });
});
