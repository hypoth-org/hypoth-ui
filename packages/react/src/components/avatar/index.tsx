"use client";

/**
 * Avatar compound component exports
 */

import { AvatarGroup } from "./avatar-group.js";
import { Avatar as AvatarRoot } from "./avatar.js";

export type { AvatarProps, AvatarSize, AvatarShape, AvatarStatus } from "./avatar.js";
export type { AvatarGroupProps } from "./avatar-group.js";

/**
 * Avatar compound component for user representation.
 *
 * @example
 * ```tsx
 * // Single avatar
 * <Avatar src="/user.jpg" name="John Doe" />
 *
 * // Avatar group
 * <Avatar.Group max={3}>
 *   <Avatar name="Alice" />
 *   <Avatar name="Bob" />
 *   <Avatar name="Charlie" />
 * </Avatar.Group>
 * ```
 */
export const Avatar = Object.assign(AvatarRoot, {
  Group: AvatarGroup,
});

export { AvatarGroup };
