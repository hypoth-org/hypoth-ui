/**
 * ARIA describedby Connection Utility
 *
 * Manages aria-describedby relationships between elements.
 * Handles ID generation and cleanup.
 *
 * @packageDocumentation
 */

/**
 * Generate a unique ID using crypto.randomUUID().
 * Uses first 8 characters for brevity while maintaining uniqueness.
 */
function generateUniqueId(prefix = "desc"): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

/**
 * Connect an element to one or more describers via aria-describedby.
 *
 * Automatically generates IDs for describers that don't have them.
 * Returns a cleanup function to remove the connection.
 *
 * @param element - The element to describe
 * @param describers - Elements that describe the element
 * @returns Cleanup function to remove the aria-describedby connection
 *
 * @example
 * ```ts
 * // Connect input to help text and error message
 * const cleanup = connectAriaDescribedBy(input, [helpText, errorMessage]);
 *
 * // The aria-describedby attribute is automatically set
 * // input.getAttribute('aria-describedby') → "help-text-1 error-msg-2"
 *
 * // Later, when disconnecting
 * cleanup();
 * // aria-describedby attribute is removed
 * ```
 *
 * @example
 * ```ts
 * // Single describer
 * const cleanup = connectAriaDescribedBy(button, [tooltip]);
 *
 * // With existing IDs (preserved)
 * errorMessage.id = "existing-error-id";
 * const cleanup = connectAriaDescribedBy(input, [errorMessage]);
 * // input.getAttribute('aria-describedby') → "existing-error-id"
 * ```
 */
export function connectAriaDescribedBy(
  element: HTMLElement,
  describers: HTMLElement[]
): () => void {
  if (!describers.length) {
    return () => {};
  }

  // Track which IDs we generated (so we know not to remove user-provided IDs)
  const generatedIds: string[] = [];

  // Ensure each describer has an ID
  const ids = describers.map((describer) => {
    if (!describer.id) {
      const id = generateUniqueId("desc");
      describer.id = id;
      generatedIds.push(id);
    }
    return describer.id;
  });

  // Store the original aria-describedby value to restore on cleanup
  const originalDescribedBy = element.getAttribute("aria-describedby");

  // Set the aria-describedby attribute
  const describedByValue = originalDescribedBy
    ? `${originalDescribedBy} ${ids.join(" ")}`
    : ids.join(" ");
  element.setAttribute("aria-describedby", describedByValue);

  // Return cleanup function
  return () => {
    if (originalDescribedBy) {
      element.setAttribute("aria-describedby", originalDescribedBy);
    } else {
      element.removeAttribute("aria-describedby");
    }

    // Remove generated IDs from describers
    generatedIds.forEach((id) => {
      const describer = describers.find((d) => d.id === id);
      if (describer) {
        describer.removeAttribute("id");
      }
    });
  };
}

/**
 * Connect an element to a single describer via aria-describedby.
 *
 * Convenience wrapper around connectAriaDescribedBy for single describer.
 *
 * @param element - The element to describe
 * @param describer - Element that describes the element
 * @returns Cleanup function
 */
export function connectSingleDescriber(
  element: HTMLElement,
  describer: HTMLElement
): () => void {
  return connectAriaDescribedBy(element, [describer]);
}

/**
 * Add a describer to an element's existing aria-describedby list.
 *
 * Unlike connectAriaDescribedBy, this appends to existing describers
 * without replacing them.
 *
 * @param element - The element to describe
 * @param describer - Element to add as a describer
 * @returns Cleanup function that removes only the added describer
 */
export function addAriaDescriber(
  element: HTMLElement,
  describer: HTMLElement
): () => void {
  // Ensure describer has an ID
  let generatedId: string | null = null;
  if (!describer.id) {
    generatedId = generateUniqueId("desc");
    describer.id = generatedId;
  }

  // Get existing aria-describedby
  const existing = element.getAttribute("aria-describedby");
  const existingIds = existing ? existing.split(/\s+/) : [];

  // Don't add duplicates
  if (existingIds.includes(describer.id)) {
    return () => {};
  }

  // Add the new ID
  existingIds.push(describer.id);
  element.setAttribute("aria-describedby", existingIds.join(" "));

  // Return cleanup function
  return () => {
    const current = element.getAttribute("aria-describedby");
    if (current) {
      const ids = current.split(/\s+/).filter((id) => id !== describer.id);
      if (ids.length) {
        element.setAttribute("aria-describedby", ids.join(" "));
      } else {
        element.removeAttribute("aria-describedby");
      }
    }

    // Remove generated ID
    if (generatedId) {
      describer.removeAttribute("id");
    }
  };
}
