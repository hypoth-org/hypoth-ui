import Link from "next/link";

interface UpgradePageProps {
  searchParams: Promise<{
    component?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function EditionUpgradePage({ searchParams }: UpgradePageProps) {
  const params = await searchParams;
  const componentId = params.component ?? "this component";
  const fromEdition = params.from ?? "core";
  const toEdition = params.to ?? "enterprise";

  return (
    <div className="upgrade-page">
      <div className="upgrade-card">
        <div className="upgrade-icon">🔒</div>
        <h1>Upgrade Required</h1>
        <p className="upgrade-message">
          The <strong>{componentId}</strong> component is only available in the{" "}
          <span className="edition-badge">{toEdition}</span> edition.
        </p>
        <p className="current-edition">
          Your current edition: <span className="edition-badge secondary">{fromEdition}</span>
        </p>

        <div className="upgrade-benefits">
          <h2>What&apos;s included in {toEdition}?</h2>
          <ul>
            {toEdition === "pro" && (
              <>
                <li>All Core components</li>
                <li>Advanced data visualization components</li>
                <li>Form builder components</li>
                <li>Priority support</li>
              </>
            )}
            {toEdition === "enterprise" && (
              <>
                <li>All Core and Pro components</li>
                <li>Enterprise security components</li>
                <li>Audit logging components</li>
                <li>Custom branding support</li>
                <li>Dedicated support team</li>
              </>
            )}
          </ul>
        </div>

        <div className="upgrade-actions">
          <a href="/pricing" className="btn btn-primary">
            View Pricing
          </a>
          <Link href="/" className="btn btn-secondary">
            Back to Documentation
          </Link>
        </div>
      </div>

      <style jsx>{`
        .upgrade-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 2rem;
        }

        .upgrade-card {
          max-width: 500px;
          background: var(--ds-surface-secondary, #f8f9fa);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .upgrade-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        h1 {
          margin: 0 0 1rem;
          font-size: 1.75rem;
        }

        .upgrade-message {
          font-size: 1.1rem;
          color: var(--ds-text-secondary, #666);
          margin-bottom: 0.5rem;
        }

        .current-edition {
          color: var(--ds-text-muted, #888);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .edition-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: var(--ds-primary, #6366f1);
          color: white;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .edition-badge.secondary {
          background: var(--ds-surface-tertiary, #e9ecef);
          color: var(--ds-text-primary, #333);
        }

        .upgrade-benefits {
          text-align: left;
          margin: 1.5rem 0;
          padding: 1rem;
          background: var(--ds-surface-primary, #fff);
          border-radius: 8px;
        }

        .upgrade-benefits h2 {
          font-size: 1rem;
          margin: 0 0 0.75rem;
        }

        .upgrade-benefits ul {
          margin: 0;
          padding-left: 1.25rem;
        }

        .upgrade-benefits li {
          margin: 0.5rem 0;
          color: var(--ds-text-secondary, #666);
        }

        .upgrade-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 1.5rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-primary {
          background: var(--ds-primary, #6366f1);
          color: white;
        }

        .btn-primary:hover {
          background: var(--ds-primary-hover, #5558e8);
        }

        .btn-secondary {
          background: var(--ds-surface-tertiary, #e9ecef);
          color: var(--ds-text-primary, #333);
        }

        .btn-secondary:hover {
          background: var(--ds-surface-hover, #dee2e6);
        }
      `}</style>
    </div>
  );
}
