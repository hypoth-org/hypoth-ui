import type { ComponentTag } from "@ds/wc";

/**
 * Options for selective component registration.
 */
export interface RegisterOptions {
  /**
   * Specific component tags to register. If not provided, all components are registered.
   * @example ["ds-button", "ds-input"]
   */
  include?: ComponentTag[];

  /**
   * Component tags to exclude from registration.
   * Only used when `include` is not provided.
   * @example ["ds-dialog"]
   */
  exclude?: ComponentTag[];

  /**
   * Enable debug logging for registration.
   * @default false
   */
  debug?: boolean;
}

/**
 * Registers all design system Web Components.
 * Should be called once on the client side.
 *
 * @returns Promise that resolves when all components are registered
 *
 * @example
 * ```tsx
 * // Register all components
 * await registerAllElements();
 *
 * // Register specific components only
 * await registerAllElements({ include: ["ds-button", "ds-input"] });
 *
 * // Register all except certain components
 * await registerAllElements({ exclude: ["ds-dialog"] });
 * ```
 */
export async function registerAllElements(options: RegisterOptions = {}): Promise<void> {
  // Only run on client
  if (typeof window === "undefined") return;

  const { include, exclude, debug = false } = options;

  // Dynamically import registry utilities to avoid SSR issues
  const { getRegisteredTags, getComponentClass } = await import("@ds/wc");

  const allTags = getRegisteredTags();

  // Determine which tags to register
  let tagsToRegister: ComponentTag[];

  if (include && include.length > 0) {
    // Only register explicitly included tags
    tagsToRegister = include.filter((tag) => allTags.includes(tag));

    if (debug) {
      const unknown = include.filter((tag) => !allTags.includes(tag));
      if (unknown.length > 0) {
        console.warn(`[DsLoader] Unknown component tags: ${unknown.join(", ")}`);
      }
    }
  } else if (exclude && exclude.length > 0) {
    // Register all except excluded tags
    tagsToRegister = allTags.filter((tag) => !exclude.includes(tag));
  } else {
    // Register all tags
    tagsToRegister = allTags;
  }

  if (debug) {
    // biome-ignore lint/suspicious/noConsoleLog: Intentional debug output
    console.log(`[DsLoader] Registering ${tagsToRegister.length} components:`, tagsToRegister);
  }

  // Register each component
  const registrationPromises = tagsToRegister.map(async (tag) => {
    try {
      // Skip if already defined
      if (customElements.get(tag)) {
        if (debug) {
          // biome-ignore lint/suspicious/noConsoleLog: Intentional debug output
          console.log(`[DsLoader] ${tag} already registered, skipping`);
        }
        return;
      }

      // Load and register the component
      await getComponentClass(tag);

      if (debug) {
        // biome-ignore lint/suspicious/noConsoleLog: Intentional debug output
        console.log(`[DsLoader] Registered ${tag}`);
      }
    } catch (error) {
      console.error(`[DsLoader] Failed to register ${tag}:`, error);
    }
  });

  await Promise.all(registrationPromises);

  if (debug) {
    // biome-ignore lint/suspicious/noConsoleLog: Intentional debug output
    console.log("[DsLoader] All components registered");
  }
}

/**
 * Registers specific design system Web Components.
 * Convenience function for selective registration.
 *
 * @param tags - Array of component tags to register
 * @param options - Additional registration options
 * @returns Promise that resolves when specified components are registered
 *
 * @example
 * ```tsx
 * await registerElements(["ds-button", "ds-input"]);
 * ```
 */
export async function registerElements(
  tags: ComponentTag[],
  options: Omit<RegisterOptions, "include"> = {}
): Promise<void> {
  return registerAllElements({ ...options, include: tags });
}
