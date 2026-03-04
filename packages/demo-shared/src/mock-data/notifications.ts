import type { MockNotification } from '../types';

export const mockNotifications: MockNotification[] = [
  {
    id: 'notif-1',
    type: 'success',
    title: 'Deployment Complete',
    message: 'Your application has been successfully deployed to production.',
    timestamp: '2026-01-16T10:30:00Z',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'warning',
    title: 'Storage Limit Approaching',
    message: 'You have used 85% of your storage quota. Consider upgrading your plan.',
    timestamp: '2026-01-16T09:15:00Z',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'info',
    title: 'New Feature Available',
    message: 'Dark mode is now available. You can enable it in your settings.',
    timestamp: '2026-01-15T14:00:00Z',
    read: true,
  },
  {
    id: 'notif-4',
    type: 'error',
    title: 'Build Failed',
    message: 'The latest build failed due to a test failure. Check the logs for details.',
    timestamp: '2026-01-15T11:45:00Z',
    read: true,
  },
  {
    id: 'notif-5',
    type: 'success',
    title: 'Team Member Added',
    message: 'Sarah Chen has joined your team as an Admin.',
    timestamp: '2026-01-14T16:30:00Z',
    read: true,
  },
  {
    id: 'notif-6',
    type: 'info',
    title: 'Scheduled Maintenance',
    message: 'System maintenance is scheduled for this weekend. Expect brief downtime.',
    timestamp: '2026-01-14T09:00:00Z',
    read: true,
  },
];

/**
 * Format timestamp to relative time
 */
export function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
