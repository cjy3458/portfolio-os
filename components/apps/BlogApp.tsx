"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FileImage, RefreshCw, Rss } from "lucide-react";
import { BlogPost } from "@/types";
import { useOsStore } from "@/store/osStore";
import AppHeader from "@/components/ui/AppHeader";
import OsButton from "@/components/ui/OsButton";
import OsCard from "@/components/ui/OsCard";
import ErrorBox from "@/components/ui/ErrorBox";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import SkeletonCard from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";

const PAGE_SIZE = 5;

// 세션 내 영구 상태 — 블로그 창을 닫았다 열어도 유지
const postCache = new Map<number, BlogPost[]>();
let cachedTotal: number | null = null;
let persistedPosts: BlogPost[] = [];
let persistedOffset: number = 0;
let persistedHasMore: boolean = true;

function formatDate(raw: string): string {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "short", day: "numeric" });
}

export default function BlogApp() {
  const [posts, setPosts] = useState<BlogPost[]>(persistedPosts);
  const [offset, setOffset] = useState(persistedOffset);
  const [hasMore, setHasMore] = useState(persistedHasMore);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(persistedPosts.length === 0);
  const [error, setError] = useState<string | null>(null);
  const openBrowser = useOsStore((s) => s.openBrowser);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => { persistedPosts = posts; }, [posts]);
  useEffect(() => { persistedOffset = offset; }, [offset]);
  useEffect(() => { persistedHasMore = hasMore; }, [hasMore]);

  const fetchPage = useCallback(async (pageOffset: number, replace = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (postCache.has(pageOffset)) {
      const cached = postCache.get(pageOffset)!;
      const newHasMore = cachedTotal == null || pageOffset + PAGE_SIZE < cachedTotal;
      if (replace) {
        setPosts(cached);
      } else {
        setPosts((prev) => {
          const seen = new Set(prev.map((p) => p.link));
          return [...prev, ...cached.filter((p) => !seen.has(p.link))];
        });
      }
      setOffset(pageOffset + PAGE_SIZE);
      setHasMore(newHasMore);
      setLoading(false);
      setInitialLoading(false);
      isFetchingRef.current = false;
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/blog?offset=${pageOffset}&limit=${PAGE_SIZE}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const { posts: newPosts, total, hasMore: more } = data;
      postCache.set(pageOffset, newPosts);
      cachedTotal = total;

      if (replace) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => {
          const seen = new Set(prev.map((p) => p.link));
          return [...prev, ...newPosts.filter((p: BlogPost) => !seen.has(p.link))];
        });
      }
      setOffset(pageOffset + PAGE_SIZE);
      setHasMore(more);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
      setInitialLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (persistedPosts.length === 0) fetchPage(0);
  }, [fetchPage]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
          fetchPage(offset);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [offset, hasMore, fetchPage]);

  const handleRefresh = () => {
    postCache.clear();
    cachedTotal = null;
    persistedPosts = [];
    persistedOffset = 0;
    persistedHasMore = true;
    setPosts([]);
    setOffset(0);
    setHasMore(true);
    setInitialLoading(true);
    setError(null);
    fetchPage(0, true);
  };

  return (
    <div className="p-4 font-mono h-full flex flex-col">
      <AppHeader
        icon={<Rss size={16} />}
        title="cjy3458.tistory.com"
        action={
          <OsButton size="icon" onClick={handleRefresh} title="새로고침">
            <RefreshCw size={14} className={initialLoading ? "animate-spin" : ""} />
          </OsButton>
        }
      />

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {initialLoading && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {error && <ErrorBox message={error} onRetry={handleRefresh} />}

        {!initialLoading && !error && posts.length === 0 && (
          <EmptyState message="게시글을 찾을 수 없습니다." />
        )}

        {posts.map((post, i) => (
          <OsCard key={post.link || i} onClick={() => openBrowser(post)}>
            <div className="flex gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-sm leading-snug group-hover:underline line-clamp-2 mb-1">
                  {post.title}
                </h3>
                {post.description && (
                  <p className="text-xs text-gray-600 leading-relaxed mb-2 line-clamp-2">
                    {post.description}
                  </p>
                )}
                <p className="text-xs text-gray-400 font-bold">{formatDate(post.pubDate)}</p>
              </div>
              <div className="shrink-0 w-20 h-16 border-2 border-black overflow-hidden bg-gray-100 flex items-center justify-center">
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={80}
                    height={64}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                ) : (
                  <FileImage size={20} className="text-gray-300" />
                )}
              </div>
            </div>
          </OsCard>
        ))}

        <div ref={sentinelRef} className="h-1" />

        {loading && !initialLoading && <LoadingSpinner size={18} />}

        {!hasMore && posts.length > 0 && (
          <p className="text-xs text-gray-400 text-center py-3 font-bold">
            — 모든 글을 불러왔습니다 —
          </p>
        )}
      </div>
    </div>
  );
}
