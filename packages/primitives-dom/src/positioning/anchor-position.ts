/**
 * Anchor positioning utility for overlay components.
 *
 * Uses CSS anchor positioning API when supported, with JavaScript fallback
 * for browsers without support. Handles placement, flipping when near
 * viewport edges, and offset from anchor.
 *
 * @module positioning/anchor-position
 */

export type Placement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

export interface AnchorPositionOptions {
  /** The element to anchor to */
  anchor: HTMLElement;
  /** The floating element to position */
  floating: HTMLElement;
  /** Preferred placement relative to anchor */
  placement?: Placement;
  /** Offset distance from anchor in pixels */
  offset?: number;
  /** Whether to flip placement when near viewport edge */
  flip?: boolean;
  /** Callback when position updates */
  onPositionChange?: (position: ComputedPosition) => void;
}

export interface ComputedPosition {
  /** X coordinate relative to viewport */
  x: number;
  /** Y coordinate relative to viewport */
  y: number;
  /** Final placement after flip logic */
  placement: Placement;
}

export interface AnchorPosition {
  /** Update position (call on scroll/resize if needed) */
  update: () => ComputedPosition;
  /** Clean up any resources */
  destroy: () => void;
}

/** Check if CSS anchor positioning is supported */
function supportsAnchorPositioning(): boolean {
  if (typeof CSS === "undefined" || typeof CSS.supports !== "function") {
    return false;
  }
  return CSS.supports("anchor-name", "--anchor");
}

/** Parse placement into main axis and alignment */
function parsePlacement(placement: Placement): {
  side: "top" | "bottom" | "left" | "right";
  align: "start" | "center" | "end";
} {
  const parts = placement.split("-");
  const side = parts[0] as "top" | "bottom" | "left" | "right";
  const align = (parts[1] as "start" | "end" | undefined) ?? "center";
  return { side, align };
}

/** Get opposite side for flipping */
function getOppositeSide(
  side: "top" | "bottom" | "left" | "right"
): "top" | "bottom" | "left" | "right" {
  const opposites: Record<
    "top" | "bottom" | "left" | "right",
    "top" | "bottom" | "left" | "right"
  > = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  };
  return opposites[side];
}

/** Build placement string from parts */
function buildPlacement(
  side: "top" | "bottom" | "left" | "right",
  align: "start" | "center" | "end"
): Placement {
  if (align === "center") {
    return side as Placement;
  }
  return `${side}-${align}` as Placement;
}

/** Calculate position using JavaScript fallback */
function calculatePosition(
  anchor: HTMLElement,
  floating: HTMLElement,
  placement: Placement,
  offset: number,
  flip: boolean
): ComputedPosition {
  const anchorRect = anchor.getBoundingClientRect();
  const floatingRect = floating.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let { side, align } = parsePlacement(placement);
  let x = 0;
  let y = 0;

  // Calculate initial position based on side
  const calculateForSide = (
    currentSide: "top" | "bottom" | "left" | "right"
  ): { x: number; y: number } => {
    let posX = 0;
    let posY = 0;

    switch (currentSide) {
      case "top":
        posY = anchorRect.top - floatingRect.height - offset;
        break;
      case "bottom":
        posY = anchorRect.bottom + offset;
        break;
      case "left":
        posX = anchorRect.left - floatingRect.width - offset;
        break;
      case "right":
        posX = anchorRect.right + offset;
        break;
    }

    // Calculate alignment for horizontal sides (top/bottom)
    if (currentSide === "top" || currentSide === "bottom") {
      switch (align) {
        case "start":
          posX = anchorRect.left;
          break;
        case "end":
          posX = anchorRect.right - floatingRect.width;
          break;
        default:
          posX = anchorRect.left + (anchorRect.width - floatingRect.width) / 2;
          break;
      }
    }

    // Calculate alignment for vertical sides (left/right)
    if (currentSide === "left" || currentSide === "right") {
      switch (align) {
        case "start":
          posY = anchorRect.top;
          break;
        case "end":
          posY = anchorRect.bottom - floatingRect.height;
          break;
        default:
          posY = anchorRect.top + (anchorRect.height - floatingRect.height) / 2;
          break;
      }
    }

    return { x: posX, y: posY };
  };

  const pos = calculateForSide(side);
  x = pos.x;
  y = pos.y;

  // Flip logic if enabled
  if (flip) {
    let needsFlip = false;

    switch (side) {
      case "top":
        needsFlip = y < 0;
        break;
      case "bottom":
        needsFlip = y + floatingRect.height > viewportHeight;
        break;
      case "left":
        needsFlip = x < 0;
        break;
      case "right":
        needsFlip = x + floatingRect.width > viewportWidth;
        break;
    }

    if (needsFlip) {
      const oppositeSide = getOppositeSide(side);
      const oppositePos = calculateForSide(oppositeSide);

      // Check if flipped position is better
      let flippedIsBetter = false;
      switch (oppositeSide) {
        case "top":
          flippedIsBetter = oppositePos.y >= 0 || oppositePos.y > y;
          break;
        case "bottom":
          flippedIsBetter =
            oppositePos.y + floatingRect.height <= viewportHeight ||
            viewportHeight - (oppositePos.y + floatingRect.height) > -y;
          break;
        case "left":
          flippedIsBetter = oppositePos.x >= 0 || oppositePos.x > x;
          break;
        case "right":
          flippedIsBetter =
            oppositePos.x + floatingRect.width <= viewportWidth ||
            viewportWidth - (oppositePos.x + floatingRect.width) > -x;
          break;
      }

      if (flippedIsBetter) {
        side = oppositeSide;
        x = oppositePos.x;
        y = oppositePos.y;
      }
    }
  }

  // Clamp to viewport bounds
  x = Math.max(0, Math.min(x, viewportWidth - floatingRect.width));
  y = Math.max(0, Math.min(y, viewportHeight - floatingRect.height));

  return {
    x,
    y,
    placement: buildPlacement(side, align),
  };
}

/** Apply CSS anchor positioning styles */
function applyCSSAnchorPositioning(
  anchor: HTMLElement,
  floating: HTMLElement,
  placement: Placement,
  offset: number
): void {
  const anchorName = `--anchor-${Math.random().toString(36).slice(2, 9)}`;
  const { side, align } = parsePlacement(placement);

  // Set anchor name on anchor element
  anchor.style.setProperty("anchor-name", anchorName);

  // Position floating element
  floating.style.position = "fixed";
  floating.style.setProperty("position-anchor", anchorName);

  // Set position based on side
  const alignValue = align === "center" ? "center" : align === "start" ? "start" : "end";

  switch (side) {
    case "top":
      floating.style.bottom = `calc(anchor(top) + ${offset}px)`;
      floating.style.left = `anchor(${alignValue})`;
      break;
    case "bottom":
      floating.style.top = `calc(anchor(bottom) + ${offset}px)`;
      floating.style.left = `anchor(${alignValue})`;
      break;
    case "left":
      floating.style.right = `calc(anchor(left) + ${offset}px)`;
      floating.style.top = `anchor(${alignValue})`;
      break;
    case "right":
      floating.style.left = `calc(anchor(right) + ${offset}px)`;
      floating.style.top = `anchor(${alignValue})`;
      break;
  }
}

/** Apply JavaScript fallback positioning */
function applyJSPositioning(floating: HTMLElement, position: ComputedPosition): void {
  floating.style.position = "fixed";
  floating.style.left = `${position.x}px`;
  floating.style.top = `${position.y}px`;
  floating.style.transform = "none";
}

/**
 * Create an anchor position manager for positioning a floating element
 * relative to an anchor element.
 *
 * Uses CSS anchor positioning API when supported, with JavaScript fallback.
 *
 * @param options - Configuration options
 * @returns AnchorPosition controller
 *
 * @example
 * ```typescript
 * const position = createAnchorPosition({
 *   anchor: triggerButton,
 *   floating: popoverContent,
 *   placement: 'bottom-start',
 *   offset: 8,
 *   flip: true,
 * });
 *
 * // Update on scroll/resize if needed
 * window.addEventListener('scroll', () => position.update());
 *
 * // Clean up when done
 * position.destroy();
 * ```
 */
export function createAnchorPosition(options: AnchorPositionOptions): AnchorPosition {
  const {
    anchor,
    floating,
    placement = "bottom",
    offset = 8,
    flip = true,
    onPositionChange,
  } = options;

  const useCSS = supportsAnchorPositioning();
  let currentPosition: ComputedPosition = { x: 0, y: 0, placement };

  const update = (): ComputedPosition => {
    if (useCSS) {
      // CSS anchor positioning handles updates automatically
      // Just return the intended placement
      applyCSSAnchorPositioning(anchor, floating, placement, offset);
      currentPosition = { x: 0, y: 0, placement };
    } else {
      // JavaScript fallback
      currentPosition = calculatePosition(anchor, floating, placement, offset, flip);
      applyJSPositioning(floating, currentPosition);
    }

    onPositionChange?.(currentPosition);
    return currentPosition;
  };

  const destroy = (): void => {
    // Clean up styles
    if (useCSS) {
      anchor.style.removeProperty("anchor-name");
      floating.style.removeProperty("position-anchor");
    }
    floating.style.removeProperty("position");
    floating.style.removeProperty("left");
    floating.style.removeProperty("top");
    floating.style.removeProperty("right");
    floating.style.removeProperty("bottom");
    floating.style.removeProperty("transform");
  };

  // Initial positioning
  update();

  return {
    update,
    destroy,
  };
}
