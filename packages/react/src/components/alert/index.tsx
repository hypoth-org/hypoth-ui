"use client";

/**
 * Alert React Component
 *
 * Contextual feedback messages for user notifications.
 */

import {
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useCallback,
} from "react";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Visual variant */
  variant?: AlertVariant;
  /** Alert title */
  title?: string;
  /** Whether the alert can be closed */
  closable?: boolean;
  /** Hide the default icon */
  hideIcon?: boolean;
  /** Custom icon element */
  icon?: ReactNode;
  /** Action slot content */
  action?: ReactNode;
  /** Callback when close button is clicked */
  onClose?: () => void;
  /** Alert content/description */
  children?: ReactNode;
}

/**
 * SVG icons for different alert variants
 */
const VARIANT_ICONS: Record<AlertVariant, ReactNode> = {
  info: (
    <svg className="ds-alert__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
    </svg>
  ),
  success: (
    <svg className="ds-alert__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  ),
  warning: (
    <svg className="ds-alert__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  ),
  error: (
    <svg className="ds-alert__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
    </svg>
  ),
};

const CLOSE_ICON = (
  <svg className="ds-alert__close-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
  </svg>
);

/**
 * Get the ARIA role based on variant.
 */
function getRole(variant: AlertVariant): "alert" | "status" {
  return variant === "error" || variant === "warning" ? "alert" : "status";
}

/**
 * Alert component for contextual feedback messages.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Alert variant="success" title="Success">
 *   Your changes have been saved.
 * </Alert>
 *
 * // Closable alert
 * <Alert variant="error" title="Error" closable onClose={() => setShowAlert(false)}>
 *   An error occurred while saving.
 * </Alert>
 *
 * // With action
 * <Alert variant="warning" title="Warning" action={<Button size="sm">Undo</Button>}>
 *   This action cannot be reversed.
 * </Alert>
 * ```
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = "info",
      title,
      closable = false,
      hideIcon = false,
      icon,
      action,
      onClose,
      children,
      className,
      ...restProps
    },
    ref
  ) => {
    const role = getRole(variant);

    const handleClose = useCallback(() => {
      onClose?.();
    }, [onClose]);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === "Escape" && closable) {
          handleClose();
        }
      },
      [closable, handleClose]
    );

    const alertClassName = [
      "ds-alert",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={alertClassName}
        role={role}
        aria-live={role === "alert" ? "assertive" : "polite"}
        data-variant={variant}
        data-closable={closable || undefined}
        onKeyDown={handleKeyDown}
        {...restProps}
      >
        {!hideIcon && (icon || VARIANT_ICONS[variant])}

        <div className="ds-alert__content">
          {title && <p className="ds-alert__title">{title}</p>}

          <div className="ds-alert__description">{children}</div>

          {action && <div className="ds-alert__action">{action}</div>}
        </div>

        {closable && (
          <button
            className="ds-alert__close"
            type="button"
            aria-label="Dismiss alert"
            onClick={handleClose}
          >
            {CLOSE_ICON}
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";
