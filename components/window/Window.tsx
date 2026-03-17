"use client";

import { useState, useRef, useCallback } from "react";
import { Maximize2, X } from "lucide-react";
import { AppConfig } from "@/types";

interface WindowProps {
  app: AppConfig;
  zIndex: number;
  isFocused: boolean;
  onClose: (id: string) => void;
  onFocus: () => void;
}

export default function Window({
  app,
  zIndex,
  isFocused,
  onClose,
  onFocus,
}: WindowProps) {
  const [position, setPosition] = useState(app.defaultPosition);
  const [isMaximized, setIsMaximized] = useState(false);

  // ✅ UI 렌더링과 무관한 드래그 상태는 ref로 관리 — 불필요한 리렌더 제거
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      onFocus();
      if ((e.target as HTMLElement).closest(".window-header")) {
        isDraggingRef.current = true;
        const rect = windowRef.current!.getBoundingClientRect();
        dragOffsetRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      }
    },
    [onFocus],
  );

  // ✅ isMaximized만 dep — maximize 상태 변경 시에만 재생성
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current || isMaximized || !windowRef.current) return;

      const winWidth = windowRef.current.offsetWidth;
      const winHeight = windowRef.current.offsetHeight;
      const maxX = Math.max(0, window.innerWidth - winWidth);
      const maxY = Math.max(0, window.innerHeight - 48 - winHeight);

      setPosition({
        x: Math.max(0, Math.min(e.clientX - dragOffsetRef.current.x, maxX)),
        y: Math.max(0, Math.min(e.clientY - dragOffsetRef.current.y, maxY)),
      });
    },
    [isMaximized],
  );

  // ✅ dep 없음 — 마운트 이후 절대 재생성되지 않음
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  }, []);

  const style = isMaximized
    ? { top: 0, left: 0, width: "100%", height: "calc(100% - 48px)", zIndex }
    : {
        top: position.y,
        left: position.x,
        width: app.width,
        height: app.height,
        zIndex,
      };

  const AppComponent = app.component;

  return (
    <div
      ref={windowRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={style}
      className={`min-w-120 min-h-130 absolute border-2 border-black bg-white flex flex-col shadow-[4px_4px_0px_rgba(0,0,0,0.1)] ${
        isFocused ? "ring-2 ring-black/20" : ""
      } ${isMaximized ? "transition-all duration-200" : ""}`}
    >
      {/* Window Header */}
      <div className="window-header border-b-2 border-black px-3 py-1.5 flex items-center justify-between bg-black text-white cursor-move select-none touch-none shrink-0">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
          <app.icon size={16} />
          {app.title}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMaximized((v) => !v)}
            className="hover:text-gray-300 transition-colors"
            aria-label="최대화"
          >
            <Maximize2 size={16} />
          </button>
          <button
            onClick={() => onClose(app.id)}
            className="hover:text-red-400 transition-colors"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className=" flex-1 overflow-auto bg-white text-black relative">
        <AppComponent />
      </div>
    </div>
  );
}
