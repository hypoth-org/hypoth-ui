import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getWCNavigation } from '@ds/demo-shared';

// Import WC components (bundled exports)
import '@ds/wc/overlays';

/**
 * Mobile navigation component with hamburger trigger and Sheet
 * Visible only at mobile breakpoints (<768px)
 */
@customElement('demo-mobile-nav')
export class DemoMobileNav extends LitElement {
  @property({ type: String })
  currentRoute = 'dashboard';

  @state()
  private open = false;

  static styles = css`
    :host {
      display: none;
    }

    @media (max-width: 767px) {
      :host {
        display: block;
      }
    }

    .mobile-nav-trigger {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      padding: 0;
      border: none;
      background: transparent;
      color: var(--color-foreground);
      cursor: pointer;
      border-radius: 6px;
    }

    .mobile-nav-trigger:hover {
      background-color: var(--color-muted-subtle);
    }

    .mobile-nav-trigger:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    .mobile-nav-menu {
      padding-top: 16px;
    }

    .nav-section {
      margin-bottom: 16px;
    }

    .nav-section-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 8px 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 8px;
      border-radius: 6px;
      text-decoration: none;
      color: var(--color-foreground);
      background: transparent;
      font-weight: 400;
    }

    .nav-item:hover {
      background-color: var(--color-muted-subtle);
    }

    .nav-item.active {
      color: var(--color-primary);
      background-color: var(--color-primary-subtle);
      font-weight: 500;
    }

    .nav-item-icon {
      font-size: 18px;
    }

  `;

  private _getIcon(iconName: string): string {
    const icons: Record<string, string> = {
      home: '\u{1F3E0}',
      'text-cursor-input': '\u{1F4DD}',
      table: '\u{1F4CA}',
      layers: '\u{1F4E6}',
      'message-circle': '\u{1F4AC}',
    };
    return icons[iconName] || '\u{1F4C4}';
  }

  private handleOpen = () => {
    this.open = true;
  };

  private handleSheetChange = (e: CustomEvent) => {
    if (e.type === 'ds:open') {
      this.open = true;
    } else if (e.type === 'ds:close') {
      this.open = false;
      // Return focus to trigger
      const trigger = this.shadowRoot?.querySelector('.mobile-nav-trigger') as HTMLButtonElement;
      trigger?.focus();
    }
  };

  private handleNavClick = () => {
    this.open = false;
  };

  render() {
    const navigation = getWCNavigation();

    return html`
      <!-- Hamburger trigger button -->
      <button
        class="mobile-nav-trigger"
        @click=${this.handleOpen}
        aria-label="Open navigation menu"
        aria-expanded=${this.open}
        aria-controls="mobile-nav-sheet"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <!-- Navigation Sheet -->
      <ds-sheet
        ?open=${this.open}
        @ds:open=${this.handleSheetChange}
        @ds:close=${this.handleSheetChange}
      >
        <ds-sheet-content side="left" size="sm" id="mobile-nav-sheet">
          <ds-sheet-header>
            <ds-sheet-title>Navigation</ds-sheet-title>
          </ds-sheet-header>
          <nav class="mobile-nav-menu">
            ${navigation.map(
              (section) => html`
                <div class="nav-section">
                  ${section.label
                    ? html`<div class="nav-section-label">${section.label}</div>`
                    : null}
                  ${section.items.map(
                    (item) => html`
                      <a
                        href="${item.href}"
                        class="nav-item ${this.currentRoute === item.id ? 'active' : ''}"
                        @click=${this.handleNavClick}
                      >
                        <span class="nav-item-icon">${this._getIcon(item.icon)}</span>
                        <span>${item.label}</span>
                      </a>
                    `
                  )}
                </div>
              `
            )}
          </nav>
        </ds-sheet-content>
      </ds-sheet>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-mobile-nav': DemoMobileNav;
  }
}
