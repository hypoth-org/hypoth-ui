import { LitElement, html, css, unsafeCSS, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// Import the global styles as a string to adopt into shadow DOM
import globalStyles from '../../styles/globals.css?inline';

/**
 * App shell component for the WC demo
 * Provides the main layout structure: sidebar, header, and content area
 * Uses Shadow DOM for slot projection but adopts global styles.
 *
 * Mirrors data-theme from <html> into the shadow DOM so that
 * [data-theme='dark'] selectors in globals.css work inside the shadow boundary.
 */
@customElement('demo-app-shell')
export class DemoAppShell extends LitElement {
  @property({ type: Boolean, reflect: true })
  sidebarOpen = false;

  @state()
  private _isMobile = false;

  @state()
  private _theme = '';

  private _themeObserver: MutationObserver | null = null;

  // Adopt global styles into shadow DOM so layout classes work
  static styles = css`
    ${unsafeCSS(globalStyles)}
  `;

  connectedCallback() {
    super.connectedCallback();
    this._checkMobile();
    this._syncTheme();
    window.addEventListener('resize', this._handleResize);

    // Observe data-theme changes on <html> and mirror into shadow DOM
    this._themeObserver = new MutationObserver(() => this._syncTheme());
    this._themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._handleResize);
    this._themeObserver?.disconnect();
    this._themeObserver = null;
  }

  private _handleResize = () => {
    this._checkMobile();
  };

  private _syncTheme() {
    this._theme = document.documentElement.getAttribute('data-theme') || '';
  }

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
      <div class="app-shell" data-theme=${this._theme || nothing}>
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
