/**
 * Feedback components barrel file.
 * Import from '@ds/wc/feedback' for tree-shaking.
 */

// Alert component
export { DsAlert, type AlertVariant } from "./components/alert/index.js";

// Toast components
export { DsToast } from "./components/toast/toast.js";
export { DsToastProvider } from "./components/toast/toast-provider.js";
export {
  ToastController,
  dsToast,
  getGlobalToastController,
  setGlobalToastController,
  type ToastOptions,
  type ToastData,
  type ToastVariant,
  type ToastPosition,
  type ToastState,
  type ToastAction,
  type ToastControllerOptions,
} from "./components/toast/index.js";

// Progress component
export {
  DsProgress,
  type ProgressVariant,
  type ProgressSize,
} from "./components/progress/index.js";

// Skeleton component
export {
  DsSkeleton,
  type SkeletonVariant,
  type SkeletonSize,
  type SkeletonWidth,
  type SkeletonAnimation,
} from "./components/skeleton/index.js";

// Spinner component
export { DsSpinner } from "./components/spinner/spinner.js";
export type { SpinnerSize } from "./components/spinner/spinner.js";
