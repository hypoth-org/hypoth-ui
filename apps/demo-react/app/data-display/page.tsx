'use client';

import { Card, Avatar, Badge, Tag, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@ds/react';
import { dataDisplaySectionContent, mockUsers, mockProducts, formatPrice } from '@ds/demo-shared';
import { SidebarNav } from '../../components/sidebar-nav';
import { AppShell } from '../../components/app-shell';
import { ThemeToggle } from '../../components/theme-toggle';

export default function DataDisplayPage() {
  return (
    <AppShell
      sidebar={<SidebarNav />}
      header={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 600 }}>Demo - React</h1>
          <ThemeToggle />
        </div>
      }
    >
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Dashboard</a>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current" aria-current="page">Data Display</span>
      </nav>
      <div className="page-header">
        <h2 className="page-title">{dataDisplaySectionContent.title}</h2>
        <p className="page-description">{dataDisplaySectionContent.description}</p>
      </div>

      {/* Table Showcase */}
      <div className="showcase-card">
        <h3 className="showcase-title">Table</h3>
        <p className="showcase-description">
          A structured data table with headers and rows.
        </p>
        <div className="showcase-demo">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.slice(0, 5).map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'success' : user.status === 'pending' ? 'warning' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Card Showcase */}
      <div className="showcase-card">
        <h3 className="showcase-title">Card</h3>
        <p className="showcase-description">
          A container for grouping related content.
        </p>
        <div className="showcase-demo">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {mockProducts.slice(0, 3).map((product) => (
              <Card.Root key={product.id}>
                <Card.Header>
                  <div style={{ fontWeight: 600 }}>{product.name}</div>
                  <div style={{ fontSize: '14px', color: 'var(--color-muted)' }}>{product.category}</div>
                </Card.Header>
                <Card.Content>
                  <p style={{ fontSize: '14px', color: 'var(--color-muted)', marginBottom: '8px' }}>
                    {product.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '18px' }}>{formatPrice(product.price)}</span>
                    <Badge variant={product.inStock ? 'success' : 'secondary'}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                </Card.Content>
              </Card.Root>
            ))}
          </div>
        </div>
      </div>

      {/* Avatar Showcase */}
      <div className="showcase-card">
        <h3 className="showcase-title">Avatar</h3>
        <p className="showcase-description">
          A visual representation of a user or entity.
        </p>
        <div className="showcase-demo">
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Avatar size="sm" name="John Doe" />
            <Avatar size="md" name="Jane Smith" />
            <Avatar size="lg" name="Bob Wilson" />
            <Avatar size="lg" name="Alice Johnson" status="online" />
          </div>
        </div>
      </div>

      {/* Badge Showcase */}
      <div className="showcase-card">
        <h3 className="showcase-title">Badge</h3>
        <p className="showcase-description">
          A small label for status or count indicators.
        </p>
        <div className="showcase-demo">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
          </div>
        </div>
      </div>

      {/* Tag Showcase */}
      <div className="showcase-card">
        <h3 className="showcase-title">Tag</h3>
        <p className="showcase-description">
          A compact element for labeling and categorization.
        </p>
        <div className="showcase-demo">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Tag>React</Tag>
            <Tag variant="secondary">TypeScript</Tag>
            <Tag variant="success">Active</Tag>
            <Tag variant="warning">Pending</Tag>
            <Tag removable onRemove={() => {}}>Removable</Tag>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
