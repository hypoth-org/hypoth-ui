import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// Import the global styles as a string to adopt into shadow DOM
import globalStyles from '../../styles/globals.css?inline';

/**
 * App shell component for the WC demo
 * Provides the main layout structure: sidebar, header, and content area
 * Uses Shadow DOM for slot projection but adopts global styles
 */
@customElement('demo-app-shell')
export class DemoAppShell extends LitElement {
  @property({ type: Boolean, reflect: true })
  sidebarOpen = false;

  @state()
  private _isMobile = false;

  // Adopt global styles into shadow DOM so layout classes work
  static styles = css`
    ${unsafeCSS(globalStyles)}
  `;

  connectedCallback() {
    super.connectedCallback();
    this._checkMobile();
    window.addEventListener('resize', this._handleResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._handleResize);
  }

  private _handleResize = () => {
    this._checkMobile();
  };

  private _checkMobile() {
    this._isMobile = window.innerWidth < 768;
    if (!this._isMobile && this.sidebarOpen) {
      this.sidebarOpen = false;
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  render() {
    return html`
      <div class="app-shell">
        <!-- Skip to main content link -->
        <a href="#main-content" class="skip-link">Skip to main content</a>

        <!-- Mobile overlay -->
        <div
          class="mobile-nav-overlay ${this.sidebarOpen ? 'open' : ''}"
          @click=${this.closeSidebar}
        ></div>

        <!-- Sidebar slot -->
        <aside class="sidebar ${this.sidebarOpen ? 'open' : ''}">
          <slot name="sidebar"></slot>
        </aside>

        <!-- Header slot -->
        <header class="header">
          <slot name="header"></slot>
        </header>

        <!-- Main content -->
        <main id="main-content" class="main-content">
          <div class="content-container">
            <slot></slot>
          </div>
        </main>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-app-shell': DemoAppShell;
  }
}
