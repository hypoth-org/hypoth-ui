"use client";

/**
 * Theme Context
 *
 * React context for theme state.
 *
 * @packageDocumentation
 */

import { createContext } from "react";
import type { ThemeContextValue } from "./types.js";

/**
 * Theme context
 *
 * Provides theme state to the component tree.
 * Use ThemeProvider to set up the context and useTheme to consume it.
 */
export const ThemeContext = createContext<ThemeContextValue | null>(null);

ThemeContext.displayName = "ThemeContext";
