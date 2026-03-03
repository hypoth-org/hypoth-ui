import type { ComponentShowcase, SectionContent } from '../types.js';

/**
 * Feedback component showcase definitions for demo applications.
 */

export const alertShowcase: ComponentShowcase = {
  component: 'Alert',
  title: 'Alert',
  description: 'A message box for important information.',
  variants: ['info', 'success', 'warning', 'error'],
  interactive: false,
};

export const toastShowcase: ComponentShowcase = {
  component: 'Toast',
  title: 'Toast',
  description: 'A brief notification that appears temporarily.',
  variants: ['default', 'success', 'error', 'action'],
  interactive: true,
};

export const progressShowcase: ComponentShowcase = {
  component: 'Progress',
  title: 'Progress',
  description: 'A visual indicator of completion status.',
  variants: ['determinate', 'indeterminate'],
  interactive: false,
};

export const spinnerShowcase: ComponentShowcase = {
  component: 'Spinner',
  title: 'Spinner',
  description: 'A loading indicator for async operations.',
  variants: ['default', 'small', 'large'],
  interactive: false,
};

export const skeletonShowcase: ComponentShowcase = {
  component: 'Skeleton',
  title: 'Skeleton',
  description: 'A placeholder for loading content.',
  variants: ['text', 'circular', 'rectangular'],
  interactive: false,
};

export const feedbackSectionContent: SectionContent = {
  id: 'feedback',
  title: 'Feedback',
  description: 'Components for communicating system status and providing user feedback, including alerts, toasts, and loading indicators.',
  components: [
    alertShowcase,
    toastShowcase,
    progressShowcase,
    spinnerShowcase,
    skeletonShowcase,
  ],
};
