/**
 * Theme state for the demo application
 */
export interface ThemeState {
  /** Current theme mode */
  mode: 'light' | 'dark';
  /** Source of the theme preference */
  source: 'user' | 'system';
}

/**
 * Navigation item in the sidebar
 */
export interface NavItem {
  /** Unique identifier (kebab-case) */
  id: string;
  /** Display text */
  label: string;
  /** Icon identifier */
  icon: string;
  /** Route path (React) or hash (WC) */
  href: string;
}

/**
 * Navigation section grouping items
 */
export interface NavSection {
  /** Section identifier */
  id: string;
  /** Section heading (optional) */
  label?: string;
  /** Navigation items in this section */
  items: NavItem[];
}

/**
 * Mock user for avatar and profile demonstrations
 */
export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  status: 'active' | 'inactive' | 'pending';
}

/**
 * Mock product for data table and card demonstrations
 */
export interface MockProduct {
  id: string;
  name: string;
  description: string;
  /** Price in cents */
  price: number;
  category: string;
  inStock: boolean;
  imageUrl: string | null;
}

/**
 * Mock notification for toast and alert demonstrations
 */
export interface MockNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  /** ISO timestamp */
  timestamp: string;
  read: boolean;
}

/**
 * Component showcase configuration
 */
export interface ComponentShowcase {
  /** Component name (e.g., 'Button', 'Dialog') */
  component: string;
  /** Showcase title */
  title: string;
  /** What this demonstrates */
  description: string;
  /** Variants to show */
  variants: string[];
  /** Whether demo is interactive or static */
  interactive: boolean;
}

/**
 * Section content configuration
 */
export interface SectionContent {
  /** Section identifier */
  id: string;
  /** Page heading */
  title: string;
  /** Section description */
  description: string;
  /** Components to demonstrate */
  components: ComponentShowcase[];
}
