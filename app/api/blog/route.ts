import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { BlogPost } from "@/types";

const BLOG_BASE = "https://cjy3458.tistory.com";

function normalizeLink(url: string): string {
  return url.replace(/^http:\/\//i, "https://").replace(/\/+$/, "");
}

function decodeEntities(str: string): string {
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function stripHtml(html: string): string {
  return decodeEntities(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// ── RSS 파싱 (빠른 메타데이터, 최신 N개 한정) ────────────────────────────────
function extractTag(xml: string, tag: string): string {
  const cdata = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i");
  const normal = new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, "i");
  const m = xml.match(cdata) ?? xml.match(normal);
  return m ? m[1].trim() : "";
}

function parseRSS(xml: string): Omit<BlogPost, "image">[] {
  const posts: Omit<BlogPost, "image">[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(xml)) !== null) {
    const rawDesc = extractTag(m[1], "description");
    posts.push({
      title: extractTag(m[1], "title"),
      link: extractTag(m[1], "link"),
      description: stripHtml(rawDesc).slice(0, 120),
      pubDate: extractTag(m[1], "pubDate"),
    });
  }
  return posts;
}

// ── HTML 리스팅 페이지 스크래퍼 ───────────────────────────────────────────────
function scrapeListingPage(html: string): Omit<BlogPost, "image">[] {
  const posts: Omit<BlogPost, "image">[] = [];
  const seen = new Set<string>();

  // 게시글 링크: /숫자 또는 https://도메인/숫자 (카테고리·태그 제외)
  // 경로가 순수 숫자일 때만 매칭 — /category/123 은 걸러짐
  const linkRe = /href="((?:https:\/\/cjy3458\.tistory\.com)?\/(\d+))(?:[?#][^"]*)?"/gi;
  let m: RegExpExecArray | null;

  while ((m = linkRe.exec(html)) !== null) {
    const href = m[1];
    const id = parseInt(m[2]);
    if (id < 1) continue;

    const link = normalizeLink(href.startsWith("http") ? href : `${BLOG_BASE}${href}`);
    if (seen.has(link)) continue;
    seen.add(link);

    // 링크 주변 컨텍스트 (앞 600 + 뒤 800자)
    const s = Math.max(0, m.index - 600);
    const e = Math.min(html.length, m.index + 800);
    const ctx = html.slice(s, e);

    // 제목 추출 — 패턴 우선순위 순
    let title = "";
    const titlePatterns: RegExp[] = [
      /<h[2-4][^>]*>\s*(?:<[^>]+>)*\s*([^<\n]{3,150})/i,
      /class="[^"]*tit[^"]*"[^>]*>\s*([^<\n]{3,150})/i,
      /class="[^"]*title[^"]*"[^>]*>\s*([^<\n]{3,150})/i,
      /class="[^"]*subject[^"]*"[^>]*>\s*([^<\n]{3,150})/i,
      /<strong[^>]*>\s*([^<\n]{3,150})<\/strong>/i,
    ];
    for (const pat of titlePatterns) {
      const tm = ctx.match(pat);
      if (tm) {
        title = decodeEntities(tm[1].trim());
        if (title.length >= 3) break;
        else title = "";
      }
    }
    if (!title) continue;

    // 날짜 추출
    let pubDate = "";
    const dateM = ctx.match(/(\d{4}[.\-]\s*\d{1,2}[.\-]\s*\d{1,2})/);
    if (dateM) pubDate = dateM[1];

    // 설명 추출
    let description = "";
    const descPatterns: RegExp[] = [
      /class="[^"]*(?:desc|summary|preview|body|excerpt)[^"]*"[^>]*>\s*([^<]{15,300})/i,
      /<p[^>]*>\s*([^<]{15,300})/i,
    ];
    for (const pat of descPatterns) {
      const dm = ctx.match(pat);
      if (dm) {
        description = stripHtml(dm[1]).slice(0, 120);
        break;
      }
    }

    posts.push({ link, title, pubDate, description });
  }

  return posts;
}

// ── 전체 포스트 메타데이터 수집 ────────────────────────────────────────────────
async function fetchAllPostMeta(): Promise<Omit<BlogPost, "image">[]> {
  const allPosts: Omit<BlogPost, "image">[] = [];
  const seenLinks = new Set<string>();

  // 1단계: RSS로 최신 포스트 빠르게 수집
  try {
    const rssRes = await fetch(`${BLOG_BASE}/rss`, {
      next: { revalidate: 432000 },
    });
    if (rssRes.ok) {
      for (const p of parseRSS(await rssRes.text())) {
        const key = normalizeLink(p.link);
        if (!seenLinks.has(key)) {
          seenLinks.add(key);
          allPosts.push({ ...p, link: key });
        }
      }
    }
  } catch { /* ignore */ }

  // 2단계: 리스팅 페이지를 배치(5페이지씩 병렬)로 스크래핑
  const BATCH = 5;
  for (let batchStart = 1; batchStart <= 200; batchStart += BATCH) {
    const pages = Array.from({ length: BATCH }, (_, i) => batchStart + i);

    const results = await Promise.all(
      pages.map(async (page) => {
        const url = page === 1 ? `${BLOG_BASE}/` : `${BLOG_BASE}/?page=${page}`;
        try {
          const res = await fetch(url, {
            next: { revalidate: 432000 },
            headers: { "User-Agent": "Mozilla/5.0 (compatible; portfolio-bot/1.0)" },
          });
          return res.ok ? scrapeListingPage(await res.text()) : [];
        } catch {
          return [];
        }
      })
    );

    let hadNew = false;
    for (const pagePosts of results) {
      for (const p of pagePosts) {
        const key = normalizeLink(p.link);
        if (!seenLinks.has(key)) {
          seenLinks.add(key);
          allPosts.push({ ...p, link: key });
          hadNew = true;
        }
      }
    }

    if (!hadNew) break; // 새 포스트 없으면 종료
  }

  return allPosts;
}

// ── og:image fetch ─────────────────────────────────────────────────────────────
async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 432000 },
      headers: { "User-Agent": "Mozilla/5.0 (compatible; portfolio-bot/1.0)" },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const m =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

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
