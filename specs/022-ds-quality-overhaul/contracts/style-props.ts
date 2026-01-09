/**
 * Style Props Type Definitions
 *
 * Feature: 022-ds-quality-overhaul
 * This contract defines the style props API for React primitive components.
 *
 * @deprecated NOT IMPLEMENTED - React adapters are kept minimal.
 * Consumers should use standard React patterns (className, style) with
 * CSS custom properties from the token system. This file is preserved
 * for reference only.
 */

// =============================================================================
// Token References
// =============================================================================

/**
 * Spacing scale values (maps to --ds-spacing-{n})
 * Values represent the token key, not pixel values.
 * Extended scale for larger layouts (14-96).
 */
export type SpacingValue =
  | 0
  | 0.5
  | 1
  | 1.5
  | 2
  | 2.5
  | 3
  | 3.5
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 14
  | 16
  | 20
  | 24
  | 28
  | 32
  | 36
  | 40
  | 44
  | 48
  | 52
  | 56
  | 60
  | 64
  | 72
  | 80
  | 96
  | "auto";

/**
 * Negative spacing for negative margins
 */
export type NegativeSpacingValue =
  | -0.5
  | -1
  | -1.5
  | -2
  | -2.5
  | -3
  | -3.5
  | -4
  | -5
  | -6
  | -7
  | -8
  | -9
  | -10
  | -11
  | -12
  | -14
  | -16
  | -20
  | -24
  | -28
  | -32
  | -36
  | -40
  | -44
  | -48
  | -52
  | -56
  | -60
  | -64
  | -72
  | -80
  | -96;

/**
 * Primitive color names (raw palette)
 */
export type PrimitiveColor =
  | "gray"
  | "slate"
  | "zinc"
  | "stone"
  | "blue"
  | "sky"
  | "cyan"
  | "teal"
  | "green"
  | "emerald"
  | "lime"
  | "yellow"
  | "amber"
  | "orange"
  | "red"
  | "rose"
  | "pink"
  | "fuchsia"
  | "purple"
  | "violet"
  | "indigo";

/**
 * Semantic color names (mapped from primitives)
 */
export type SemanticColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "neutral";

/**
 * 16-step color scale (1 = lightest, 16 = darkest)
 *
 * Steps 1-4:   Backgrounds (page, card, nested, deep)
 * Steps 5-7:   Interactive backgrounds (normal, hover, active)
 * Steps 8-10:  Borders (subtle, default, strong)
 * Steps 11-14: Solid colors (normal, hover, active, emphasis)
 * Steps 15-16: Text (muted, default)
 */
export type ColorStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;

/**
 * Color token paths
 * Examples: "primary.11", "blue.5", "error.default"
 */
export type ColorValue =
  | `${SemanticColor}.${ColorStep}`
  | `${PrimitiveColor}.${ColorStep}`
  | `${SemanticColor}.${"default" | "hover" | "active" | "foreground" | "subtle" | "muted"}`
  | "transparent"
  | "currentColor"
  | "inherit";

/**
 * Typography scale values
 */
export type FontSizeValue =
  | "2xs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl";

/**
 * Font weight values (maps to numeric weights)
 * thin=100, extralight=200, light=300, normal=400, medium=500,
 * semibold=600, bold=700, extrabold=800, black=900
 */
export type FontWeightValue =
  | "thin"
  | "extralight"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";

export type LineHeightValue =
  | "none"
  | "tight"
  | "snug"
  | "normal"
  | "relaxed"
  | "loose"
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10;

/**
 * Font family values
 */
export type FontFamilyValue = "sans" | "serif" | "mono";

/**
 * Letter spacing values
 */
export type LetterSpacingValue =
  | "tighter"
  | "tight"
  | "normal"
  | "wide"
  | "wider"
  | "widest";

/**
 * Font style values
 */
export type FontStyleValue = "normal" | "italic";

/**
 * White space values
 */
export type WhiteSpaceValue =
  | "normal"
  | "nowrap"
  | "pre"
  | "pre-line"
  | "pre-wrap"
  | "break-spaces";

/**
 * Word break values
 */
export type WordBreakValue = "normal" | "break-all" | "keep-all" | "break-word";

// =============================================================================
// Responsive System
// =============================================================================

/**
 * Breakpoint keys matching CSS media queries
 */
export type Breakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";

/**
 * Breakpoint pixel values
 */
export const BreakpointValues: Record<Exclude<Breakpoint, "base">, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

/**
 * Responsive value wrapper
 * Can be a single value or an object with breakpoint keys
 *
 * @example
 * // Single value
 * px={4}
 *
 * // Responsive object
 * px={{ base: 2, md: 4, lg: 8 }}
 */
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

// =============================================================================
// Sizing Values
// =============================================================================

/**
 * Fractional width/height values
 */
export type FractionalValue =
  | "1/2"
  | "1/3"
  | "2/3"
  | "1/4"
  | "2/4"
  | "3/4"
  | "1/5"
  | "2/5"
  | "3/5"
  | "4/5"
  | "1/6"
  | "2/6"
  | "3/6"
  | "4/6"
  | "5/6"
  | "1/12"
  | "2/12"
  | "3/12"
  | "4/12"
  | "5/12"
  | "6/12"
  | "7/12"
  | "8/12"
  | "9/12"
  | "10/12"
  | "11/12";

/**
 * Container max-width values
 */
export type ContainerValue =
  | "xs"    // 20rem (320px)
  | "sm"    // 24rem (384px)
  | "md"    // 28rem (448px)
  | "lg"    // 32rem (512px)
  | "xl"    // 36rem (576px)
  | "2xl"   // 42rem (672px)
  | "3xl"   // 48rem (768px)
  | "4xl"   // 56rem (896px)
  | "5xl"   // 64rem (1024px)
  | "6xl"   // 72rem (1152px)
  | "7xl"   // 80rem (1280px)
  | "full"  // 100%
  | "prose" // 65ch
  | "none";

/**
 * Aspect ratio values
 */
export type AspectRatioValue =
  | "auto"
  | "square"    // 1/1
  | "video"     // 16/9
  | "portrait"  // 3/4
  | "wide"      // 21/9
  | "4/3"
  | "3/2";

// =============================================================================
// Visual Effect Values
// =============================================================================

/**
 * Box shadow values
 */
export type ShadowValue =
  | "none"
  | "2xs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "inner";

/**
 * Opacity values (percentage)
 */
export type OpacityValue =
  | 0
  | 5
  | 10
  | 15
  | 20
  | 25
  | 30
  | 35
  | 40
  | 45
  | 50
  | 55
  | 60
  | 65
  | 70
  | 75
  | 80
  | 85
  | 90
  | 95
  | 100;

/**
 * Cursor values
 */
export type CursorValue =
  | "auto"
  | "default"
  | "pointer"
  | "wait"
  | "text"
  | "move"
  | "help"
  | "not-allowed"
  | "none"
  | "context-menu"
  | "progress"
  | "cell"
  | "crosshair"
  | "vertical-text"
  | "alias"
  | "copy"
  | "no-drop"
  | "grab"
  | "grabbing"
  | "all-scroll"
  | "col-resize"
  | "row-resize"
  | "n-resize"
  | "e-resize"
  | "s-resize"
  | "w-resize"
  | "ne-resize"
  | "nw-resize"
  | "se-resize"
  | "sw-resize"
  | "ew-resize"
  | "ns-resize"
  | "nesw-resize"
  | "nwse-resize"
  | "zoom-in"
  | "zoom-out";

/**
 * Pointer events values
 */
export type PointerEventsValue = "auto" | "none";

/**
 * User select values
 */
export type UserSelectValue = "auto" | "none" | "text" | "all";

/**
 * Visibility values
 */
export type VisibilityValue = "visible" | "hidden" | "collapse";

// =============================================================================
// Border Values
// =============================================================================

/**
 * Border radius values
 */
export type BorderRadiusValue =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "full";

/**
 * Border style values
 */
export type BorderStyleValue =
  | "none"
  | "solid"
  | "dashed"
  | "dotted"
  | "double"
  | "hidden";

/**
 * Border width values
 */
export type BorderWidthValue = 0 | 1 | 2 | 4 | 8;

/**
 * Outline offset values
 */
export type OutlineOffsetValue = 0 | 1 | 2 | 4 | 8;

/**
 * Ring (focus ring) width values
 */
export type RingWidthValue = 0 | 1 | 2 | 4 | 8 | "inset";

// =============================================================================
// Transform Values
// =============================================================================

/**
 * Rotate values (degrees)
 */
export type RotateValue =
  | 0
  | 1
  | 2
  | 3
  | 6
  | 12
  | 45
  | 90
  | 180
  | -1
  | -2
  | -3
  | -6
  | -12
  | -45
  | -90
  | -180;

/**
 * Scale values (percentage as decimal * 100)
 */
export type ScaleValue =
  | 0
  | 50
  | 75
  | 90
  | 95
  | 100
  | 105
  | 110
  | 125
  | 150
  | 200;

/**
 * Translate values (reuses spacing scale)
 */
export type TranslateValue = SpacingValue | NegativeSpacingValue | FractionalValue | "full";

/**
 * Skew values (degrees)
 */
export type SkewValue = 0 | 1 | 2 | 3 | 6 | 12 | -1 | -2 | -3 | -6 | -12;

/**
 * Transform origin values
 */
export type TransformOriginValue =
  | "center"
  | "top"
  | "top-right"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left"
  | "top-left";

// =============================================================================
// Filter Values
// =============================================================================

/**
 * Blur values
 */
export type BlurValue =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl";

/**
 * Brightness values (percentage)
 */
export type BrightnessValue = 0 | 50 | 75 | 90 | 95 | 100 | 105 | 110 | 125 | 150 | 200;

/**
 * Contrast values (percentage)
 */
export type ContrastValue = 0 | 50 | 75 | 100 | 125 | 150 | 200;

/**
 * Grayscale values
 */
export type GrayscaleValue = 0 | 100;

/**
 * Saturate values (percentage)
 */
export type SaturateValue = 0 | 50 | 100 | 150 | 200;

// =============================================================================
// Flexbox/Grid Child Values
// =============================================================================

/**
 * Flex shorthand values
 */
export type FlexValue = 1 | "auto" | "initial" | "none";

/**
 * Flex grow values
 */
export type FlexGrowValue = 0 | 1;

/**
 * Flex shrink values
 */
export type FlexShrinkValue = 0 | 1;

/**
 * Flex basis values
 */
export type FlexBasisValue = SpacingValue | FractionalValue | "auto" | "full" | "0";

/**
 * Order values
 */
export type OrderValue =
  | "first"
  | "last"
  | "none"
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | -1;

/**
 * Align self values
 */
export type AlignSelfValue =
  | "auto"
  | "start"
  | "end"
  | "center"
  | "stretch"
  | "baseline";

/**
 * Justify self values
 */
export type JustifySelfValue =
  | "auto"
  | "start"
  | "end"
  | "center"
  | "stretch";

/**
 * Grid span values
 */
export type GridSpanValue =
  | "auto"
  | "full"
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12;

/**
 * Grid start/end values
 */
export type GridLineValue =
  | "auto"
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13;

// =============================================================================
// Other Values
// =============================================================================

/**
 * Object fit values
 */
export type ObjectFitValue =
  | "contain"
  | "cover"
  | "fill"
  | "none"
  | "scale-down";

/**
 * Object position values
 */
export type ObjectPositionValue =
  | "center"
  | "top"
  | "top-right"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left"
  | "top-left";

/**
 * Isolation values
 */
export type IsolationValue = "auto" | "isolate";

/**
 * Mix blend mode values
 */
export type MixBlendModeValue =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity"
  | "plus-lighter";

/**
 * Background blend mode values
 */
export type BgBlendModeValue = MixBlendModeValue;

/**
 * Background size values
 */
export type BgSizeValue = "auto" | "cover" | "contain";

/**
 * Background position values
 */
export type BgPositionValue =
  | "center"
  | "top"
  | "top-right"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left"
  | "top-left";

/**
 * Background repeat values
 */
export type BgRepeatValue =
  | "repeat"
  | "no-repeat"
  | "repeat-x"
  | "repeat-y"
  | "round"
  | "space";

/**
 * Background attachment values
 */
export type BgAttachmentValue = "fixed" | "local" | "scroll";

/**
 * Transition values (maps to predefined transitions)
 */
export type TransitionValue =
  | "none"
  | "all"
  | "colors"
  | "opacity"
  | "shadow"
  | "transform";

/**
 * Transition duration values (ms)
 */
export type TransitionDurationValue =
  | 0
  | 75
  | 100
  | 150
  | 200
  | 300
  | 500
  | 700
  | 1000;

/**
 * Transition timing function values
 */
export type TransitionTimingValue =
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out";

// =============================================================================
// Style Props Interface
// =============================================================================

/**
 * Common style props available on primitive components (Box, Flex, Grid, Text)
 */
export interface StyleProps {
  // ---------------------------------------------------------------------------
  // Margin (supports negative values)
  // ---------------------------------------------------------------------------
  /** Margin on all sides */
  m?: Responsive<SpacingValue | NegativeSpacingValue>;
  /** Margin top */
  mt?: Responsive<SpacingValue | NegativeSpacingValue>;
  /** Margin right */
  mr?: Responsive<SpacingValue | NegativeSpacingValue>;
  /** Margin bottom */
  mb?: Responsive<SpacingValue | NegativeSpacingValue>;
  /** Margin left */
  ml?: Responsive<SpacingValue | NegativeSpacingValue>;
  /** Margin left and right */
  mx?: Responsive<SpacingValue | NegativeSpacingValue>;
  /** Margin top and bottom */
  my?: Responsive<SpacingValue | NegativeSpacingValue>;

  // ---------------------------------------------------------------------------
  // Padding
  // ---------------------------------------------------------------------------
  /** Padding on all sides */
  p?: Responsive<SpacingValue>;
  /** Padding top */
  pt?: Responsive<SpacingValue>;
  /** Padding right */
  pr?: Responsive<SpacingValue>;
  /** Padding bottom */
  pb?: Responsive<SpacingValue>;
  /** Padding left */
  pl?: Responsive<SpacingValue>;
  /** Padding left and right */
  px?: Responsive<SpacingValue>;
  /** Padding top and bottom */
  py?: Responsive<SpacingValue>;

  // ---------------------------------------------------------------------------
  // Gap (Flex/Grid)
  // ---------------------------------------------------------------------------
  /** Gap between children */
  gap?: Responsive<SpacingValue>;
  /** Row gap */
  rowGap?: Responsive<SpacingValue>;
  /** Column gap */
  columnGap?: Responsive<SpacingValue>;

  // ---------------------------------------------------------------------------
  // Colors
  // ---------------------------------------------------------------------------
  /** Background color */
  bg?: Responsive<ColorValue>;
  /** Text color */
  color?: Responsive<ColorValue>;
  /** Border color */
  borderColor?: Responsive<ColorValue>;
  /** Border top color */
  borderTopColor?: Responsive<ColorValue>;
  /** Border right color */
  borderRightColor?: Responsive<ColorValue>;
  /** Border bottom color */
  borderBottomColor?: Responsive<ColorValue>;
  /** Border left color */
  borderLeftColor?: Responsive<ColorValue>;
  /** Outline color */
  outlineColor?: Responsive<ColorValue>;
  /** Ring (focus ring) color */
  ringColor?: Responsive<ColorValue>;
  /** Caret color (text cursor) */
  caretColor?: Responsive<ColorValue>;
  /** Accent color (checkboxes, radios) */
  accentColor?: Responsive<ColorValue>;

  // ---------------------------------------------------------------------------
  // Typography
  // ---------------------------------------------------------------------------
  /** Font size */
  fontSize?: Responsive<FontSizeValue>;
  /** Font weight */
  fontWeight?: Responsive<FontWeightValue>;
  /** Font family */
  fontFamily?: Responsive<FontFamilyValue>;
  /** Font style (normal, italic) */
  fontStyle?: Responsive<FontStyleValue>;
  /** Line height */
  lineHeight?: Responsive<LineHeightValue>;
  /** Letter spacing */
  letterSpacing?: Responsive<LetterSpacingValue>;
  /** Text alignment */
  textAlign?: Responsive<"left" | "center" | "right" | "justify" | "start" | "end">;
  /** White space handling */
  whiteSpace?: Responsive<WhiteSpaceValue>;
  /** Word break behavior */
  wordBreak?: Responsive<WordBreakValue>;

  // ---------------------------------------------------------------------------
  // Layout
  // ---------------------------------------------------------------------------
  /** Display mode */
  display?: Responsive<
    | "block"
    | "inline"
    | "inline-block"
    | "flex"
    | "inline-flex"
    | "grid"
    | "inline-grid"
    | "contents"
    | "flow-root"
    | "none"
  >;
  /** Position mode */
  position?: Responsive<"static" | "relative" | "absolute" | "fixed" | "sticky">;
  /** Overflow behavior */
  overflow?: Responsive<"visible" | "hidden" | "scroll" | "auto" | "clip">;
  /** Overflow X behavior */
  overflowX?: Responsive<"visible" | "hidden" | "scroll" | "auto" | "clip">;
  /** Overflow Y behavior */
  overflowY?: Responsive<"visible" | "hidden" | "scroll" | "auto" | "clip">;
  /** Visibility */
  visibility?: Responsive<VisibilityValue>;
  /** Isolation */
  isolation?: Responsive<IsolationValue>;

  // ---------------------------------------------------------------------------
  // Sizing
  // ---------------------------------------------------------------------------
  /** Width */
  w?: Responsive<SpacingValue | FractionalValue | "full" | "screen" | "auto" | "fit" | "min" | "max">;
  /** Height */
  h?: Responsive<SpacingValue | FractionalValue | "full" | "screen" | "auto" | "fit" | "min" | "max">;
  /** Minimum width */
  minW?: Responsive<SpacingValue | "full" | "screen" | "min" | "max" | "fit" | 0>;
  /** Maximum width */
  maxW?: Responsive<SpacingValue | ContainerValue>;
  /** Minimum height */
  minH?: Responsive<SpacingValue | "full" | "screen" | "min" | "max" | "fit" | 0>;
  /** Maximum height */
  maxH?: Responsive<SpacingValue | "full" | "screen" | "min" | "max" | "fit" | "none">;
  /** Aspect ratio */
  aspectRatio?: Responsive<AspectRatioValue>;

  // ---------------------------------------------------------------------------
  // Borders - Radius
  // ---------------------------------------------------------------------------
  /** Border radius (all corners) */
  rounded?: Responsive<BorderRadiusValue>;
  /** Border radius top-left */
  roundedTopLeft?: Responsive<BorderRadiusValue>;
  /** Border radius top-right */
  roundedTopRight?: Responsive<BorderRadiusValue>;
  /** Border radius bottom-right */
  roundedBottomRight?: Responsive<BorderRadiusValue>;
  /** Border radius bottom-left */
  roundedBottomLeft?: Responsive<BorderRadiusValue>;
  /** Border radius top (left and right) */
  roundedTop?: Responsive<BorderRadiusValue>;
  /** Border radius right (top and bottom) */
  roundedRight?: Responsive<BorderRadiusValue>;
  /** Border radius bottom (left and right) */
  roundedBottom?: Responsive<BorderRadiusValue>;
  /** Border radius left (top and bottom) */
  roundedLeft?: Responsive<BorderRadiusValue>;

  // ---------------------------------------------------------------------------
  // Borders - Width
  // ---------------------------------------------------------------------------
  /** Border width (all sides) */
  borderWidth?: Responsive<BorderWidthValue>;
  /** Border top width */
  borderTopWidth?: Responsive<BorderWidthValue>;
  /** Border right width */
  borderRightWidth?: Responsive<BorderWidthValue>;
  /** Border bottom width */
  borderBottomWidth?: Responsive<BorderWidthValue>;
  /** Border left width */
  borderLeftWidth?: Responsive<BorderWidthValue>;

  // ---------------------------------------------------------------------------
  // Borders - Style
  // ---------------------------------------------------------------------------
  /** Border style (all sides) */
  borderStyle?: Responsive<BorderStyleValue>;

  // ---------------------------------------------------------------------------
  // Outline
  // ---------------------------------------------------------------------------
  /** Outline width */
  outlineWidth?: Responsive<BorderWidthValue>;
  /** Outline style */
  outlineStyle?: Responsive<BorderStyleValue>;
  /** Outline offset */
  outlineOffset?: Responsive<OutlineOffsetValue>;

  // ---------------------------------------------------------------------------
  // Ring (Focus Ring)
  // ---------------------------------------------------------------------------
  /** Ring width */
  ringWidth?: Responsive<RingWidthValue>;
  /** Ring offset width */
  ringOffsetWidth?: Responsive<BorderWidthValue>;
  /** Ring offset color */
  ringOffsetColor?: Responsive<ColorValue>;

  // ---------------------------------------------------------------------------
  // Position
  // ---------------------------------------------------------------------------
  /** Top position */
  top?: Responsive<SpacingValue | NegativeSpacingValue | FractionalValue | "auto" | "full">;
  /** Right position */
  right?: Responsive<SpacingValue | NegativeSpacingValue | FractionalValue | "auto" | "full">;
  /** Bottom position */
  bottom?: Responsive<SpacingValue | NegativeSpacingValue | FractionalValue | "auto" | "full">;
  /** Left position */
  left?: Responsive<SpacingValue | NegativeSpacingValue | FractionalValue | "auto" | "full">;
  /** Inset (all positions) */
  inset?: Responsive<SpacingValue | NegativeSpacingValue | "auto">;
  /** Inset X (left and right) */
  insetX?: Responsive<SpacingValue | NegativeSpacingValue | "auto">;
  /** Inset Y (top and bottom) */
  insetY?: Responsive<SpacingValue | NegativeSpacingValue | "auto">;

  // ---------------------------------------------------------------------------
  // Z-Index
  // ---------------------------------------------------------------------------
  /** Z-index layer */
  zIndex?: Responsive<"auto" | 0 | 10 | 20 | 30 | 40 | 50 | 100>;

  // ---------------------------------------------------------------------------
  // Visual Effects - Essential
  // ---------------------------------------------------------------------------
  /** Box shadow */
  shadow?: Responsive<ShadowValue>;
  /** Opacity */
  opacity?: Responsive<OpacityValue>;
  /** Cursor */
  cursor?: Responsive<CursorValue>;
  /** Pointer events */
  pointerEvents?: Responsive<PointerEventsValue>;
  /** User select */
  userSelect?: Responsive<UserSelectValue>;

  // ---------------------------------------------------------------------------
  // Transforms - Important
  // ---------------------------------------------------------------------------
  /** Rotate (degrees) */
  rotate?: Responsive<RotateValue>;
  /** Scale (both X and Y) */
  scale?: Responsive<ScaleValue>;
  /** Scale X */
  scaleX?: Responsive<ScaleValue>;
  /** Scale Y */
  scaleY?: Responsive<ScaleValue>;
  /** Translate X */
  translateX?: Responsive<TranslateValue>;
  /** Translate Y */
  translateY?: Responsive<TranslateValue>;
  /** Skew X */
  skewX?: Responsive<SkewValue>;
  /** Skew Y */
  skewY?: Responsive<SkewValue>;
  /** Transform origin */
  transformOrigin?: Responsive<TransformOriginValue>;

  // ---------------------------------------------------------------------------
  // Filters - Nice to Have
  // ---------------------------------------------------------------------------
  /** Blur filter */
  blur?: Responsive<BlurValue>;
  /** Brightness filter */
  brightness?: Responsive<BrightnessValue>;
  /** Contrast filter */
  contrast?: Responsive<ContrastValue>;
  /** Grayscale filter */
  grayscale?: Responsive<GrayscaleValue>;
  /** Saturate filter */
  saturate?: Responsive<SaturateValue>;
  /** Backdrop blur */
  backdropBlur?: Responsive<BlurValue>;
  /** Backdrop brightness */
  backdropBrightness?: Responsive<BrightnessValue>;
  /** Backdrop contrast */
  backdropContrast?: Responsive<ContrastValue>;
  /** Backdrop grayscale */
  backdropGrayscale?: Responsive<GrayscaleValue>;
  /** Backdrop saturate */
  backdropSaturate?: Responsive<SaturateValue>;

  // ---------------------------------------------------------------------------
  // Blend Modes - Nice to Have
  // ---------------------------------------------------------------------------
  /** Mix blend mode */
  mixBlendMode?: Responsive<MixBlendModeValue>;
  /** Background blend mode */
  bgBlendMode?: Responsive<BgBlendModeValue>;

  // ---------------------------------------------------------------------------
  // Background - Nice to Have
  // ---------------------------------------------------------------------------
  /** Background size */
  bgSize?: Responsive<BgSizeValue>;
  /** Background position */
  bgPosition?: Responsive<BgPositionValue>;
  /** Background repeat */
  bgRepeat?: Responsive<BgRepeatValue>;
  /** Background attachment */
  bgAttachment?: Responsive<BgAttachmentValue>;

  // ---------------------------------------------------------------------------
  // Object (Images) - Nice to Have
  // ---------------------------------------------------------------------------
  /** Object fit */
  objectFit?: Responsive<ObjectFitValue>;
  /** Object position */
  objectPosition?: Responsive<ObjectPositionValue>;

  // ---------------------------------------------------------------------------
  // Transitions - Nice to Have
  // ---------------------------------------------------------------------------
  /** Transition property */
  transition?: Responsive<TransitionValue>;
  /** Transition duration */
  transitionDuration?: Responsive<TransitionDurationValue>;
  /** Transition timing function */
  transitionTimingFunction?: Responsive<TransitionTimingValue>;

  // ---------------------------------------------------------------------------
  // Flexbox Child Props - Important
  // ---------------------------------------------------------------------------
  /** Flex shorthand */
  flex?: Responsive<FlexValue>;
  /** Flex grow */
  flexGrow?: Responsive<FlexGrowValue>;
  /** Flex shrink */
  flexShrink?: Responsive<FlexShrinkValue>;
  /** Flex basis */
  flexBasis?: Responsive<FlexBasisValue>;
  /** Align self */
  alignSelf?: Responsive<AlignSelfValue>;
  /** Order */
  order?: Responsive<OrderValue>;

  // ---------------------------------------------------------------------------
  // Grid Child Props - Important
  // ---------------------------------------------------------------------------
  /** Grid column span */
  colSpan?: Responsive<GridSpanValue>;
  /** Grid column start */
  colStart?: Responsive<GridLineValue>;
  /** Grid column end */
  colEnd?: Responsive<GridLineValue>;
  /** Grid row span */
  rowSpan?: Responsive<GridSpanValue>;
  /** Grid row start */
  rowStart?: Responsive<GridLineValue>;
  /** Grid row end */
  rowEnd?: Responsive<GridLineValue>;
  /** Justify self (grid) */
  justifySelf?: Responsive<JustifySelfValue>;
  /** Place self (grid shorthand) */
  placeSelf?: Responsive<AlignSelfValue>;
}

// =============================================================================
// Component-Specific Props
// =============================================================================

/**
 * Flex-specific props (extends StyleProps)
 */
export interface FlexProps extends StyleProps {
  /** Flex direction */
  direction?: Responsive<"row" | "row-reverse" | "column" | "column-reverse">;
  /** Flex wrap */
  wrap?: Responsive<"nowrap" | "wrap" | "wrap-reverse">;
  /** Justify content */
  justify?: Responsive<"start" | "end" | "center" | "between" | "around" | "evenly">;
  /** Align items */
  align?: Responsive<"start" | "end" | "center" | "baseline" | "stretch">;
  /** Align content */
  alignContent?: Responsive<"start" | "end" | "center" | "between" | "around" | "stretch">;
}

/**
 * Grid-specific props (extends StyleProps)
 */
export interface GridProps extends StyleProps {
  /** Number of columns (shorthand for repeat(n, 1fr)) */
  columns?: Responsive<number>;
  /** Number of rows (shorthand for repeat(n, 1fr)) */
  rows?: Responsive<number>;
  /** Grid template columns (full CSS value) */
  templateColumns?: Responsive<string>;
  /** Grid template rows (full CSS value) */
  templateRows?: Responsive<string>;
  /** Grid auto flow */
  autoFlow?: Responsive<"row" | "column" | "dense" | "row dense" | "column dense">;
  /** Grid auto columns */
  autoColumns?: Responsive<"auto" | "min" | "max" | "fr">;
  /** Grid auto rows */
  autoRows?: Responsive<"auto" | "min" | "max" | "fr">;
}

/**
 * Text-specific props (extends StyleProps)
 */
export interface TextProps extends StyleProps {
  /** Text truncation */
  truncate?: boolean;
  /** Number of lines before truncation */
  noOfLines?: number;
  /** Text transform */
  textTransform?: Responsive<"none" | "uppercase" | "lowercase" | "capitalize">;
  /** Text decoration */
  textDecoration?: Responsive<"none" | "underline" | "line-through">;
}
