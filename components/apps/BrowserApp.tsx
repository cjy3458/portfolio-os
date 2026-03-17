"use client";

import { useRef, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { useOsStore } from "@/store/osStore";
import OsButton from "@/components/ui/OsButton";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import BrowserToolbar from "@/components/ui/BrowserToolbar";

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function BrowserApp() {
  const post = useOsStore((s) => s.selectedBlogPost);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [currentUrl, setCurrentUrl] = useState(post?.link ?? "");
  const [inputUrl, setInputUrl] = useState(post?.link ?? "");
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(!!post?.link);
  const [blocked, setBlocked] = useState(false);
  const [prevPostLink, setPrevPostLink] = useState(post?.link ?? "");

  // 스토어에서 새 글이 선택되면 URL 동기화 (렌더 중 derived state 패턴)
  if (post?.link && post.link !== prevPostLink) {
    setPrevPostLink(post.link);
    setCurrentUrl(post.link);
    setInputUrl(post.link);
    setIsLoading(true);
    setBlocked(false);
    setIframeKey((k) => k + 1);
  }

  const navigate = (url: string) => {
    const normalized = normalizeUrl(url);
    if (!normalized) return;
    setCurrentUrl(normalized);
    setInputUrl(normalized);
    setIsLoading(true);
    setBlocked(false);
    setIframeKey((k) => k + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      navigate(inputUrl);
      inputRef.current?.blur();
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setBlocked(false);
    setIframeKey((k) => k + 1);
  };

  const handleLoad = () => {
    setIsLoading(false);
    try {
      const doc = iframeRef.current?.contentDocument;
      if (doc && doc.URL !== "about:blank" && !doc.body?.innerHTML) {
        setBlocked(true);
      }
    } catch {
      // cross-origin 접근 실패 = 정상 로드로 간주
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setBlocked(true);
  };

  if (!post && !currentUrl) {
    return (
      <div className="flex items-center justify-center h-full font-mono text-gray-400 text-sm">
        블로그 글을 선택해주세요.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full font-mono">
      <BrowserToolbar
        inputUrl={inputUrl}
        isLoading={isLoading}
        currentUrl={currentUrl}
        onInputChange={setInputUrl}
        onKeyDown={handleKeyDown}
        onRefresh={handleRefresh}
        inputRef={inputRef}
      />

      {/* iframe 영역 */}
      <div className="flex-1 relative overflow-hidden bg-white">
        {isLoading && <LoadingSpinner overlay label="로딩 중..." />}

        {blocked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <X size={32} className="text-gray-300" />
            <p className="font-black text-sm">[ 미리보기 차단됨 ]</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              이 페이지는 외부 삽입을 허용하지 않습니다.
            </p>
            <OsButton href={currentUrl} size="md" target="_blank" rel="noopener noreferrer">
              <ExternalLink size={12} />
              새 탭에서 열기
            </OsButton>
          </div>
        ) : (
          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={currentUrl}
            className="w-full h-full border-none"
            onLoad={handleLoad}
            onError={handleError}
            title={post?.title ?? currentUrl}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        )}
      </div>
    </div>
  );
}
