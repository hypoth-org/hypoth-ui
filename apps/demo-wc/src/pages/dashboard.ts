import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

/**
 * Dashboard page component
 * Uses Light DOM so global CSS styles apply
 */
@customElement('demo-page-dashboard')
export class DemoPageDashboard extends LitElement {
  // Use Light DOM so global CSS applies
  protected override createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="page-header">
        <h2 class="page-title">Dashboard</h2>
        <p class="page-description">
          Welcome to the Hypoth UI demo application. Explore the sidebar navigation to see
          different component showcases.
        </p>
      </div>

      <div class="showcase-card">
        <h3 class="showcase-title">Component Overview</h3>
        <p class="showcase-description">
          This demo showcases the design system components in a realistic application layout.
          Each section demonstrates different component categories.
        </p>
        <div class="showcase-demo">
          <div
            style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;"
          >
            <div
              style="padding: 16px; background: var(--color-card); border-radius: 6px; border: 1px solid var(--color-border);"
            >
              <h4 style="font-weight: 600; margin-bottom: 8px;">Forms</h4>
              <p style="color: var(--color-muted); font-size: 14px;">
                Input fields, selects, checkboxes, and more.
              </p>
            </div>
            <div
              style="padding: 16px; background: var(--color-card); border-radius: 6px; border: 1px solid var(--color-border);"
            >
              <h4 style="font-weight: 600; margin-bottom: 8px;">Data Display</h4>
              <p style="color: var(--color-muted); font-size: 14px;">
                Tables, lists, cards, and data visualization.
              </p>
            </div>
            <div
              style="padding: 16px; background: var(--color-card); border-radius: 6px; border: 1px solid var(--color-border);"
            >
              <h4 style="font-weight: 600; margin-bottom: 8px;">Overlays</h4>
              <p style="color: var(--color-muted); font-size: 14px;">
                Dialogs, drawers, tooltips, and popovers.
              </p>
            </div>
            <div
              style="padding: 16px; background: var(--color-card); border-radius: 6px; border: 1px solid var(--color-border);"
            >
              <h4 style="font-weight: 600; margin-bottom: 8px;">Feedback</h4>
              <p style="color: var(--color-muted); font-size: 14px;">
                Alerts, toasts, progress indicators.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="showcase-card">
        <h3 class="showcase-title">Quick Stats</h3>
        <p class="showcase-description">
          Sample dashboard statistics using design system components.
        </p>
        <div class="showcase-demo">
          <div
            style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;"
          >
            <div style="text-align: center;">
              <div style="font-size: 32px; font-weight: 700;">24</div>
              <div style="color: var(--color-muted); font-size: 14px;">Components</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 32px; font-weight: 700;">5</div>
              <div style="color: var(--color-muted); font-size: 14px;">Sections</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 32px; font-weight: 700;">2</div>
              <div style="color: var(--color-muted); font-size: 14px;">Themes</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 32px; font-weight: 700;">3</div>
              <div style="color: var(--color-muted); font-size: 14px;">Breakpoints</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-page-dashboard': DemoPageDashboard;
  }
}
