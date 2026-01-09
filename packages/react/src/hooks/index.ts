/**
 * React hooks exports
 */

// SSR-safe ID generation
export {
  useStableId,
  useStableIds,
  useScopedIdGenerator,
  useConditionalId,
} from "./use-stable-id.js";
export type {
  UseStableIdOptions,
  UseStableIdsOptions,
  StableIds,
} from "./use-stable-id.js";

// Responsive utilities
export { useResponsiveClasses } from "./use-responsive-classes.js";
