import type { ComponentShowcase, SectionContent } from '../types.js';

/**
 * Data Display component showcase definitions for demo applications.
 */

export const tableShowcase: ComponentShowcase = {
  component: 'Table',
  title: 'Table',
  description: 'A structured data table with headers and rows.',
  variants: ['default', 'striped', 'bordered'],
  interactive: true,
};

export const dataTableShowcase: ComponentShowcase = {
  component: 'DataTable',
  title: 'Data Table',
  description: 'A feature-rich table with sorting, filtering, and pagination.',
  variants: ['default', 'sortable', 'selectable'],
  interactive: true,
};

export const listShowcase: ComponentShowcase = {
  component: 'List',
  title: 'List',
  description: 'A vertically arranged set of items.',
  variants: ['default', 'selectable', 'ordered'],
  interactive: true,
};

export const cardShowcase: ComponentShowcase = {
  component: 'Card',
  title: 'Card',
  description: 'A container for grouping related content.',
  variants: ['default', 'bordered', 'elevated'],
  interactive: false,
};

export const avatarShowcase: ComponentShowcase = {
  component: 'Avatar',
  title: 'Avatar',
  description: 'A visual representation of a user or entity.',
  variants: ['image', 'initials', 'fallback'],
  interactive: false,
};

export const badgeShowcase: ComponentShowcase = {
  component: 'Badge',
  title: 'Badge',
  description: 'A small label for status or count indicators.',
  variants: ['default', 'success', 'warning', 'error'],
  interactive: false,
};

export const tagShowcase: ComponentShowcase = {
  component: 'Tag',
  title: 'Tag',
  description: 'A compact element for labeling and categorization.',
  variants: ['default', 'removable', 'colorful'],
  interactive: true,
};

export const dataDisplaySectionContent: SectionContent = {
  id: 'data-display',
  title: 'Data Display',
  description: 'Components for presenting data in various formats, including tables, lists, cards, and visual indicators.',
  components: [
    tableShowcase,
    dataTableShowcase,
    listShowcase,
    cardShowcase,
    avatarShowcase,
    badgeShowcase,
    tagShowcase,
  ],
};
