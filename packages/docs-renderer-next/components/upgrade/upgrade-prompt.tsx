/**
 * Upgrade Prompt Component
 *
 * Displays a call-to-action for users to upgrade their edition tier
 * to access premium content and features.
 */

import type { Edition, UpgradeConfig } from "@ds/docs-core";

export interface UpgradePromptProps {
  /** Current user edition */
  currentEdition: Edition;
  /** Required edition for access */
  requiredEdition: Edition;
  /** Upgrade configuration from edition config */
  upgradeConfig?: UpgradeConfig;
  /** Component or feature name being blocked */
  itemName?: string;
  /** Component ID (for URL params) */
  componentId?: string;
  /** Visual variant */
  variant?: "inline" | "full-page" | "card";
}

/**
 * Default upgrade configuration
 */
const DEFAULT_UPGRADE_CONFIG: UpgradeConfig = {
  url: "/upgrade",
  ctaText: "Upgrade Now",
  message: "Upgrade your plan to access this content.",
};

/**
 * Edition display names
 */
const EDITION_NAMES: Record<Edition, string> = {
  core: "Core",
  pro: "Pro",
  enterprise: "Enterprise",
};

/**
 * Edition tier descriptions
 */
const EDITION_DESCRIPTIONS: Record<Edition, string> = {
  core: "Basic components for getting started",
  pro: "Advanced features and additional components",
  enterprise: "Full access to all components and features",
};

export function UpgradePrompt({
  currentEdition,
  requiredEdition,
  upgradeConfig = DEFAULT_UPGRADE_CONFIG,
  itemName,
  componentId,
  variant = "card",
}: UpgradePromptProps) {
  const config = { ...DEFAULT_UPGRADE_CONFIG, ...upgradeConfig };

  // Build upgrade URL with optional component parameter
  const upgradeUrl = componentId
    ? `${config.url}?component=${componentId}&from=${currentEdition}&to=${requiredEdition}`
    : `${config.url}?from=${currentEdition}&to=${requiredEdition}`;

  const message = config.message || DEFAULT_UPGRADE_CONFIG.message;

  if (variant === "inline") {
    return (
      <span className="upgrade-prompt upgrade-prompt--inline">
        <span className="upgrade-prompt__icon" aria-hidden="true">
          🔒
        </span>
        <span className="upgrade-prompt__text">
          {itemName ? `${itemName} requires ` : "Requires "}
          <strong>{EDITION_NAMES[requiredEdition]}</strong> edition.{" "}
          <a href={upgradeUrl} className="upgrade-prompt__link">
            {config.ctaText}
          </a>
        </span>
      </span>
    );
  }

  if (variant === "full-page") {
    return (
      <div className="upgrade-prompt upgrade-prompt--full-page">
        <div className="upgrade-prompt__container">
          <div className="upgrade-prompt__icon" aria-hidden="true">
            🔒
          </div>
          <h1 className="upgrade-prompt__title">
            {itemName ? `${itemName} requires an upgrade` : "Upgrade Required"}
          </h1>
          <p className="upgrade-prompt__message">{message}</p>
          <div className="upgrade-prompt__tiers">
            <div className="upgrade-prompt__tier upgrade-prompt__tier--current">
              <h2>Current: {EDITION_NAMES[currentEdition]}</h2>
              <p>{EDITION_DESCRIPTIONS[currentEdition]}</p>
            </div>
            <div className="upgrade-prompt__arrow" aria-hidden="true">
              →
            </div>
            <div className="upgrade-prompt__tier upgrade-prompt__tier--required">
              <h2>Required: {EDITION_NAMES[requiredEdition]}</h2>
              <p>{EDITION_DESCRIPTIONS[requiredEdition]}</p>
            </div>
          </div>
          <a href={upgradeUrl} className="upgrade-prompt__cta">
            {config.ctaText}
          </a>
        </div>
      </div>
    );
  }

  // Default: card variant
  return (
    <div className="upgrade-prompt upgrade-prompt--card">
      <div className="upgrade-prompt__header">
        <span className="upgrade-prompt__icon" aria-hidden="true">
          🔒
        </span>
        <span className="upgrade-prompt__badge">{EDITION_NAMES[requiredEdition]} Edition</span>
      </div>
      <div className="upgrade-prompt__body">
        <h3 className="upgrade-prompt__title">
          {itemName ? `${itemName} requires an upgrade` : "Premium Content"}
        </h3>
        <p className="upgrade-prompt__message">{message}</p>
      </div>
      <div className="upgrade-prompt__footer">
        <span className="upgrade-prompt__current">Your plan: {EDITION_NAMES[currentEdition]}</span>
        <a href={upgradeUrl} className="upgrade-prompt__cta">
          {config.ctaText}
        </a>
      </div>
    </div>
  );
}
