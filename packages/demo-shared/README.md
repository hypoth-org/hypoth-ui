# @ds/demo-shared

Shared types, navigation config, mock data, and content definitions for the Hypoth UI demo applications.

## Usage

```ts
import {
  navigation,
  getWCNavigation,
  mockUsers,
  mockProducts,
  mockNotifications,
  formatPrice,
  formatRelativeTime,
  formsSectionContent,
  dataDisplaySectionContent,
  overlaysSectionContent,
  feedbackSectionContent,
} from '@ds/demo-shared';
```

## Exports

### Navigation

| Export              | Description                                    |
| ------------------- | ---------------------------------------------- |
| `navigation`        | Nav sections with path-based routes (`/forms`) |
| `getWCNavigation()` | Nav sections with hash-based routes (`#forms`) |

### Mock Data

| Export                 | Description                          |
| ---------------------- | ------------------------------------ |
| `mockUsers`            | 8 mock users with name, email, role  |
| `mockProducts`         | 6 mock products with price, category |
| `mockNotifications`    | Mock notifications with timestamps   |
| `formatPrice(cents)`   | Format price in cents to `$X.XX`     |
| `formatRelativeTime()` | ISO timestamp to relative string     |

### Content Configs

| Export                       | Components                                       |
| ---------------------------- | ------------------------------------------------ |
| `formsSectionContent`        | Input, Textarea, Select, Checkbox, Radio, Switch |
| `dataDisplaySectionContent`  | Table, DataTable, List, Card, Avatar, Badge, Tag |
| `overlaysSectionContent`     | Dialog, AlertDialog, Sheet, Drawer, Popover, Tooltip |
| `feedbackSectionContent`     | Alert, Toast, Progress, Spinner, Skeleton        |

### Types

`ThemeState`, `NavItem`, `NavSection`, `MockUser`, `MockProduct`, `MockNotification`, `ComponentShowcase`, `SectionContent`

## Build

```bash
pnpm --filter @ds/demo-shared build
```
