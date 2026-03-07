'use client';

import { Alert, Progress, Spinner, Skeleton, useToast } from '@hypoth-ui/react/client';
import { DsButton as Button } from '@hypoth-ui/react/client';
import { feedbackSectionContent } from '@hypoth-ui/demo-shared';
import { SidebarNav } from '../../components/sidebar-nav';
import { AppShell } from '../../components/app-shell';
import { ThemeToggle } from '../../components/theme-toggle';

export default function FeedbackPage() {
  const { toast } = useToast();

  const showToast = (variant: 'info' | 'success' | 'error') => {
    toast({
      title: variant === 'success' ? 'Success!' : variant === 'error' ? 'Error' : 'Notification',
      description: `This is a ${variant} toast message.`,
      variant,
    });
  };

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
        <span className="breadcrumb-current" aria-current="page">Feedback</span>
      </nav>
      <div className="page-header">
        <h2 className="page-title">{feedbackSectionContent.title}</h2>
        <p className="page-description">{feedbackSectionContent.description}</p>
      </div>

      {/* Alert Showcase */}
      <div className="showcase-card">
        <h3 className="showcase-title">Alert</h3>
        <p className="showcase-description">
          A message box for important information.
        </p>
        <div className="showcase-demo">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Alert variant="info">
              This is an informational alert message.
            </Alert>
            <Alert variant="success">
              Your changes have been saved successfully.
            </Alert>
            <Alert variant="warning">
              Please review your input before continuing.
            </Alert>
            <Alert variant="error">
              An error occurred. Please try again later.
            </Alert>
          </div>
        </div>
      </div>

      {/* Toast Showcase */}
      <div className="showcase-card">
        <h3 className="showcase-title">Toast</h3>
        <p className="showcase-description">
          A brief notification that appears temporarily.
        </p>
        <div className="showcase-demo">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button onClick={() => showToast('info')}>
              Info Toast
            </Button>
            <Button variant="secondary" onClick={() => showToast('success')}>
              Success Toast
            </Button>
            <Button variant="destructive" onClick={() => showToast('error')}>
              Error Toast
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Showcase */}
      <div className="showcase-card">
        <h3 className="showcase-title">Progress</h3>
        <p className="showcase-description">
          A visual indicator of completion status.
        </p>
        <div className="showcase-demo">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px' }}>25% Complete</div>
              <Progress value={25} />
            </div>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px' }}>50% Complete</div>
              <Progress value={50} />
            </div>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px' }}>75% Complete</div>
              <Progress value={75} />
            </div>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px' }}>100% Complete</div>
              <Progress value={100} />
            </div>
          </div>
        </div>
      </div>

      {/* Spinner Showcase */}
      <div className="showcase-card">
        <h3 className="showcase-title">Spinner</h3>
        <p className="showcase-description">
          A loading indicator for async operations.
        </p>
        <div className="showcase-demo">
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
        </div>
      </div>

      {/* Skeleton Showcase */}
      <div className="showcase-card">
        <h3 className="showcase-title">Skeleton</h3>
        <p className="showcase-description">
          A placeholder for loading content.
        </p>
        <div className="showcase-demo">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Skeleton variant="circular" customWidth="48px" customHeight="48px" />
              <div style={{ flex: 1 }}>
                <Skeleton variant="text" width="3/4" size="sm" style={{ marginBottom: '8px' }} />
                <Skeleton variant="text" width="1/2" size="xs" />
              </div>
            </div>
            <Skeleton variant="rectangular" width="full" customHeight="120px" />
            <Skeleton variant="text" width="full" size="xs" />
            <Skeleton variant="text" width="3/4" size="xs" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
