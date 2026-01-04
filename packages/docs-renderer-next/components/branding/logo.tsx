"use client";

/**
 * Logo Component
 *
 * Displays the branding logo or falls back to text-based name.
 */

import { useBranding } from "../../lib/branding-context";
import { useState } from "react";

export interface LogoProps {
  /** Custom class name */
  className?: string;
  /** Logo size variant */
  size?: "small" | "medium" | "large";
  /** Whether to show text alongside logo */
  showText?: boolean;
}

export function Logo({ className = "", size = "medium", showText = false }: LogoProps) {
  const { name, logo, primaryColor } = useBranding();
  const [imageError, setImageError] = useState(false);

  const sizeClasses: Record<string, string> = {
    small: "logo--small",
    medium: "logo--medium",
    large: "logo--large",
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // If logo URL provided and no error, show image
  if (logo && !imageError) {
    return (
      <span className={`logo ${sizeClasses[size]} ${className}`}>
        <img
          src={logo}
          alt={name}
          className="logo__image"
          onError={handleImageError}
        />
        {showText && <span className="logo__text">{name}</span>}
      </span>
    );
  }

  // Fallback to text-based logo
  return (
    <span className={`logo logo--text ${sizeClasses[size]} ${className}`}>
      <span
        className="logo__initial"
        style={{ backgroundColor: primaryColor }}
      >
        {name.charAt(0).toUpperCase()}
      </span>
      <span className="logo__text">{name}</span>
    </span>
  );
}
