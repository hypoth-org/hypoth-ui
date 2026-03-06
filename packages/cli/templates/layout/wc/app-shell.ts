/**
 * AppShell Web Component
 *
 * Application structure with landmark regions using CSS Grid.
 *
 * @element ds-app-shell
 * @slot header - Header region
 * @slot sidebar - Sidebar region
 * @slot - Default slot for main content
 * @slot footer - Footer region
 */

import { type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

type SidebarPosition = "left" | "right" | "none";

export class DsAppShell extends DSElement {
  static override styles = [];

  /**
   * Sidebar position.
   */
  @property({ type: String, reflect: true, attribute: "sidebar-position" })
  sidebarPosition: SidebarPosition = "none";

  override render(): TemplateResult {
    const classes = {
      "ds-app-shell": true,
    };

    return html`
      <div
        class=${classMap(classes)}
        data-sidebar=${this.sidebarPosition}
        data-layout="app-shell"
      >
        <slot name="header"></slot>
        ${this.sidebarPosition !== "none" ? html`<slot name="sidebar"></slot>` : null}
        <slot></slot>
        <slot name="footer"></slot>
      </div>
    `;
  }
}

// Register the component
define("ds-app-shell", DsAppShell);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-app-shell": DsAppShell;
  }
}
