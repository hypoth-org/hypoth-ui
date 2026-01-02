/**
 * DTCG TypeScript types for design tokens
 * Based on Design Tokens Community Group specification
 */

/** Primitive token value types */
export type ColorValue = string;
export type DimensionValue = string;
export type FontFamilyValue = string | string[];
export type FontWeightValue = number | string;
export type DurationValue = string;
export type CubicBezierValue = [number, number, number, number];
export type NumberValue = number;

/** Shadow composite value */
export interface ShadowValue {
  color: string;
  offsetX: string;
  offsetY: string;
  blur: string;
  spread: string;
}

/** Border composite value */
export interface BorderValue {
  color: string;
  width: string;
  style: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'outset' | 'inset';
}

/** Typography composite value */
export interface TypographyValue {
  fontFamily: string | string[];
  fontSize: string;
  fontWeight: number | string;
  letterSpacing: string;
  lineHeight: number | string;
}

/** Gradient stop */
export interface GradientStop {
  color: string;
  position: number;
}

/** Gradient value (array of stops) */
export type GradientValue = GradientStop[];

/** Transition composite value */
export interface TransitionValue {
  duration: string;
  delay: string;
  timingFunction: CubicBezierValue;
}

/** Stroke style value */
export type StrokeStyleValue =
  | 'solid'
  | 'dashed'
  | 'dotted'
  | 'double'
  | 'groove'
  | 'ridge'
  | 'outset'
  | 'inset'
  | { dashArray: string[]; lineCap: 'butt' | 'round' | 'square' };

/** All possible token value types */
export type TokenValue =
  | string
  | number
  | string[]
  | CubicBezierValue
  | ShadowValue
  | ShadowValue[]
  | BorderValue
  | TypographyValue
  | GradientValue
  | TransitionValue
  | StrokeStyleValue;

/** DTCG token types */
export type TokenType =
  | 'color'
  | 'dimension'
  | 'fontFamily'
  | 'fontWeight'
  | 'duration'
  | 'cubicBezier'
  | 'number'
  | 'shadow'
  | 'border'
  | 'strokeStyle'
  | 'typography'
  | 'gradient'
  | 'transition';

/** A single DTCG token */
export interface Token {
  $value: TokenValue;
  $type?: TokenType;
  $description?: string;
  $extensions?: Record<string, unknown>;
}

/** A group of tokens or nested groups */
export interface TokenGroup {
  $type?: TokenType;
  $description?: string;
  $extensions?: Record<string, unknown>;
  [key: string]: Token | TokenGroup | TokenType | string | Record<string, unknown> | undefined;
}

/** A token set (file) containing tokens and groups */
export interface TokenSet {
  $schema?: string;
  [key: string]: Token | TokenGroup | string | undefined;
}

/** Resolved token with full path and source information */
export interface ResolvedToken {
  path: string;
  value: TokenValue;
  resolvedValue: TokenValue;
  type: TokenType;
  description?: string;
  source: TokenSource;
  cssVariable: string;
}

/** Source information for a token */
export interface TokenSource {
  file: string;
  brand?: string;
  mode?: string;
}

/** Brand configuration */
export interface Brand {
  id: string;
  name: string;
  tokens: TokenSet;
}

/** Mode configuration */
export interface Mode {
  id: string;
  name: string;
  tokens: TokenSet;
  mediaQuery?: string;
}

/** Compilation result */
export interface CompilationResult {
  css: string;
  json: Record<string, unknown>;
  typescript: string;
  warnings: CompilationWarning[];
  metadata: CompilationMetadata;
}

/** Compilation warning */
export interface CompilationWarning {
  type: 'circular-reference' | 'undefined-reference' | 'invalid-value' | 'unknown-type';
  message: string;
  path: string;
  source?: TokenSource;
}

/** Compilation metadata */
export interface CompilationMetadata {
  version: string;
  generatedAt: string;
  brands: string[];
  modes: string[];
  tokenCount: number;
}
