/**
 * ARIA assertion helpers for cross-framework testing.
 */

export interface AriaRole {
  role: string;
  element: Element;
}

/**
 * Gets the effective role of an element (explicit or implicit).
 */
export function getRole(element: Element): string | null {
  // Check explicit role
  const explicitRole = element.getAttribute("role");
  if (explicitRole) {
    return explicitRole;
  }

  // Check implicit role from tag name
  const implicitRoles: Record<string, string> = {
    BUTTON: "button",
    A: "link",
    INPUT: getInputRole(element as HTMLInputElement),
    SELECT: "combobox",
    TEXTAREA: "textbox",
    DIALOG: "dialog",
    ARTICLE: "article",
    ASIDE: "complementary",
    FOOTER: "contentinfo",
    HEADER: "banner",
    MAIN: "main",
    NAV: "navigation",
    SECTION: "region",
    FORM: "form",
    IMG: "img",
    UL: "list",
    OL: "list",
    LI: "listitem",
    TABLE: "table",
    THEAD: "rowgroup",
    TBODY: "rowgroup",
    TR: "row",
    TH: "columnheader",
    TD: "cell",
    H1: "heading",
    H2: "heading",
    H3: "heading",
    H4: "heading",
    H5: "heading",
    H6: "heading",
  };

  return implicitRoles[element.tagName] ?? null;
}

function getInputRole(input: HTMLInputElement): string {
  const type = input.type?.toLowerCase() ?? "text";
  const roleMap: Record<string, string> = {
    button: "button",
    checkbox: "checkbox",
    email: "textbox",
    number: "spinbutton",
    password: "textbox",
    radio: "radio",
    range: "slider",
    search: "searchbox",
    submit: "button",
    tel: "textbox",
    text: "textbox",
    url: "textbox",
  };
  return roleMap[type] ?? "textbox";
}

/**
 * Asserts that an element has the specified role.
 */
export function hasRole(element: Element, expectedRole: string): boolean {
  const actualRole = getRole(element);
  return actualRole === expectedRole;
}

/**
 * Gets an ARIA attribute value from an element.
 */
export function getAriaAttribute(element: Element, attribute: string): string | null {
  // Handle aria-* attributes
  if (attribute.startsWith("aria-")) {
    return element.getAttribute(attribute);
  }
  return element.getAttribute(`aria-${attribute}`);
}

/**
 * Asserts that an element has the specified ARIA attribute with the expected value.
 */
export function hasAriaAttribute(element: Element, attribute: string, expectedValue?: string): boolean {
  const value = getAriaAttribute(element, attribute);
  if (expectedValue === undefined) {
    return value !== null;
  }
  return value === expectedValue;
}

/**
 * Checks if an element is expanded (aria-expanded="true").
 */
export function isExpanded(element: Element): boolean {
  return element.getAttribute("aria-expanded") === "true";
}

/**
 * Checks if an element is collapsed (aria-expanded="false").
 */
export function isCollapsed(element: Element): boolean {
  return element.getAttribute("aria-expanded") === "false";
}

/**
 * Checks if an element is selected (aria-selected="true").
 */
export function isSelected(element: Element): boolean {
  return element.getAttribute("aria-selected") === "true";
}

/**
 * Checks if an element is checked (aria-checked="true").
 */
export function isChecked(element: Element): boolean {
  return element.getAttribute("aria-checked") === "true";
}

/**
 * Checks if an element is disabled (aria-disabled="true" or disabled attribute).
 */
export function isDisabled(element: Element): boolean {
  return (
    element.getAttribute("aria-disabled") === "true" ||
    element.hasAttribute("disabled")
  );
}

/**
 * Checks if an element is hidden from accessibility tree.
 */
export function isHidden(element: Element): boolean {
  return (
    element.getAttribute("aria-hidden") === "true" ||
    element.hasAttribute("hidden") ||
    (element as HTMLElement).style?.display === "none"
  );
}

/**
 * Checks if an element has a valid accessible name.
 */
export function hasAccessibleName(element: Element): boolean {
  // Check aria-label
  if (element.getAttribute("aria-label")) {
    return true;
  }

  // Check aria-labelledby
  const labelledBy = element.getAttribute("aria-labelledby");
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement?.textContent?.trim()) {
      return true;
    }
  }

  // Check for associated label element
  const id = element.id;
  if (id) {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label?.textContent?.trim()) {
      return true;
    }
  }

  // Check text content for some roles
  const role = getRole(element);
  if (role === "button" || role === "link") {
    return Boolean((element as HTMLElement).textContent?.trim());
  }

  return false;
}

/**
 * Gets the accessible name of an element.
 */
export function getAccessibleName(element: Element): string {
  // Check aria-label first
  const ariaLabel = element.getAttribute("aria-label");
  if (ariaLabel) {
    return ariaLabel;
  }

  // Check aria-labelledby
  const labelledBy = element.getAttribute("aria-labelledby");
  if (labelledBy) {
    const ids = labelledBy.split(/\s+/);
    const labels = ids
      .map((id) => document.getElementById(id)?.textContent?.trim())
      .filter(Boolean);
    if (labels.length > 0) {
      return labels.join(" ");
    }
  }

  // Check for associated label element
  const id = element.id;
  if (id) {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label?.textContent?.trim()) {
      return label.textContent.trim();
    }
  }

  // Fall back to text content
  return (element as HTMLElement).textContent?.trim() ?? "";
}

/**
 * Queries elements by role.
 */
export function queryByRole(container: Element, role: string): Element[] {
  const elements = container.querySelectorAll(`[role="${role}"]`);
  const result: Element[] = [];

  // Add explicit role matches
  elements.forEach((el) => result.push(el));

  // Add implicit role matches
  const implicitSelectors: Record<string, string> = {
    button: "button, input[type='button'], input[type='submit']",
    checkbox: "input[type='checkbox']",
    radio: "input[type='radio']",
    textbox: "input:not([type]), input[type='text'], input[type='email'], input[type='password'], input[type='tel'], input[type='url'], textarea",
    link: "a[href]",
    listbox: "select",
    option: "option",
    dialog: "dialog",
    heading: "h1, h2, h3, h4, h5, h6",
    list: "ul, ol",
    listitem: "li",
  };

  const selector = implicitSelectors[role];
  if (selector) {
    container.querySelectorAll(selector).forEach((el) => {
      if (!el.hasAttribute("role") && !result.includes(el)) {
        result.push(el);
      }
    });
  }

  return result;
}

/**
 * Gets all focusable elements within a container.
 */
export function getFocusableElements(container: Element): Element[] {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
    "[contenteditable='true']",
  ].join(", ");

  return Array.from(container.querySelectorAll(selector)).filter((el) => {
    return !isHidden(el) && !isDisabled(el);
  });
}
