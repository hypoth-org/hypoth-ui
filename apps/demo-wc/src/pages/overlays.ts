import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { overlaysSectionContent } from '@hypoth-ui/demo-shared';

// Import WC components (bundled exports)
import '@hypoth-ui/wc/overlays';
import '@hypoth-ui/wc/core';
import '@hypoth-ui/wc/form-controls';

/**
 * Overlays page component showcasing dialog, sheet, drawer demos
 * Uses Light DOM so global CSS styles apply
 */
@customElement('demo-page-overlays')
export class DemoPageOverlays extends LitElement {
  @state()
  private dialogOpen = false;

  @state()
  private alertDialogOpen = false;

  @state()
  private sheetOpen = false;

  @state()
  private sheetSide: 'left' | 'right' | 'top' | 'bottom' = 'right';

  @state()
  private drawerOpen = false;

  // Use Light DOM so global CSS applies
  protected override createRenderRoot() {
    return this;
  }

  private handleDialogOpenChange(e: CustomEvent) {
    this.dialogOpen = e.detail?.open ?? false;
  }

  private handleAlertDialogOpenChange(e: CustomEvent) {
    this.alertDialogOpen = e.detail?.open ?? false;
  }

  private handleSheetOpenChange(e: CustomEvent) {
    if (e.type === 'ds:open') {
      this.sheetOpen = true;
    } else if (e.type === 'ds:close') {
      this.sheetOpen = false;
    }
  }

  private handleDrawerOpenChange(e: CustomEvent) {
    if (e.type === 'ds:open') {
      this.drawerOpen = true;
    } else if (e.type === 'ds:close') {
      this.drawerOpen = false;
    }
  }

  private setSheetSide(side: 'left' | 'right' | 'top' | 'bottom') {
    this.sheetSide = side;
  }

  render() {
    return html`
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="#dashboard">Dashboard</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current" aria-current="page">Overlays</span>
      </nav>
      <div class="page-header">
        <h2 class="page-title">${overlaysSectionContent.title}</h2>
        <p class="page-description">${overlaysSectionContent.description}</p>
      </div>

      <!-- Dialog Showcase -->
      <div class="showcase-card">
        <h3 class="showcase-title">Dialog</h3>
        <p class="showcase-description">
          A modal dialog interrupts the user with important content and expects a response.
        </p>
        <div class="showcase-demo">
          <ds-dialog
            ?open=${this.dialogOpen}
            @ds:open-change=${this.handleDialogOpenChange}
          >
            <ds-button slot="trigger">Open Dialog</ds-button>
            <ds-dialog-content>
              <ds-dialog-title>Edit Profile</ds-dialog-title>
              <ds-dialog-description>
                Make changes to your profile here. Click save when you're done.
              </ds-dialog-description>
              <div class="demo-form">
                <div class="form-field">
                  <label for="dialog-name">Name</label>
                  <ds-input id="dialog-name" value="John Doe"></ds-input>
                </div>
                <div class="form-field">
                  <label for="dialog-username">Username</label>
                  <ds-input id="dialog-username" value="@johndoe"></ds-input>
                </div>
              </div>
              <div class="dialog-actions">
                <ds-button variant="outline" @click=${() => { this.dialogOpen = false; }}>
                  Cancel
                </ds-button>
                <ds-button @click=${() => { this.dialogOpen = false; }}>
                  Save changes
                </ds-button>
              </div>
            </ds-dialog-content>
          </ds-dialog>
        </div>
      </div>

      <!-- Alert Dialog Showcase -->
      <div class="showcase-card">
        <h3 class="showcase-title">Alert Dialog</h3>
        <p class="showcase-description">
          A modal dialog that interrupts the user with important content and expects a confirmation.
        </p>
        <div class="showcase-demo">
          <ds-dialog
            ?open=${this.alertDialogOpen}
            @ds:open-change=${this.handleAlertDialogOpenChange}
          >
            <ds-button slot="trigger" variant="destructive">Delete Account</ds-button>
            <ds-dialog-content>
              <ds-dialog-title>Are you absolutely sure?</ds-dialog-title>
              <ds-dialog-description>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </ds-dialog-description>
              <div class="dialog-actions">
                <ds-button variant="outline" @click=${() => { this.alertDialogOpen = false; }}>
                  Cancel
                </ds-button>
                <ds-button variant="destructive" @click=${() => { this.alertDialogOpen = false; }}>
                  Yes, delete account
                </ds-button>
              </div>
            </ds-dialog-content>
          </ds-dialog>
        </div>
      </div>

      <!-- Sheet Showcase -->
      <div class="showcase-card">
        <h3 class="showcase-title">Sheet</h3>
        <p class="showcase-description">
          A slide-out panel that extends from the edge of the screen.
        </p>
        <div class="showcase-demo">
          <div class="side-buttons">
            <ds-button
              variant=${this.sheetSide === 'left' ? 'default' : 'outline'}
              size="sm"
              @click=${() => this.setSheetSide('left')}
            >
              Left
            </ds-button>
            <ds-button
              variant=${this.sheetSide === 'right' ? 'default' : 'outline'}
              size="sm"
              @click=${() => this.setSheetSide('right')}
            >
              Right
            </ds-button>
            <ds-button
              variant=${this.sheetSide === 'top' ? 'default' : 'outline'}
              size="sm"
              @click=${() => this.setSheetSide('top')}
            >
              Top
            </ds-button>
            <ds-button
              variant=${this.sheetSide === 'bottom' ? 'default' : 'outline'}
              size="sm"
              @click=${() => this.setSheetSide('bottom')}
            >
              Bottom
            </ds-button>
          </div>
          <ds-sheet
            ?open=${this.sheetOpen}
            @ds:open=${this.handleSheetOpenChange}
            @ds:close=${this.handleSheetOpenChange}
          >
            <ds-button slot="trigger">Open Sheet (${this.sheetSide})</ds-button>
            <ds-sheet-content side=${this.sheetSide}>
              <ds-sheet-header>
                <ds-sheet-title>Edit Profile</ds-sheet-title>
                <ds-sheet-description>
                  Make changes to your profile here.
                </ds-sheet-description>
              </ds-sheet-header>
              <div class="demo-form">
                <div class="form-field">
                  <label for="sheet-name">Name</label>
                  <ds-input id="sheet-name" value="John Doe"></ds-input>
                </div>
                <div class="form-field">
                  <label for="sheet-email">Email</label>
                  <ds-input id="sheet-email" value="john@example.com"></ds-input>
                </div>
              </div>
              <ds-sheet-footer>
                <ds-sheet-close>
                  <ds-button variant="outline">Cancel</ds-button>
                </ds-sheet-close>
                <ds-button @click=${() => { this.sheetOpen = false; }}>Save changes</ds-button>
              </ds-sheet-footer>
            </ds-sheet-content>
          </ds-sheet>
        </div>
      </div>

      <!-- Drawer Showcase -->
      <div class="showcase-card">
        <h3 class="showcase-title">Drawer</h3>
        <p class="showcase-description">
          A mobile-optimized slide-in panel with swipe-to-dismiss gesture support.
        </p>
        <div class="showcase-demo">
          <p class="demo-note" style="margin-bottom: 12px;">
            Drawers are optimized for mobile devices with touch gesture support.
            Try on a mobile device or resize your browser to see the best experience.
          </p>
          <ds-sheet
            ?open=${this.drawerOpen}
            @ds:open=${this.handleDrawerOpenChange}
            @ds:close=${this.handleDrawerOpenChange}
          >
            <ds-button slot="trigger">Open Drawer</ds-button>
            <ds-sheet-content side="bottom" size="sm">
              <ds-sheet-header>
                <ds-sheet-title>Move Goal</ds-sheet-title>
                <ds-sheet-description>
                  Set your daily activity goal.
                </ds-sheet-description>
              </ds-sheet-header>
              <div class="drawer-content">
                <div class="drawer-value">350</div>
                <div class="drawer-label">CALORIES/DAY</div>
              </div>
              <ds-sheet-footer>
                <ds-button style="width: 100%">Submit</ds-button>
              </ds-sheet-footer>
            </ds-sheet-content>
          </ds-sheet>
        </div>
      </div>

      <!-- Tooltip Showcase -->
      <div class="showcase-card">
        <h3 class="showcase-title">Tooltip & Popover</h3>
        <p class="showcase-description">
          Small overlays that show additional information on hover or click.
        </p>
        <div class="showcase-demo">
          <div class="tooltip-demo">
            <ds-button variant="outline" title="Add to library">
              Hover for tooltip
            </ds-button>
            <ds-button variant="outline">
              Click for popover
            </ds-button>
          </div>
          <p class="demo-note">
            Full Tooltip and Popover demos require additional integration.
            These components provide contextual information and actions.
          </p>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-page-overlays': DemoPageOverlays;
  }
}
