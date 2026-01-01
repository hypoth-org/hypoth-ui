import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  type ComponentManifest,
  type ComponentStatus,
  type ContractManifest,
  type Edition,
  getMinimumEdition,
  isComponentAvailable,
  loadEditionConfig,
  loadManifestById,
  loadValidManifests,
} from "@ds/docs-core";

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
}
import { notFound, redirect } from "next/navigation";
import { MdxRenderer } from "../../../components/mdx-renderer";
import { EditionProvider } from "../../../components/mdx/edition";

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

  // Fall back to edition config
  try {
    const { config } = await loadEditionConfig({
      configDir: process.cwd(),
    });
    return config.edition;
  } catch {
    return "enterprise"; // Default to enterprise (shows all)
  }
}

/**
 * Load contract manifests from the WC package
 */
async function loadContractManifests(): Promise<ContractManifest[]> {
  const wcPath = join(process.cwd(), "..", "wc");

  if (!existsSync(wcPath)) {
    // Try node_modules path for deployed apps
    const nodeModulesPath = join(process.cwd(), "node_modules/@ds/wc");
    if (existsSync(nodeModulesPath)) {
      const { manifests } = await loadValidManifests({
        rootDir: nodeModulesPath,
        pattern: "**/components/**/manifest.json",
      });
      return manifests;
    }
    return [];
  }

  const { manifests } = await loadValidManifests({
    rootDir: wcPath,
    pattern: "**/components/**/manifest.json",
  });
  return manifests;
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

  // Try to load from contract manifests first
  const manifests = await loadContractManifests();
  const contractManifest = manifests.find((m) => m.id === id);

  if (contractManifest) {
    return {
      title: contractManifest.name,
      description: contractManifest.description,
    };
  }

  // Fall back to legacy manifest loader
  const manifestsDir = join(process.cwd(), "node_modules/@ds/docs-content/manifests");
  const manifest = await loadManifestById(manifestsDir, id);

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

  // Fall back to legacy manifest loader
  const manifestsDir = join(process.cwd(), "node_modules/@ds/docs-content/manifests");
  const manifest = contractManifest || (await loadManifestById(manifestsDir, id));

  if (!manifest) {
    notFound();
  }

  // Try to load MDX content
  let mdxContent: string | null = null;
  try {
    const mdxPath = join(process.cwd(), "node_modules/@ds/docs-content/components", `${id}.mdx`);
    mdxContent = await readFile(mdxPath, "utf-8");
  } catch {
    // No MDX file, use auto-generated content from manifest
  }

  // Normalize to DisplayManifest format for rendering
  // Contract manifests don't have props/events/examples, legacy manifests do
  // When contractManifest is falsy, manifest must be ComponentManifest from loadManifestById
  const displayManifest: DisplayManifest = contractManifest
    ? {
        name: contractManifest.name,
        description: contractManifest.description,
        status: contractManifest.status,
        props: [],
        events: [],
        examples: [],
      }
    : {
        name: manifest.name,
        description: manifest.description ?? "",
        status: manifest.status,
        props: "props" in manifest ? (manifest.props ?? []) : [],
        events: "events" in manifest ? (manifest.events ?? []) : [],
        examples: "examples" in manifest ? (manifest.examples ?? []) : [],
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
