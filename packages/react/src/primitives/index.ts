// Primitives barrel export
// React-only components that don't wrap Web Components

export { Slot, type SlotProps } from "./slot.js";
export { Box, type BoxProps } from "./box.js";
export { Presence, type PresenceProps } from "./Presence.js";
export { usePresence, type UsePresenceOptions, type UsePresenceReturn } from "./use-presence.js";

// Utility primitives
export { Portal, type PortalProps } from "./portal.js";
export { FocusScope, type FocusScopeProps, type FocusScopeRef } from "./focus-scope.js";
export { ClientOnly, type ClientOnlyProps, useIsClient } from "./client-only.js";
