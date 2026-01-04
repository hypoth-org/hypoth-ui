import type { Edition } from "@ds/docs-core";
import Link from "next/link";
import { UpgradePrompt } from "../../components/upgrade/upgrade-prompt";
import { getEditionConfig } from "../../lib/content-resolver";

interface UpgradePageProps {
  searchParams: Promise<{
    component?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function EditionUpgradePage({ searchParams }: UpgradePageProps) {
  const params = await searchParams;
  const componentId = params.component;
  const fromEdition = (params.from ?? "core") as Edition;
  const toEdition = (params.to ?? "enterprise") as Edition;

  // Load upgrade config from edition config
  const config = await getEditionConfig();

  return (
    <div className="upgrade-page">
      <UpgradePrompt
        currentEdition={fromEdition}
        requiredEdition={toEdition}
        upgradeConfig={config.upgrade}
        itemName={componentId}
        componentId={componentId}
        variant="full-page"
      />

      <div className="upgrade-actions">
        <Link href="/" className="btn btn-secondary">
          Back to Documentation
        </Link>
      </div>

      <style jsx>{`
        .upgrade-page {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 2rem;
          gap: 2rem;
        }

        .upgrade-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
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
