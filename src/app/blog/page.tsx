import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { PublicShell } from "@/components/layout/PublicShell";

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  let posts: Awaited<ReturnType<typeof prisma.blogPost.findMany>> = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 20,
    });
  } catch {
    // DB may be offline
  }
  return (
    <PublicShell analytics={false}>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-brand text-3xl text-text-primary">المدونة</h1>
        <p className="mt-2 text-text-secondary">أخبار TENEGTA Spark ونصائح للصناع والرعاة</p>
        <div className="mt-8 space-y-4">
          {posts.length === 0 ? (
            <CircuitCard>
              <p className="text-text-secondary">لا منشورات بعد — ترقب المحتوى قريباً.</p>
            </CircuitCard>
          ) : (
            posts.map((post) => (
              <CircuitCard key={post.id}>
                <Link href={`/blog/${post.slug}`} className="block hover:text-gold-rich">
                  <h2 className="text-lg text-text-primary">{post.title}</h2>
                  {post.excerpt && <p className="mt-1 text-sm text-text-secondary">{post.excerpt}</p>}
                </Link>
              </CircuitCard>
            ))
          )}
        </div>
      </div>
    </PublicShell>
  );
}
