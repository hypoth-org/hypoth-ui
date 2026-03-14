'use client';

import { useState } from 'react';
import { Dialog, Sheet, Input } from '@hypoth-ui/react/client';
import { DsButton as Button } from '@hypoth-ui/react/client';
import { overlaysSectionContent } from '@hypoth-ui/demo-shared';
import { SidebarNav } from '../../components/sidebar-nav';
import { AppShell } from '../../components/app-shell';
import { ThemeToggle } from '../../components/theme-toggle';

export default function OverlaysPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetSide, setSheetSide] = useState<'left' | 'right' | 'top' | 'bottom'>('right');

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
        <span className="breadcrumb-current" aria-current="page">Overlays</span>
      </nav>
      <div className="page-header">
        <h2 className="page-title">{overlaysSectionContent.title}</h2>
        <p className="page-description">{overlaysSectionContent.description}</p>
      </div>

      {/* Dialog Showcase */}
      <div className="showcase-card">
        <h3 className="showcase-title">Dialog</h3>
        <p className="showcase-description">
          A modal dialog interrupts the user with important content and expects a response.
        </p>
        <div className="showcase-demo">
          <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
            <Dialog.Trigger asChild>
              <Button>Open Dialog</Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Edit Profile</Dialog.Title>
              <Dialog.Description>
                Make changes to your profile here. Click save when you're done.
              </Dialog.Description>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="name" style={{ fontSize: '14px', fontWeight: 500 }}>Name</label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="username" style={{ fontSize: '14px', fontWeight: 500 }}>Username</label>
                  <Input id="username" defaultValue="@johndoe" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
                <Dialog.Close asChild>
                  <Button variant="secondary">Cancel</Button>
                </Dialog.Close>
                <Button onClick={() => setDialogOpen(false)}>Save changes</Button>
              </div>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </div>

      {/* Alert Dialog Showcase */}
      <div className="showcase-card">
        <h3 className="showcase-title">Alert Dialog</h3>
        <p className="showcase-description">
          A modal dialog that interrupts the user with important content and expects a confirmation.
        </p>
        <div className="showcase-demo">
          <Dialog.Root open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
            <Dialog.Trigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Are you absolutely sure?</Dialog.Title>
              <Dialog.Description>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </Dialog.Description>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
                <Dialog.Close asChild>
                  <Button variant="secondary">Cancel</Button>
                </Dialog.Close>
                <Button variant="destructive" onClick={() => setAlertDialogOpen(false)}>
                  Yes, delete account
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </div>

      {/* Sheet Showcase */}
      <div className="showcase-card">
        <h3 className="showcase-title">Sheet</h3>
        <p className="showcase-description">
          A slide-out panel that extends from the edge of the screen.
        </p>
        <div className="showcase-demo">
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <Button
              variant={sheetSide === 'left' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSheetSide('left')}
            >
              Left
            </Button>
            <Button
              variant={sheetSide === 'right' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSheetSide('right')}
            >
              Right
            </Button>
            <Button
              variant={sheetSide === 'top' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSheetSide('top')}
            >
              Top
            </Button>
            <Button
              variant={sheetSide === 'bottom' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSheetSide('bottom')}
            >
              Bottom
            </Button>
          </div>
          <Sheet.Root open={sheetOpen} onOpenChange={setSheetOpen}>
            <Sheet.Trigger>
              <Button>Open Sheet ({sheetSide})</Button>
            </Sheet.Trigger>
            <Sheet.Content side={sheetSide}>
              <Sheet.Header>
                <Sheet.Title>Edit Profile</Sheet.Title>
                <Sheet.Description>
                  Make changes to your profile here.
                </Sheet.Description>
              </Sheet.Header>
              <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="sheet-name" style={{ fontSize: '14px', fontWeight: 500 }}>Name</label>
                  <Input id="sheet-name" defaultValue="John Doe" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="sheet-email" style={{ fontSize: '14px', fontWeight: 500 }}>Email</label>
                  <Input id="sheet-email" defaultValue="john@example.com" />
                </div>
              </div>
              <Sheet.Footer>
                <Sheet.Close>
                  <Button variant="secondary">Cancel</Button>
                </Sheet.Close>
                <Button onClick={() => setSheetOpen(false)}>Save changes</Button>
              </Sheet.Footer>
            </Sheet.Content>
          </Sheet.Root>
        </div>
      </div>

      {/* Drawer Showcase */}
      <div className="showcase-card">
        <h3 className="showcase-title">Drawer</h3>
        <p className="showcase-description">
          A mobile-optimized slide-in panel with swipe-to-dismiss gesture support.
        </p>
        <div className="showcase-demo">
          <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginBottom: '12px' }}>
            Drawers are optimized for mobile devices with touch gesture support.
            Try on a mobile device or resize your browser to see the best experience.
          </p>
          <Sheet.Root>
            <Sheet.Trigger>
              <Button>Open Drawer</Button>
            </Sheet.Trigger>
            <Sheet.Content side="bottom" size="sm">
              <Sheet.Header>
                <Sheet.Title>Move Goal</Sheet.Title>
                <Sheet.Description>
                  Set your daily activity goal.
                </Sheet.Description>
              </Sheet.Header>
              <div style={{ padding: '24px 0', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: 700 }}>350</div>
                <div style={{ color: 'var(--color-muted)', fontSize: '14px' }}>CALORIES/DAY</div>
              </div>
              <Sheet.Footer>
                <Button style={{ width: '100%' }}>Submit</Button>
              </Sheet.Footer>
            </Sheet.Content>
          </Sheet.Root>
        </div>
      </div>

      {/* Tooltip Showcase */}
      <div className="showcase-card">
        <h3 className="showcase-title">Tooltip & Popover</h3>
        <p className="showcase-description">
          Small overlays that show additional information on hover or click.
        </p>
        <div className="showcase-demo">
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Button variant="secondary" title="Add to library">
              Hover for tooltip
            </Button>
            <Button variant="secondary">
              Click for popover
            </Button>
          </div>
          <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginTop: '12px' }}>
            Full Tooltip and Popover demos require additional integration.
            These components provide contextual information and actions.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
