import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/aspect-ratio/aspect-ratio.js";

expect.extend(toHaveNoViolations);

describe("AspectRatio Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic aspect ratio", () => {
    it("should have no accessibility violations", async () => {
      render(
        html`
          <ds-aspect-ratio ratio="16/9">
            <img src="https://example.com/image.jpg" alt="A landscape photograph" />
          </ds-aspect-ratio>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("aspect ratio with different ratios", () => {
    it("should have no violations for square ratio", async () => {
      render(
        html`
          <ds-aspect-ratio ratio="1/1">
            <img src="https://example.com/square.jpg" alt="Square image" />
          </ds-aspect-ratio>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for portrait ratio", async () => {
      render(
        html`
          <ds-aspect-ratio ratio="3/4">
            <img src="https://example.com/portrait.jpg" alt="Portrait image" />
          </ds-aspect-ratio>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("aspect ratio with video", () => {
    it("should have no violations with video content", async () => {
      render(
        html`
          <ds-aspect-ratio ratio="16/9">
            <iframe
              src="https://example.com/video"
              title="Video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media"
              allowfullscreen
            ></iframe>
          </ds-aspect-ratio>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("aspect ratio with map", () => {
    it("should have no violations with map iframe", async () => {
      render(
        html`
          <ds-aspect-ratio ratio="4/3">
            <iframe
              src="https://maps.example.com/embed"
              title="Location map"
              loading="lazy"
            ></iframe>
          </ds-aspect-ratio>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("aspect ratio with decorative content", () => {
    it("should have no violations with decorative image", async () => {
      render(
        html`
          <ds-aspect-ratio ratio="16/9">
            <img src="https://example.com/bg.jpg" alt="" role="presentation" />
          </ds-aspect-ratio>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("aspect ratio with figure", () => {
    it("should have no violations in figure context", async () => {
      render(
        html`
          <figure>
            <ds-aspect-ratio ratio="16/9">
              <img src="https://example.com/photo.jpg" alt="A scenic mountain view" />
            </ds-aspect-ratio>
            <figcaption>Mountain landscape at sunset</figcaption>
          </figure>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
