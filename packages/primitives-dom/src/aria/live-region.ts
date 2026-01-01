/**
 * ARIA live region utility for dynamic announcements.
 * Creates screen reader announcements without visual changes.
 */

export type LivePoliteness = "polite" | "assertive" | "off";

export interface LiveRegionOptions {
  politeness?: LivePoliteness;
  atomic?: boolean;
  relevant?: "additions" | "removals" | "text" | "all";
}

let politeRegion: HTMLElement | null = null;
let assertiveRegion: HTMLElement | null = null;

function getOrCreateRegion(politeness: LivePoliteness): HTMLElement {
  if (politeness === "assertive") {
    if (!assertiveRegion || !assertiveRegion.isConnected) {
      assertiveRegion = createRegion("assertive");
    }
    return assertiveRegion;
  }

  if (!politeRegion || !politeRegion.isConnected) {
    politeRegion = createRegion("polite");
  }
  return politeRegion;
}

function createRegion(politeness: LivePoliteness): HTMLElement {
  const region = document.createElement("div");
  region.setAttribute("role", "status");
  region.setAttribute("aria-live", politeness);
  region.setAttribute("aria-atomic", "true");
  region.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  `;
  document.body.appendChild(region);
  return region;
}

/**
 * Announce a message to screen readers.
 * Uses ARIA live regions for dynamic announcements.
 */
export function announce(message: string, options: LiveRegionOptions = {}): void {
  const { politeness = "polite" } = options;

  if (politeness === "off") return;

  const region = getOrCreateRegion(politeness);

  // Clear and reset to ensure announcement triggers
  region.textContent = "";
  requestAnimationFrame(() => {
    region.textContent = message;
  });
}

/**
 * Clear live region announcements.
 */
export function clearAnnouncements(): void {
  if (politeRegion) politeRegion.textContent = "";
  if (assertiveRegion) assertiveRegion.textContent = "";
}
