"use client";

/**
 * Branding Context
 *
 * Provides branding configuration throughout the docs app.
 * Values come from the edition config's branding section.
 */

import type {
  BrandingConfig,
  BrandingContextValue,
  Edition,
  RequiredFeatureConfig,
  UpgradeConfig,
} from "@ds/docs-core";
import { createContext, useContext, type ReactNode } from "react";

/**
 * Default feature values (all required)
 */
const DEFAULT_FEATURES: RequiredFeatureConfig = {
  search: true,
  darkMode: true,
  versionSwitcher: false,
  feedback: false,
  sourceLinks: true,
};

/**
 * Branding context with combined values
 */
const BrandingContext = createContext<BrandingContextValue | null>(null);

/**
 * Props for BrandingProvider
 */
export interface BrandingProviderProps {
  children: ReactNode;
  /** Branding configuration */
  branding?: BrandingConfig;
  /** Feature flags */
  features?: Partial<RequiredFeatureConfig>;
  /** Upgrade configuration */
  upgrade?: UpgradeConfig;
  /** Current edition ID */
  editionId?: string;
  /** Current edition name */
  editionName?: string;
  /** Current edition tier */
  edition?: Edition;
}

/**
 * Provider component for branding context
 */
export function BrandingProvider({
  children,
  branding,
  features,
  upgrade,
  editionId: _editionId = "default",
  editionName: _editionName = "Default",
  edition = "enterprise",
}: BrandingProviderProps) {
  // editionId and editionName are available for future use in the context
  void _editionId;
  void _editionName;
  const resolvedFeatures: RequiredFeatureConfig = {
    ...DEFAULT_FEATURES,
    ...features,
  };

  const value: BrandingContextValue = {
    name: branding?.name ?? "Design System",
    logo: branding?.logo ?? null,
    primaryColor: branding?.primaryColor ?? "#0066cc",
    features: resolvedFeatures,
    edition,
    upgrade: upgrade ?? null,
  };

  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>;
}

/**
 * Hook to access branding context
 */
export function useBranding(): BrandingContextValue {
  const context = useContext(BrandingContext);

  if (!context) {
    // Return defaults if used outside provider
    return {
      name: "Design System",
      logo: null,
      primaryColor: "#0066cc",
      features: DEFAULT_FEATURES,
      edition: "enterprise",
      upgrade: null,
    };
  }

  return context;
}

/**
 * Hook to access feature flags
 */
export function useFeatures(): RequiredFeatureConfig {
  const { features } = useBranding();
  return features;
}

/**
 * Hook to check if a feature is enabled
 */
export function useFeature(feature: keyof RequiredFeatureConfig): boolean {
  const features = useFeatures();
  return features[feature];
}
