# Quickstart: Feedback, Data Display & Utilities

**Feature**: 019-feedback-data-utilities
**Date**: 2026-01-08

This document provides integration examples for the components in this feature.

---

## Installation

```bash
# Install packages
pnpm add @ds/wc @ds/react @ds/css
```

---

## 1. Toast Notifications

### React Usage

```tsx
// app/layout.tsx
import { Toast } from "@ds/react/client";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Toast.Provider position="top-right" max={5}>
          {children}
        </Toast.Provider>
      </body>
    </html>
  );
}

// components/SaveButton.tsx
"use client";
import { useToast } from "@ds/react/client";
import { Button } from "@ds/react";

export function SaveButton() {
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      toast({
        title: "Saved successfully",
        variant: "success",
      });
    } catch {
      toast({
        title: "Save failed",
        description: "Please try again.",
        variant: "error",
        action: { label: "Retry", onClick: handleSave },
      });
    }
  };

  return <Button onClick={handleSave}>Save</Button>;
}
```

### Web Component Usage

```html
<ds-toast-provider position="top-right" max="5">
  <!-- app content -->
</ds-toast-provider>

<script>
  // Imperative API
  dsToast({
    title: "File uploaded",
    description: "image.png was uploaded successfully",
    variant: "success",
  });

  // Or use controller
  const controller = new ToastController();
  const id = controller.show({ title: "Processing..." });
  // Later...
  controller.dismiss(id);
</script>
```

---

## 2. Alerts

### React Usage

```tsx
import { Alert } from "@ds/react";

function FormFeedback({ error, success }) {
  if (error) {
    return (
      <Alert variant="error" title="Error" closable onClose={() => clearError()}>
        {error.message}
      </Alert>
    );
  }

  if (success) {
    return (
      <Alert variant="success" title="Success">
        Your changes have been saved.
      </Alert>
    );
  }

  return null;
}
```

### Web Component Usage

```html
<ds-alert variant="warning" title="Unsaved changes" closable>
  You have unsaved changes. Do you want to save before leaving?
  <span slot="action">
    <ds-button size="sm">Save now</ds-button>
  </span>
</ds-alert>
```

---

## 3. Progress Indicators

### React Usage

```tsx
import { Progress } from "@ds/react";

function FileUpload() {
  const [progress, setProgress] = useState<number | undefined>();

  return (
    <div>
      <Progress
        value={progress}
        label="Uploading file..."
        variant="linear"
      />
      {/* Indeterminate when progress is undefined */}
    </div>
  );
}

// Circular variant
<Progress variant="circular" value={75} />
```

### Web Component Usage

```html
<!-- Determinate -->
<ds-progress value="50" max="100" label="Loading..."></ds-progress>

<!-- Indeterminate -->
<ds-progress label="Processing..."></ds-progress>

<!-- Circular -->
<ds-progress variant="circular" value="75"></ds-progress>
```

---

## 4. Avatars

### React Usage

```tsx
import { Avatar, AvatarGroup } from "@ds/react";

function UserList({ users }) {
  return (
    <AvatarGroup max={4}>
      {users.map((user) => (
        <Avatar
          key={user.id}
          src={user.avatar}
          alt={user.name}
          name={user.name}
          status={user.online ? "online" : "offline"}
        />
      ))}
    </AvatarGroup>
  );
}
```

### Web Component Usage

```html
<ds-avatar-group max="3">
  <ds-avatar src="/avatars/1.jpg" alt="John Doe" name="John Doe" status="online"></ds-avatar>
  <ds-avatar src="/avatars/2.jpg" alt="Jane Smith" name="Jane Smith"></ds-avatar>
  <ds-avatar alt="Bob Wilson" name="Bob Wilson"></ds-avatar>
  <ds-avatar alt="Alice Brown" name="Alice Brown"></ds-avatar>
</ds-avatar-group>
<!-- Shows 3 avatars + "+1" overflow -->
```

---

## 5. Tables

### React Usage

```tsx
import { Table } from "@ds/react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const columns = [
  { id: "name", header: "Name", accessorKey: "name", sortable: true },
  { id: "email", header: "Email", accessorKey: "email" },
  {
    id: "role",
    header: "Role",
    accessorKey: "role",
    cell: ({ value }) => <Badge>{value}</Badge>,
  },
];

function UserTable({ users }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <Table.Root
      columns={columns}
      data={users}
      selectable
      onSelectionChange={setSelectedIds}
      getRowId={(row) => row.id}
      emptyState={<p>No users found</p>}
    />
  );
}
```

### Web Component Usage

```html
<ds-table selectable sortable>
  <ds-table-header>
    <ds-table-row>
      <ds-table-head sortable>Name</ds-table-head>
      <ds-table-head>Email</ds-table-head>
      <ds-table-head align="right">Actions</ds-table-head>
    </ds-table-row>
  </ds-table-header>
  <ds-table-body>
    <ds-table-row data-row-id="1">
      <ds-table-cell>John Doe</ds-table-cell>
      <ds-table-cell>john@example.com</ds-table-cell>
      <ds-table-cell align="right">
        <ds-button size="sm" variant="ghost">Edit</ds-button>
      </ds-table-cell>
    </ds-table-row>
  </ds-table-body>
</ds-table>
```

---

## 6. DataTable with Pagination

### React Usage

```tsx
import { DataTable } from "@ds/react";

function LargeDataset({ data, total }) {
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("");

  return (
    <div>
      <Input
        placeholder="Search..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <DataTable
        columns={columns}
        data={data}
        page={page}
        pageSize={25}
        total={total}
        filter={filter}
        virtualize
        onPageChange={setPage}
        onFilterChange={setFilter}
      />
    </div>
  );
}
```

---

## 7. Skeleton Loading

### React Usage

```tsx
import { Skeleton } from "@ds/react";

function CardSkeleton() {
  return (
    <Card>
      <Card.Header>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width={120} />
      </Card.Header>
      <Card.Content>
        <Skeleton variant="text" lines={3} />
      </Card.Content>
    </Card>
  );
}

function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return /* actual products */;
}
```

---

## 8. Tags

### React Usage

```tsx
import { Tag } from "@ds/react";

function CategoryTags({ categories, onRemove }) {
  return (
    <div className="flex gap-2">
      {categories.map((cat) => (
        <Tag
          key={cat}
          removable
          colorScheme="info"
          onRemove={() => onRemove(cat)}
        >
          {cat}
        </Tag>
      ))}
    </div>
  );
}
```

---

## 9. Tree View

### React Usage

```tsx
import { Tree, TreeItem } from "@ds/react";

function FileExplorer() {
  return (
    <Tree selectionMode="single" onSelectionChange={handleSelect}>
      <TreeItem value="src" icon="folder">
        src
        <TreeItem value="components" icon="folder">
          components
          <TreeItem value="Button.tsx" icon="file">
            Button.tsx
          </TreeItem>
        </TreeItem>
      </TreeItem>
      <TreeItem value="package.json" icon="file">
        package.json
      </TreeItem>
    </Tree>
  );
}
```

---

## 10. List with Selection

### React Usage

```tsx
import { List, ListItem } from "@ds/react";

function ContactList({ contacts }) {
  return (
    <List selectionMode="multiple" onSelectionChange={handleSelect}>
      {contacts.map((contact) => (
        <ListItem
          key={contact.id}
          value={contact.id}
          leading={<Avatar src={contact.avatar} alt={contact.name} size="sm" />}
          trailing={<Badge dot variant={contact.online ? "success" : "neutral"} />}
        >
          {contact.name}
        </ListItem>
      ))}
    </List>
  );
}
```

---

## 11. Calendar with Events

### React Usage

```tsx
import { Calendar } from "@ds/react";

function EventCalendar({ events }) {
  return (
    <Calendar
      events={events}
      onChange={handleDateSelect}
      renderEvent={(event) => (
        <div className="text-xs truncate">{event.title}</div>
      )}
    />
  );
}
```

---

## 12. Utility Primitives

### Portal

```tsx
import { Portal } from "@ds/react";

function Overlay({ children }) {
  return (
    <Portal>
      <div className="fixed inset-0 bg-black/50">
        {children}
      </div>
    </Portal>
  );
}
```

### FocusScope

```tsx
import { FocusScope } from "@ds/react";

function Modal({ open, children }) {
  if (!open) return null;

  return (
    <Portal>
      <FocusScope trap restoreFocus autoFocus>
        <div role="dialog" aria-modal="true">
          {children}
        </div>
      </FocusScope>
    </Portal>
  );
}
```

### ClientOnly

```tsx
import { ClientOnly } from "@ds/react";

function BrowserOnlyChart({ data }) {
  return (
    <ClientOnly fallback={<Skeleton height={300} />}>
      <Chart data={data} />
    </ClientOnly>
  );
}
```

---

## Badge on Icons

```tsx
import { Badge, Icon, Button } from "@ds/react";

function NotificationButton({ count }) {
  return (
    <Button variant="ghost" size="icon">
      <Badge count={count} max={99}>
        <Icon name="bell" />
      </Badge>
    </Button>
  );
}
```

---

## Next.js App Router Setup

```tsx
// app/providers.tsx
"use client";

import { Toast } from "@ds/react/client";

export function Providers({ children }) {
  return (
    <Toast.Provider position="top-right">
      {children}
    </Toast.Provider>
  );
}

// app/layout.tsx
import { Providers } from "./providers";
import "@ds/css";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```
