import type { NavSection } from './types';

/**
 * Navigation configuration for demo applications
 * 5 sections as defined in spec clarification
 */
export const navigation: NavSection[] = [
  {
    id: 'main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'home',
        href: '/',
      },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    items: [
      {
        id: 'forms',
        label: 'Forms',
        icon: 'text-cursor-input',
        href: '/forms',
      },
      {
        id: 'data-display',
        label: 'Data Display',
        icon: 'table',
        href: '/data-display',
      },
      {
        id: 'overlays',
        label: 'Overlays',
        icon: 'layers',
        href: '/overlays',
      },
      {
        id: 'feedback',
        label: 'Feedback',
        icon: 'message-circle',
        href: '/feedback',
      },
    ],
  },
];

/**
 * Get navigation for WC demo (hash-based routing)
 */
export function getWCNavigation(): NavSection[] {
  return navigation.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      href: `#${item.id}`,
    })),
  }));
}
