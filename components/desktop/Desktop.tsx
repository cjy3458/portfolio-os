"use client";

import { APPS, DESKTOP_APP_KEYS } from "@/config/apps";
import { useOsStore } from "@/store/osStore";
import BootScreen from "@/components/boot/BootScreen";
import DesktopIcon from "./DesktopIcon";
import Taskbar from "./Taskbar";
import Window from "@/components/window/Window";
import BackgroundAnimation from "./BackgroundAnimation";

export default function Desktop() {
  // ✅ 개별 selector — 구독한 값이 바뀔 때만 리렌더
  const isBooting = useOsStore((s) => s.isBooting);
  const openWindows = useOsStore((s) => s.openWindows);
  const focusedWindowId = useOsStore((s) => s.focusedWindowId);
  // ✅ Zustand 액션은 stable reference — useCallback 래퍼 불필요
  const setBootComplete = useOsStore((s) => s.setBootComplete);
  const closeApp = useOsStore((s) => s.closeApp);
  const focusWindow = useOsStore((s) => s.focusWindow);
  const closeStartMenu = useOsStore((s) => s.closeStartMenu);

  return (
    <>
      {isBooting && <BootScreen onComplete={setBootComplete} />}

      <div
        className="h-screen w-screen overflow-hidden bg-[#e5e5e5] font-mono selection:bg-black selection:text-white relative"
        onClick={closeStartMenu}
      >
        {/* Grid background overlay */}
        <div className="absolute inset-0 grid-bg z-0" />
        {/* Developer-themed animated background */}
        <BackgroundAnimation />

        {/* Desktop Icons */}
        <div className="relative h-[calc(100vh-48px)] w-full p-4 flex flex-col gap-4 flex-wrap content-start z-10">
          {DESKTOP_APP_KEYS.map((key) => (
            <DesktopIcon key={key} app={APPS[key]} />
          ))}
        </div>

        {/* Windows */}
        {openWindows.map((win) => {
          const app = APPS[win.id];
          if (!app) return null;
          return (
            <Window
              key={win.id}
              app={app}
              zIndex={win.zIndex}
              isFocused={focusedWindowId === win.id}
              onClose={closeApp}
              onFocus={() => focusWindow(win.id)}
            />
          );
        })}

        {/* Taskbar */}
        <Taskbar />
      </div>
    </>
  );
}
