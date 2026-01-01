import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { parseFrontmatterFromFile } from "@ds/docs-core";
import { MdxRenderer } from "@ds/docs-renderer-next/components/mdx-renderer";
import { notFound } from "next/navigation";

interface GuidePageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate static params for all guides
export async function generateStaticParams() {
  try {
    const guidesDir = join(process.cwd(), "../../packages/docs-content/guides");
    const files = await readdir(guidesDir);
    return files.filter((f) => f.endsWith(".mdx")).map((f) => ({ id: f.replace(".mdx", "") }));
  } catch {
    return [{ id: "getting-started" }, { id: "theming" }];
  }
}

export async function generateMetadata({ params }: GuidePageProps) {
  const { id } = await params;

  try {
    const guidePath = join(process.cwd(), "../../packages/docs-content/guides", `${id}.mdx`);
    const { frontmatter } = await parseFrontmatterFromFile(guidePath);

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

  let mdxContent: string;

  try {
    const guidePath = join(process.cwd(), "../../packages/docs-content/guides", `${id}.mdx`);
    mdxContent = await readFile(guidePath, "utf-8");
  } catch {
    notFound();
  }

  return (
    <article className="guide-page">
      <MdxRenderer source={mdxContent} />
    </article>
  );
}
