import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getWCNavigation } from '@ds/demo-shared';

/**
 * Sidebar navigation component for the WC demo
 * Uses Light DOM so global CSS styles apply
 */
@customElement('demo-sidebar-nav')
export class DemoSidebarNav extends LitElement {
  @property({ type: String })
  currentRoute = 'dashboard';

  // Use Light DOM so global CSS applies
  protected override createRenderRoot() {
    return this;
  }

  private _getIcon(iconName: string): string {
    const icons: Record<string, string> = {
      home: '🏠',
      'text-cursor-input': '📝',
      table: '📊',
      layers: '📦',
      'message-circle': '💬',
    };
    return icons[iconName] || '📄';
  }

  render() {
    const navigation = getWCNavigation();

    return html`
      <div class="sidebar-header">
        <span style="font-weight: 600;">Hypoth UI</span>
      </div>
      <nav class="sidebar-nav">
        ${navigation.map(
          (section) => html`
            <div class="sidebar-section">
              ${section.label
                ? html`<div class="sidebar-section-label">${section.label}</div>`
                : null}
              ${section.items.map(
                (item) => html`
                  <a
                    href="${item.href}"
                    class="sidebar-item ${this.currentRoute === item.id ? 'active' : ''}"
                  >
                    <span class="sidebar-item-icon">${this._getIcon(item.icon)}</span>
                    <span class="sidebar-item-label">${item.label}</span>
                  </a>
                `
              )}
            </div>
          `
        )}
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-sidebar-nav': DemoSidebarNav;
  }
}
