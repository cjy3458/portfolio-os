"use client";

import { useEffect, useState } from "react";
import { Clock, Menu } from "lucide-react";
import { APPS } from "@/config/apps";
import { useOsStore } from "@/store/osStore";
import StartMenu from "./StartMenu";

const formatTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function Taskbar() {
  // ✅ 개별 selector — 구독한 값이 바뀔 때만 리렌더
  const openWindows = useOsStore((s) => s.openWindows);
  const focusedWindowId = useOsStore((s) => s.focusedWindowId);
  const startMenuOpen = useOsStore((s) => s.startMenuOpen);
  const focusWindow = useOsStore((s) => s.focusWindow);
  const toggleStartMenu = useOsStore((s) => s.toggleStartMenu);
  const closeStartMenu = useOsStore((s) => s.closeStartMenu);

  // ✅ Date 객체 대신 포맷된 문자열만 저장 — hydration mismatch 방지
  const [timeStr, setTimeStr] = useState<string | null>(null);

  useEffect(() => {
    // SSR hydration을 위해 null 초기값 사용 → 클라이언트에서만 시간 설정
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeStr(formatTime());
    const timer = setInterval(() => setTimeStr(formatTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="absolute bottom-0 left-0 w-full h-12 bg-white border-t-2 border-black flex items-center px-2 justify-between z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]"
      onClick={closeStartMenu}
    >
      {startMenuOpen && <StartMenu />}

      {/* Left: Start button + open app tabs */}
      <div className="flex gap-2 h-full items-center py-1.5 flex-1 overflow-x-auto pr-4 no-scrollbar">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleStartMenu();
          }}
          className={`h-full px-4 border-2 border-black font-black flex items-center gap-2 uppercase text-sm shrink-0 ${
            startMenuOpen
              ? "bg-black text-white shadow-inner"
              : "bg-white hover:bg-gray-100 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-px hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all"
          }`}
        >
          <Menu size={18} />
          <span className="hidden sm:inline">START</span>
        </button>

        <div className="w-px h-full bg-gray-300 mx-1 shrink-0" />

        {openWindows.map((win) => {
          const app = APPS[win.id];
          if (!app) return null;
          return (
            <button
              key={win.id}
              onClick={() => focusWindow(win.id)}
              className={`h-full px-3 sm:px-4 border-2 border-black flex items-center gap-2 text-xs sm:text-sm font-bold truncate max-w-37.5 sm:max-w-xs transition-all shrink-0 ${
                focusedWindowId === win.id
                  ? "bg-gray-200 shadow-inner translate-y-px"
                  : "bg-white hover:bg-gray-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              }`}
            >
              <app.icon size={14} className="shrink-0" />
              <span className="truncate hidden sm:inline">{app.title}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Clock */}
      <div className="flex items-center gap-3 px-3 border-l-2 border-black h-full shrink-0">
        <span className="text-xs sm:text-sm font-bold uppercase hidden sm:flex items-center gap-1">
          <Clock size={14} />
          {timeStr ?? "--:--"}
        </span>
        <span className="w-3 h-3 bg-black rounded-full animate-pulse" />
      </div>
    </div>
  );
}
