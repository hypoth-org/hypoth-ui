import { SidebarNav } from '../components/sidebar-nav';
import { AppShell } from '../components/app-shell';
import { ThemeToggle } from '../components/theme-toggle';

export default function DashboardPage() {
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
      <div className="page-header">
        <h2 className="page-title">Dashboard</h2>
        <p className="page-description">
          Welcome to the Hypoth UI demo application. Explore the sidebar navigation to see
          different component showcases.
        </p>
      </div>

      <div className="showcase-card">
        <h3 className="showcase-title">Component Overview</h3>
        <p className="showcase-description">
          This demo showcases the design system components in a realistic application layout.
          Each section demonstrates different component categories.
        </p>
        <div className="showcase-demo">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'var(--color-card)', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
              <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>Forms</h4>
              <p style={{ color: 'var(--color-muted)', fontSize: '14px' }}>
                Input fields, selects, checkboxes, and more.
              </p>
            </div>
            <div style={{ padding: '16px', background: 'var(--color-card)', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
              <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>Data Display</h4>
              <p style={{ color: 'var(--color-muted)', fontSize: '14px' }}>
                Tables, lists, cards, and data visualization.
              </p>
            </div>
            <div style={{ padding: '16px', background: 'var(--color-card)', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
              <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>Overlays</h4>
              <p style={{ color: 'var(--color-muted)', fontSize: '14px' }}>
                Dialogs, drawers, tooltips, and popovers.
              </p>
            </div>
            <div style={{ padding: '16px', background: 'var(--color-card)', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
              <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>Feedback</h4>
              <p style={{ color: 'var(--color-muted)', fontSize: '14px' }}>
                Alerts, toasts, progress indicators.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="showcase-card">
        <h3 className="showcase-title">Quick Stats</h3>
        <p className="showcase-description">
          Sample dashboard statistics using design system components.
        </p>
        <div className="showcase-demo">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 700 }}>24</div>
              <div style={{ color: 'var(--color-muted)', fontSize: '14px' }}>Components</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 700 }}>5</div>
              <div style={{ color: 'var(--color-muted)', fontSize: '14px' }}>Sections</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 700 }}>2</div>
              <div style={{ color: 'var(--color-muted)', fontSize: '14px' }}>Themes</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 700 }}>3</div>
              <div style={{ color: 'var(--color-muted)', fontSize: '14px' }}>Breakpoints</div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
