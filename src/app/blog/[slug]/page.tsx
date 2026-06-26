import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { PublicShell } from "@/components/layout/PublicShell";

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.blogPost.findFirst({
    where: { slug: params.slug, published: true },
  });
  if (!post) notFound();

  return (
    <PublicShell analytics={false}>
      <article className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-brand text-3xl text-text-primary">{post.title}</h1>
        {post.publishedAt && (
          <p className="mt-2 text-sm text-text-muted">
            {post.publishedAt.toLocaleDateString(post.locale === "ar" ? "ar-SY" : "en-US")}
          </p>
        )}
        <CircuitCard className="prose prose-invert mt-8 max-w-none whitespace-pre-wrap text-text-primary">
          {post.body}
        </CircuitCard>
      </article>
    </PublicShell>
  );
}
