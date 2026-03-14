/**
 * Demo WC Entry Point
 * Registers custom elements and initializes the application
 */

// Import fonts and design system styles
import '../styles/fonts.css';
import '@hypoth-ui/tokens/css';
import '@hypoth-ui/css';
import '../styles/globals.css';

// Import theme utilities
import { initializeTheme, listenForSystemThemeChanges } from './utils/theme';

// Import custom elements
import './components/app-shell';
import './components/sidebar-nav';
import './components/theme-toggle';
import './components/mobile-nav';
import './pages/dashboard';
import './pages/overlays';
import './pages/forms';
import './pages/data-display';
import './pages/feedback';

// Initialize theme
initializeTheme();
listenForSystemThemeChanges();

// Simple hash router
type Route = 'dashboard' | 'forms' | 'data-display' | 'overlays' | 'feedback';

const routes: Route[] = ['dashboard', 'forms', 'data-display', 'overlays', 'feedback'];

function getRouteFromHash(): Route {
  const hash = location.hash.slice(1) || 'dashboard';
  return routes.includes(hash as Route) ? (hash as Route) : 'dashboard';
}

function getPageContent(route: Route): string {
  switch (route) {
    case 'dashboard':
      return '<demo-page-dashboard></demo-page-dashboard>';
    case 'overlays':
      return '<demo-page-overlays></demo-page-overlays>';
    case 'forms':
      return '<demo-page-forms></demo-page-forms>';
    case 'data-display':
      return '<demo-page-data-display></demo-page-data-display>';
    case 'feedback':
      return '<demo-page-feedback></demo-page-feedback>';
  }
}

function renderApp(route: Route) {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <demo-app-shell>
      <demo-sidebar-nav slot="sidebar" currentRoute="${route}"></demo-sidebar-nav>
      <div slot="header" style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
        <demo-mobile-nav currentRoute="${route}"></demo-mobile-nav>
        <h1 style="font-size: 18px; font-weight: 600;">Demo - Web Components</h1>
        <demo-theme-toggle></demo-theme-toggle>
      </div>
      <div id="page-content">
        ${getPageContent(route)}
      </div>
    </demo-app-shell>
  `;
}

// Initial render
renderApp(getRouteFromHash());

// Listen for hash changes
window.addEventListener('hashchange', () => {
  renderApp(getRouteFromHash());
});

