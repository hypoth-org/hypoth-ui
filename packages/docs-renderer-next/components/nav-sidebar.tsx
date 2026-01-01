"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@ds/docs-core";

interface NavSidebarProps {
  /** Custom navigation items (optional, uses defaults if not provided) */
  navigation?: {
    components: NavItem[];
    guides: NavItem[];
  };
}

// Default navigation structure
const defaultNavigation = {
  guides: [
    {
      id: "introduction",
      label: "Introduction",
      href: "",
      type: "category" as const,
      order: 0,
      children: [
        {
          id: "getting-started",
          label: "Getting Started",
          href: "/guides/getting-started",
          type: "guide" as const,
          order: 1,
        },
      ],
    },
    {
      id: "customization",
      label: "Customization",
      href: "",
      type: "category" as const,
      order: 1,
      children: [
        {
          id: "theming",
          label: "Theming",
          href: "/guides/theming",
          type: "guide" as const,
          order: 1,
        },
      ],
    },
  ],
  components: [
    {
      id: "actions",
      label: "Actions",
      href: "",
      type: "category" as const,
      order: 0,
      children: [
        {
          id: "button",
          label: "Button",
          href: "/components/button",
          type: "component" as const,
          order: 0,
          status: "stable" as const,
        },
      ],
    },
    {
      id: "forms",
      label: "Forms",
      href: "",
      type: "category" as const,
      order: 1,
      children: [
        {
          id: "input",
          label: "Input",
          href: "/components/input",
          type: "component" as const,
          order: 0,
          status: "stable" as const,
        },
      ],
    },
  ],
};

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={`nav-link ${isActive ? "nav-link--active" : ""}`}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="nav-link-label">{item.label}</span>
      {item.status && (
        <span className={`nav-link-status nav-link-status--${item.status}`}>
          {item.status}
        </span>
      )}
    </Link>
  );
}

function NavCategory({ item }: { item: NavItem }) {
  return (
    <div className="nav-category">
      <h3 className="nav-category-title">{item.label}</h3>
      {item.children && (
        <ul className="nav-category-list">
          {item.children.map((child) => (
            <li key={child.id}>
              <NavLink item={child} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function NavSidebar({ navigation = defaultNavigation }: NavSidebarProps) {
  return (
    <nav className="nav-sidebar" aria-label="Documentation navigation">
      <div className="nav-sidebar-header">
        <Link href="/" className="nav-sidebar-logo">
          Design System
        </Link>
      </div>

      <div className="nav-sidebar-content">
        <section className="nav-section">
          <h2 className="nav-section-title">Guides</h2>
          {navigation.guides.map((item) => (
            <NavCategory key={item.id} item={item} />
          ))}
        </section>

        <section className="nav-section">
          <h2 className="nav-section-title">Components</h2>
          {navigation.components.map((item) => (
            <NavCategory key={item.id} item={item} />
          ))}
        </section>
      </div>
    </nav>
  );
}
