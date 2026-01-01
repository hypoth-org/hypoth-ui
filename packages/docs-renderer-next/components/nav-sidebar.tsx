"use client";

import type { Edition, NavItem } from "@ds/docs-core";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavSidebarProps {
  /** Custom navigation items (optional, uses defaults if not provided) */
  navigation?: {
    components: NavItem[];
    guides: NavItem[];
  };
  /** Current edition for filtering */
  edition?: Edition;
  /** Edition map for checking component availability */
  editionMap?: {
    components: Record<string, { editions: Edition[]; status: string; name: string }>;
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

/**
 * Edition hierarchy for checking availability
 */
const EDITION_INCLUDES: Record<Edition, Edition[]> = {
  core: [],
  pro: ["core"],
  enterprise: ["core", "pro"],
};

/**
 * Check if a component is available for the current edition
 */
function isComponentAvailable(
  componentId: string,
  edition: Edition,
  editionMap?: NavSidebarProps["editionMap"]
): boolean {
  if (!editionMap) return true; // No filtering if no edition map

  const component = editionMap.components[componentId];
  if (!component) return true; // Unknown components are shown

  // Check if any of the component's editions are available
  const includedEditions = [edition, ...EDITION_INCLUDES[edition]];
  return component.editions.some((e) => includedEditions.includes(e));
}

interface NavLinkProps {
  item: NavItem;
  disabled?: boolean;
  requiredEdition?: Edition;
}

function NavLink({ item, disabled, requiredEdition }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  if (disabled) {
    return (
      <span className="nav-link nav-link--disabled" title={`Requires ${requiredEdition} edition`}>
        <span className="nav-link-label">{item.label}</span>
        <span className="nav-link-lock">🔒</span>
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      className={`nav-link ${isActive ? "nav-link--active" : ""}`}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="nav-link-label">{item.label}</span>
      {item.status && (
        <span className={`nav-link-status nav-link-status--${item.status}`}>{item.status}</span>
      )}
    </Link>
  );
}

interface NavCategoryProps {
  item: NavItem;
  edition?: Edition;
  editionMap?: NavSidebarProps["editionMap"];
}

function NavCategory({ item, edition, editionMap }: NavCategoryProps) {
  // Filter children by edition
  const visibleChildren = item.children?.filter((child) => {
    if (child.type !== "component") return true;
    if (!edition || !editionMap) return true;
    return isComponentAvailable(child.id, edition, editionMap);
  });

  // Get disabled children (for showing with lock icon)
  const disabledChildren = item.children?.filter((child) => {
    if (child.type !== "component") return false;
    if (!edition || !editionMap) return false;
    return !isComponentAvailable(child.id, edition, editionMap);
  });

  // Don't render empty categories
  if (!visibleChildren?.length && !disabledChildren?.length) {
    return null;
  }

  return (
    <div className="nav-category">
      <h3 className="nav-category-title">{item.label}</h3>
      <ul className="nav-category-list">
        {visibleChildren?.map((child) => (
          <li key={child.id}>
            <NavLink item={child} />
          </li>
        ))}
        {disabledChildren?.map((child) => {
          const component = editionMap?.components[child.id];
          const requiredEdition = component?.editions[0] as Edition | undefined;
          return (
            <li key={child.id}>
              <NavLink item={child} disabled requiredEdition={requiredEdition} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function NavSidebar({
  navigation = defaultNavigation,
  edition,
  editionMap,
}: NavSidebarProps) {
  return (
    <nav className="nav-sidebar" aria-label="Documentation navigation">
      <div className="nav-sidebar-header">
        <Link href="/" className="nav-sidebar-logo">
          Design System
        </Link>
        {edition && (
          <span className={`nav-sidebar-edition nav-sidebar-edition--${edition}`}>{edition}</span>
        )}
      </div>

      <div className="nav-sidebar-content">
        <section className="nav-section">
          <h2 className="nav-section-title">Guides</h2>
          {navigation.guides.map((item) => (
            <NavCategory key={item.id} item={item} edition={edition} editionMap={editionMap} />
          ))}
        </section>

        <section className="nav-section">
          <h2 className="nav-section-title">Components</h2>
          {navigation.components.map((item) => (
            <NavCategory key={item.id} item={item} edition={edition} editionMap={editionMap} />
          ))}
        </section>
      </div>

      <style jsx>{`
        .nav-link--disabled {
          opacity: 0.5;
          cursor: not-allowed;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-link-lock {
          font-size: 0.75rem;
        }
        .nav-sidebar-edition {
          font-size: 0.75rem;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          text-transform: capitalize;
          font-weight: 600;
        }
        .nav-sidebar-edition--core {
          background-color: #e0f2fe;
          color: #0369a1;
        }
        .nav-sidebar-edition--pro {
          background-color: #f0fdf4;
          color: #15803d;
        }
        .nav-sidebar-edition--enterprise {
          background-color: #faf5ff;
          color: #7e22ce;
        }
      `}</style>
    </nav>
  );
}
