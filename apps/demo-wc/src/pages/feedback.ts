import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { feedbackSectionContent } from '@ds/demo-shared';

// Import WC components (bundled exports)
import '@ds/wc/feedback';
import '@ds/wc/core';
import { dsToast } from '@ds/wc';

/**
 * Feedback page component showcasing feedback and status components
 * Uses Light DOM so global CSS styles apply
 */
@customElement('demo-page-feedback')
export class DemoPageFeedback extends LitElement {
  // Use Light DOM so global CSS applies
  protected override createRenderRoot() {
    return this;
  }

  private showToast(variant: 'info' | 'success' | 'error') {
    const title = variant === 'success' ? 'Success!' : variant === 'error' ? 'Error' : 'Notification';
    dsToast({
      title,
      description: `This is a ${variant} toast message.`,
      variant,
    });
  }

  render() {
    return html`
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="#dashboard">Dashboard</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current" aria-current="page">Feedback</span>
      </nav>
      <div class="page-header">
        <h2 class="page-title">${feedbackSectionContent.title}</h2>
        <p class="page-description">${feedbackSectionContent.description}</p>
      </div>

      <!-- Alert Showcase -->
      <div class="showcase-card">
        <h3 class="showcase-title">Alert</h3>
        <p class="showcase-description">
          A message box for important information.
        </p>
        <div class="showcase-demo">
          <div class="alert-stack">
            <ds-alert variant="info">
              This is an informational alert message.
            </ds-alert>
            <ds-alert variant="success">
              Your changes have been saved successfully.
            </ds-alert>
            <ds-alert variant="warning">
              Please review your input before continuing.
            </ds-alert>
            <ds-alert variant="destructive">
              An error occurred. Please try again later.
            </ds-alert>
          </div>
        </div>
      </div>

      <!-- Toast Showcase -->
      <div class="showcase-card">
        <h3 class="showcase-title">Toast</h3>
        <p class="showcase-description">
          A brief notification that appears temporarily.
        </p>
        <div class="showcase-demo">
          <div class="toast-buttons">
            <ds-button @click=${() => this.showToast('info')}>
              Info Toast
            </ds-button>
            <ds-button variant="secondary" @click=${() => this.showToast('success')}>
              Success Toast
            </ds-button>
            <ds-button variant="destructive" @click=${() => this.showToast('error')}>
              Error Toast
            </ds-button>
          </div>
        </div>
      </div>

      <!-- Progress Showcase -->
      <div class="showcase-card">
        <h3 class="showcase-title">Progress</h3>
        <p class="showcase-description">
          A visual indicator of completion status.
        </p>
        <div class="showcase-demo">
          <div class="progress-stack">
            <div class="progress-item">
              <div class="progress-label">25% Complete</div>
              <ds-progress value="25"></ds-progress>
            </div>
            <div class="progress-item">
              <div class="progress-label">50% Complete</div>
              <ds-progress value="50"></ds-progress>
            </div>
            <div class="progress-item">
              <div class="progress-label">75% Complete</div>
              <ds-progress value="75"></ds-progress>
            </div>
            <div class="progress-item">
              <div class="progress-label">100% Complete</div>
              <ds-progress value="100"></ds-progress>
            </div>
          </div>
        </div>
      </div>

      <!-- Spinner Showcase -->
      <div class="showcase-card">
        <h3 class="showcase-title">Spinner</h3>
        <p class="showcase-description">
          A loading indicator for async operations.
        </p>
        <div class="showcase-demo">
          <div class="spinner-row">
            <ds-spinner size="sm"></ds-spinner>
            <ds-spinner size="md"></ds-spinner>
            <ds-spinner size="lg"></ds-spinner>
          </div>
        </div>
      </div>

      <!-- Skeleton Showcase -->
      <div class="showcase-card">
        <h3 class="showcase-title">Skeleton</h3>
        <p class="showcase-description">
          A placeholder for loading content.
        </p>
        <div class="showcase-demo">
          <div class="skeleton-demo">
            <div class="skeleton-header">
              <ds-skeleton variant="circular" width="48" height="48"></ds-skeleton>
              <div class="skeleton-text">
                <ds-skeleton variant="text" width="60%" height="16" style="margin-bottom: 8px;"></ds-skeleton>
                <ds-skeleton variant="text" width="40%" height="14"></ds-skeleton>
              </div>
            </div>
            <ds-skeleton variant="rectangular" width="100%" height="120"></ds-skeleton>
            <ds-skeleton variant="text" width="100%" height="14"></ds-skeleton>
            <ds-skeleton variant="text" width="80%" height="14"></ds-skeleton>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-page-feedback': DemoPageFeedback;
  }
}
