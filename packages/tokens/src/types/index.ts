/**
 * Token types exports
 */

// DTCG types
export type {
  Token,
  TokenGroup,
  TokenSet,
  TokenType,
  TokenValue,
  ResolvedToken,
  TokenSource,
  Brand,
  Mode,
  CompilationResult,
  CompilationWarning,
  CompilationMetadata,
  ColorValue,
  DimensionValue,
  FontFamilyValue,
  FontWeightValue,
  DurationValue,
  CubicBezierValue,
  NumberValue,
  ShadowValue,
  BorderValue,
  TypographyValue,
  GradientStop,
  GradientValue,
  TransitionValue,
  StrokeStyleValue,
} from "./dtcg.js";

// Categories
export {
  TOKEN_CATEGORIES,
  CATEGORY_DESCRIPTIONS,
  isTokenCategory,
  getCategoryFromPath,
} from "./categories.js";
export type { TokenCategory } from "./categories.js";

// 16-Step Color Scale Types
export {
  ColorStepCategories,
  ColorStepUsage,
  getColorVar,
  getColorCSSVarName,
} from "./colors.js";
export type {
  ColorStep,
  PrimitiveColorName,
  SemanticColorName,
  SemanticColorAlias,
  ColorTokenValue,
  ColorCSSVariable,
} from "./colors.js";

// Density System Types
export {
  DensityScales,
  SpacingByDensity,
  getSpacingVar,
  getComponentVar,
  getDensitySelector,
} from "./density.js";
export type {
  DensityMode,
  SpacingScale,
  ComponentSize,
  ComponentTokenKey,
  SpacingCSSVariable,
  ComponentCSSVariable,
  DensityCSSVariable,
} from "./density.js";
