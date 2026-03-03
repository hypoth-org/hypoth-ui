import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { dataDisplaySectionContent, mockUsers, mockProducts, formatPrice } from '@ds/demo-shared';

// Import WC components (bundled exports)
import '@ds/wc/data-display';

/**
 * Data Display page component showcasing data presentation components
 * Uses Light DOM so global CSS styles apply
 */
@customElement('demo-page-data-display')
export class DemoPageDataDisplay extends LitElement {
  // Use Light DOM so global CSS applies
  protected override createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="#dashboard">Dashboard</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current" aria-current="page">Data Display</span>
      </nav>
      <div class="page-header">
        <h2 class="page-title">${dataDisplaySectionContent.title}</h2>
        <p class="page-description">${dataDisplaySectionContent.description}</p>
      </div>

      <!-- Table Showcase -->
      <div class="showcase-card">
        <h3 class="showcase-title">Table</h3>
        <p class="showcase-description">
          A structured data table with headers and rows.
        </p>
        <div class="showcase-demo">
          <ds-table>
            <ds-table-header>
              <ds-table-row>
                <ds-table-head>Name</ds-table-head>
                <ds-table-head>Email</ds-table-head>
                <ds-table-head>Role</ds-table-head>
                <ds-table-head>Status</ds-table-head>
              </ds-table-row>
            </ds-table-header>
            <ds-table-body>
              ${mockUsers.slice(0, 5).map(
                (user) => html`
                  <ds-table-row>
                    <ds-table-cell>${user.name}</ds-table-cell>
                    <ds-table-cell>${user.email}</ds-table-cell>
                    <ds-table-cell>${user.role}</ds-table-cell>
                    <ds-table-cell>
                      <ds-badge variant=${user.status === 'active' ? 'success' : user.status === 'pending' ? 'warning' : 'secondary'}>
                        ${user.status}
                      </ds-badge>
                    </ds-table-cell>
                  </ds-table-row>
                `
              )}
            </ds-table-body>
          </ds-table>
        </div>
      </div>

      <!-- Card Showcase -->
      <div class="showcase-card">
        <h3 class="showcase-title">Card</h3>
        <p class="showcase-description">
          A container for grouping related content.
        </p>
        <div class="showcase-demo">
          <div class="cards-grid">
            ${mockProducts.slice(0, 3).map(
              (product) => html`
                <ds-card>
                  <ds-card-header>
                    <div class="card-header-content">${product.name}</div>
                    <div class="card-category">${product.category}</div>
                  </ds-card-header>
                  <ds-card-content>
                    <p class="card-description">${product.description}</p>
                    <div class="card-footer">
                      <span class="price">${formatPrice(product.price)}</span>
                      <ds-badge variant=${product.inStock ? 'success' : 'secondary'}>
                        ${product.inStock ? 'In Stock' : 'Out of Stock'}
                      </ds-badge>
                    </div>
                  </ds-card-content>
                </ds-card>
              `
            )}
          </div>
        </div>
      </div>

      <!-- Avatar Showcase -->
      <div class="showcase-card">
        <h3 class="showcase-title">Avatar</h3>
        <p class="showcase-description">
          A visual representation of a user or entity.
        </p>
        <div class="showcase-demo">
          <div class="avatar-row">
            <ds-avatar size="sm" name="John Doe"></ds-avatar>
            <ds-avatar size="md" name="Jane Smith"></ds-avatar>
            <ds-avatar size="lg" name="Bob Wilson"></ds-avatar>
            <ds-avatar size="lg" name="Alice Johnson" status="active"></ds-avatar>
          </div>
        </div>
      </div>

      <!-- Badge Showcase -->
      <div class="showcase-card">
        <h3 class="showcase-title">Badge</h3>
        <p class="showcase-description">
          A small label for status or count indicators.
        </p>
        <div class="showcase-demo">
          <div class="badge-row">
            <ds-badge>Default</ds-badge>
            <ds-badge variant="secondary">Secondary</ds-badge>
            <ds-badge variant="success">Success</ds-badge>
            <ds-badge variant="warning">Warning</ds-badge>
            <ds-badge variant="destructive">Error</ds-badge>
          </div>
        </div>
      </div>

      <!-- Tag Showcase -->
      <div class="showcase-card">
        <h3 class="showcase-title">Tag</h3>
        <p class="showcase-description">
          A compact element for labeling and categorization.
        </p>
        <div class="showcase-demo">
          <div class="tag-row">
            <ds-tag>React</ds-tag>
            <ds-tag variant="secondary">TypeScript</ds-tag>
            <ds-tag variant="success">Active</ds-tag>
            <ds-tag variant="warning">Pending</ds-tag>
            <ds-tag removable>Removable</ds-tag>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-page-data-display': DemoPageDataDisplay;
  }
}
