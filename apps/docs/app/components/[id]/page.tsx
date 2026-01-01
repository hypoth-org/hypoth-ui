import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { loadManifestById } from "@ds/docs-core";
import { MdxRenderer } from "@ds/docs-renderer-next/components/mdx-renderer";
import { notFound } from "next/navigation";

interface ComponentPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate static params for all components
export async function generateStaticParams() {
  return [{ id: "button" }, { id: "input" }];
}

export async function generateMetadata({ params }: ComponentPageProps) {
  const { id } = await params;

  const manifestsDir = join(process.cwd(), "../../packages/docs-content/manifests");
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

  const manifestsDir = join(process.cwd(), "../../packages/docs-content/manifests");
  const manifest = await loadManifestById(manifestsDir, id);

  if (!manifest) {
    notFound();
  }

  // Try to load MDX content
  let mdxContent: string | null = null;
  try {
    const mdxPath = join(process.cwd(), "../../packages/docs-content/components", `${id}.mdx`);
    mdxContent = await readFile(mdxPath, "utf-8");
  } catch {
    // No MDX file found
  }

  return (
    <article className="component-page">
      <header className="component-header">
        <div className="component-status" data-status={manifest.status}>
          {manifest.status}
        </div>
        <h1>{manifest.name}</h1>
        {manifest.description && <p className="component-description">{manifest.description}</p>}
      </header>

      {mdxContent ? (
        <MdxRenderer source={mdxContent} />
      ) : (
        <div className="component-auto-docs">
          <section>
            <h2>Usage</h2>
            <pre>
              <code>{`<ds-${id}></ds-${id}>`}</code>
            </pre>
          </section>

          {manifest.props && manifest.props.length > 0 && (
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
                  {manifest.props.map((prop) => (
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

          {manifest.examples && manifest.examples.length > 0 && (
            <section>
              <h2>Examples</h2>
              {manifest.examples.map((example) => (
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
  );
}
