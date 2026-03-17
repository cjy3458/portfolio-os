"use client";

import { RefreshCw, ExternalLink } from "lucide-react";
import OsButton from "@/components/ui/OsButton";
import OsInput from "@/components/ui/OsInput";

interface BrowserToolbarProps {
  inputUrl: string;
  isLoading: boolean;
  currentUrl: string;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRefresh: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function BrowserToolbar({
  inputUrl,
  isLoading,
  currentUrl,
  onInputChange,
  onKeyDown,
  onRefresh,
  inputRef,
}: BrowserToolbarProps) {
  return (
    <div className="shrink-0 border-b-2 border-black bg-white px-2 py-1.5 flex items-center gap-2">
      <OsButton size="icon" onClick={onRefresh} title="새로고침">
        <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
      </OsButton>

      <OsInput
        ref={inputRef}
        type="text"
        value={inputUrl}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={(e) => (e.target as HTMLInputElement).select()}
        placeholder="주소를 입력하고 Enter"
        spellCheck={false}
      />

      <OsButton
        href={currentUrl}
        size="icon"
        target="_blank"
        rel="noopener noreferrer"
        title="새 탭에서 열기"
        className="shrink-0"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <ExternalLink size={13} />
      </OsButton>
    </div>
  );
}
