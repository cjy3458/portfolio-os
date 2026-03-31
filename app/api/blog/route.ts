import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { BlogPost } from "@/types";
import { fetchAllPostMeta, fetchOgImage } from "@/lib/blog-utils";

const getCachedPostMeta = unstable_cache(
  fetchAllPostMeta,
  ["blog-post-meta"],
  { revalidate: 432000 }
);

// ── Route Handler ─────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const offset = Math.max(0, parseInt(searchParams.get("offset") ?? "0", 10));
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") ?? "5", 10)));

    const allRaw = await getCachedPostMeta();
    const total = allRaw.length;
    const slice = allRaw.slice(offset, offset + limit);

    // 요청 슬라이스만 og:image 병렬 fetch
    const posts: BlogPost[] = await Promise.all(
      slice.map(async (post) => ({
        ...post,
        image: await fetchOgImage(post.link),
      }))
    );

    return NextResponse.json({ posts, total, hasMore: offset + limit < total });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
