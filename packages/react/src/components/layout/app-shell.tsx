/**
 * AppShell React Component
 *
 * Application structure with compound component pattern.
 */

import type React from "react";
import { createElement, forwardRef } from "react";

type SidebarPosition = "left" | "right" | "none";

// ============================================
// AppShell Root
// ============================================

export interface AppShellProps {
  /** Sidebar position. */
  sidebarPosition?: SidebarPosition;
  /** Additional CSS class names. */
  className?: string;
  /** Children elements. */
  children?: React.ReactNode;
}

const AppShellRoot = forwardRef<HTMLElement, AppShellProps>((props, ref) => {
  const { sidebarPosition = "none", className, children, ...rest } = props;

  return createElement(
    "ds-app-shell",
    {
      ref,
      "sidebar-position": sidebarPosition,
      class: className,
      ...rest,
    },
    children
  );
});

AppShellRoot.displayName = "AppShell";

// ============================================
// Header Sub-component
// ============================================

export interface HeaderProps {
  /** Enable sticky positioning. */
  sticky?: boolean;
  /** Enable safe area insets. */
  safeArea?: boolean;
  /** Additional CSS class names. */
  className?: string;
  /** Children elements. */
  children?: React.ReactNode;
}

const Header = forwardRef<HTMLElement, HeaderProps>((props, ref) => {
  const { sticky = false, safeArea = false, className, children, ...rest } = props;

  return createElement(
    "ds-header",
    {
      ref,
      slot: "header",
      sticky: sticky || undefined,
      "safe-area": safeArea || undefined,
      class: className,
      ...rest,
    },
    children
  );
});

Header.displayName = "AppShell.Header";

// ============================================
// Footer Sub-component
// ============================================

export interface FooterProps {
  /** Enable sticky positioning. */
  sticky?: boolean;
  /** Enable safe area insets. */
  safeArea?: boolean;
  /** Additional CSS class names. */
  className?: string;
  /** Children elements. */
  children?: React.ReactNode;
}

const Footer = forwardRef<HTMLElement, FooterProps>((props, ref) => {
  const { sticky = false, safeArea = false, className, children, ...rest } = props;

  return createElement(
    "ds-footer",
    {
      ref,
      slot: "footer",
      sticky: sticky || undefined,
      "safe-area": safeArea || undefined,
      class: className,
      ...rest,
    },
    children
  );
});

Footer.displayName = "AppShell.Footer";

// ============================================
// Main Sub-component
// ============================================

export interface MainProps {
  /** Element ID for skip-link targeting. */
  id?: string;
  /** Additional CSS class names. */
  className?: string;
  /** Children elements. */
  children?: React.ReactNode;
}

const Main = forwardRef<HTMLElement, MainProps>((props, ref) => {
  const { id = "main-content", className, children, ...rest } = props;

  return createElement(
    "ds-main",
    {
      ref,
      id,
      class: className,
      ...rest,
    },
    children
  );
});

Main.displayName = "AppShell.Main";

// ============================================
// Sidebar Sub-component
// ============================================

export interface SidebarProps {
  /** Additional CSS class names. */
  className?: string;
  /** Children elements. */
  children?: React.ReactNode;
}

const Sidebar = forwardRef<HTMLElement, SidebarProps>((props, ref) => {
  const { className, children, ...rest } = props;

  return createElement(
    "aside",
    {
      ref,
      slot: "sidebar",
      class: `ds-sidebar ${className || ""}`.trim(),
      ...rest,
    },
    children
  );
});

Sidebar.displayName = "AppShell.Sidebar";

// ============================================
// Compound Component Export
// ============================================

export const AppShell = Object.assign(AppShellRoot, {
  Header,
  Footer,
  Main,
  Sidebar,
});
