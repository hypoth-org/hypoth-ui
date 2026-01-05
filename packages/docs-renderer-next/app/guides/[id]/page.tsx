import { readFile } from "node:fs/promises";
import { parseFrontmatter } from "@ds/docs-core";
import { notFound } from "next/navigation";
import { MdxRenderer } from "../../../components/mdx-renderer";
import { discoverGuides, resolveContentFile } from "../../../lib/content-resolver";

interface GuidePageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate static params for all guides from content packs
export async function generateStaticParams() {
  try {
    const guides = await discoverGuides();
    return guides.map(({ id }) => ({ id }));
  } catch {
    return [{ id: "getting-started" }, { id: "theming" }];
  }
}

export async function generateMetadata({ params }: GuidePageProps) {
  const { id } = await params;

  try {
    const resolved = await resolveContentFile(`guides/${id}.mdx`);
    if (!resolved) {
      return { title: "Guide Not Found" };
    }

    const content = await readFile(resolved.resolvedPath, "utf-8");
    const { frontmatter } = parseFrontmatter(content);

    return {
      title: frontmatter.title,
      description: frontmatter.description,
    };
  } catch {
    return { title: "Guide Not Found" };
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { id } = await params;

  // Resolve guide content through overlay chain
  const resolved = await resolveContentFile(`guides/${id}.mdx`);

  if (!resolved) {
    notFound();
  }

  let mdxContent: string;

  try {
    mdxContent = await readFile(resolved.resolvedPath, "utf-8");
  } catch {
    notFound();
  }

  return (
    <article className="guide-page">
      <MdxRenderer source={mdxContent} />
    </article>
  );
}
