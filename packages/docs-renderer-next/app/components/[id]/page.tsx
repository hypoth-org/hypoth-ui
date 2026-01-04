import { readFile } from "node:fs/promises";
import {
  type ComponentAccessibility,
  type ComponentStatus,
  type ContractManifest,
  type Edition,
  getMinimumEdition,
  isComponentAvailable,
} from "@ds/docs-core";
import {
  getEditionConfig,
  loadManifestsFromPacks,
  loadManifestByIdFromPacks,
  resolveContentFile,
} from "../../../lib/content-resolver";

/**
 * Display manifest shape used for rendering component pages
 * Normalizes both ContractManifest and legacy ComponentManifest formats
 */
interface DisplayManifest {
  name: string;
  description: string;
  status: ComponentStatus;
  props: Array<{ name: string; type: string; default?: string; description: string }>;
  events: Array<{ name: string; description: string }>;
  examples: Array<{ title: string; code: string }>;
  tokensUsed: string[];
  accessibility?: ComponentAccessibility;
}
import { notFound, redirect } from "next/navigation";
import { MdxRenderer } from "../../../components/mdx-renderer";
import { EditionProvider } from "../../../components/mdx/edition";
import { TokensUsed } from "../../../components/tokens-used";

interface ComponentPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Get the current edition from environment or config
 */
async function getCurrentEdition(): Promise<Edition> {
  // Check environment variable first
  const envEdition = process.env.DS_EDITION;
  if (envEdition && ["core", "pro", "enterprise"].includes(envEdition)) {
    return envEdition as Edition;
  }

  // Fall back to edition config from content resolver
  try {
    const config = await getEditionConfig();
    return config.edition;
  } catch {
    return "enterprise"; // Default to enterprise (shows all)
  }
}

/**
 * Load contract manifests from content packs with overlay resolution
 */
async function loadContractManifests(): Promise<ContractManifest[]> {
  return loadManifestsFromPacks();
}

/**
 * Generate static params for all components available in the current edition
 */
export async function generateStaticParams() {
  const edition = await getCurrentEdition();
  const manifests = await loadContractManifests();

  // Filter by edition
  const availableComponents = manifests.filter((manifest) =>
    isComponentAvailable(manifest.editions, edition)
  );

  return availableComponents.map((manifest) => ({
    id: manifest.id,
  }));
}

export async function generateMetadata({ params }: ComponentPageProps) {
  const { id } = await params;

  // Load manifest with overlay resolution
  const manifest = await loadManifestByIdFromPacks(id);

  if (!manifest) {
    return { title: "Component Not Found" };
  }

  return {
    title: manifest.name,
    description: manifest.description,
  };
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { id } = await params;
  const edition = await getCurrentEdition();

  // Try to load from contract manifests
  const manifests = await loadContractManifests();
  const contractManifest = manifests.find((m) => m.id === id);

  // Check edition access
  if (contractManifest) {
    const isAvailable = isComponentAvailable(contractManifest.editions, edition);

    if (!isAvailable) {
      // Redirect to upgrade page
      const requiredEdition = getMinimumEdition(contractManifest.editions);
      redirect(`/edition-upgrade?component=${id}&from=${edition}&to=${requiredEdition}`);
    }
  }

  // Use overlay-resolved manifest or fall back to direct lookup
  const manifest = contractManifest ?? (await loadManifestByIdFromPacks(id));

  if (!manifest) {
    notFound();
  }

  // Load MDX content with overlay resolution
  let mdxContent: string | null = null;
  try {
    const resolved = await resolveContentFile(`components/${id}.mdx`);
    if (resolved) {
      mdxContent = await readFile(resolved.resolvedPath, "utf-8");
    }
  } catch {
    // No MDX file, use auto-generated content from manifest
  }

  // Normalize to DisplayManifest format for rendering
  // Contract manifests don't have props/events/examples (those come from MDX)
  const displayManifest: DisplayManifest = {
    name: manifest.name,
    description: manifest.description,
    status: manifest.status,
    props: [],
    events: [],
    examples: [],
    tokensUsed: manifest.tokensUsed ?? [],
    accessibility: manifest.accessibility,
  };

  return (
    <EditionProvider edition={edition}>
      <article className="component-page">
        <header className="component-header">
          <div className="component-status" data-status={displayManifest.status}>
            {displayManifest.status}
          </div>
          <h1>{displayManifest.name}</h1>
          {displayManifest.description && (
            <p className="component-description">{displayManifest.description}</p>
          )}
        </header>

        {displayManifest.tokensUsed.length > 0 && (
          <TokensUsed tokens={displayManifest.tokensUsed} />
        )}

        {displayManifest.accessibility && (
          <section className="component-accessibility">
            <h2>Accessibility</h2>
            <dl className="accessibility-details">
              <div className="accessibility-item">
                <dt>APG Pattern</dt>
                <dd>
                  <a
                    href={`https://www.w3.org/WAI/ARIA/apg/patterns/${displayManifest.accessibility.apgPattern.toLowerCase().replace(/\s+/g, "-")}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {displayManifest.accessibility.apgPattern}
                  </a>
                </dd>
              </div>
              {displayManifest.accessibility.keyboard.length > 0 && (
                <div className="accessibility-item">
                  <dt>Keyboard Interactions</dt>
                  <dd>
                    <ul className="keyboard-list">
                      {displayManifest.accessibility.keyboard.map((interaction) => (
                        <li key={interaction}>{interaction}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
              <div className="accessibility-item">
                <dt>Screen Reader</dt>
                <dd>{displayManifest.accessibility.screenReader}</dd>
              </div>
              {displayManifest.accessibility.ariaPatterns &&
                displayManifest.accessibility.ariaPatterns.length > 0 && (
                  <div className="accessibility-item">
                    <dt>ARIA Patterns</dt>
                    <dd>
                      <ul className="aria-list">
                        {displayManifest.accessibility.ariaPatterns.map((pattern) => (
                          <li key={pattern}>
                            <code>{pattern}</code>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              {displayManifest.accessibility.knownLimitations &&
                displayManifest.accessibility.knownLimitations.length > 0 && (
                  <div className="accessibility-item accessibility-item--warning">
                    <dt>Known Limitations</dt>
                    <dd>
                      <ul className="limitations-list">
                        {displayManifest.accessibility.knownLimitations.map((limitation) => (
                          <li key={limitation}>{limitation}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
            </dl>
          </section>
        )}

        {mdxContent ? (
          <MdxRenderer source={mdxContent} />
        ) : (
          <div className="component-auto-docs">
            {/* Auto-generated documentation from manifest */}
            <section>
              <h2>Usage</h2>
              <pre>
                <code>{`<ds-${id}></ds-${id}>`}</code>
              </pre>
            </section>

            {displayManifest.props && displayManifest.props.length > 0 && (
              <section>
                <h2>Properties</h2>
                <table className="props-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Default</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayManifest.props.map((prop) => (
                      <tr key={prop.name}>
                        <td>
                          <code>{prop.name}</code>
                        </td>
                        <td>
                          <code>{prop.type}</code>
                        </td>
                        <td>{prop.default ? <code>{prop.default}</code> : "—"}</td>
                        <td>{prop.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {displayManifest.events && displayManifest.events.length > 0 && (
              <section>
                <h2>Events</h2>
                <table className="events-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayManifest.events.map((event) => (
                      <tr key={event.name}>
                        <td>
                          <code>{event.name}</code>
                        </td>
                        <td>{event.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {displayManifest.examples && displayManifest.examples.length > 0 && (
              <section>
                <h2>Examples</h2>
                {displayManifest.examples.map((example) => (
                  <div key={example.title} className="example">
                    <h3>{example.title}</h3>
                    <pre>
                      <code>{example.code}</code>
                    </pre>
                  </div>
                ))}
              </section>
            )}
          </div>
        )}
      </article>
    </EditionProvider>
  );
}
