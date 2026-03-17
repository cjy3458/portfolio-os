"use client";

import { User } from "lucide-react";
import { APPS, DESKTOP_APP_KEYS } from "@/config/apps";
import { useOsStore } from "@/store/osStore";

export default function StartMenu() {
  const openApp = useOsStore((s) => s.openApp);

  return (
    <div
      className="absolute bottom-12 left-0 w-64 bg-white border-t-2 border-r-2 border-black shadow-[4px_-4px_0px_rgba(0,0,0,0.1)] z-50 flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-black text-white p-3 font-black text-lg flex items-center gap-2">
        <User size={20} /> OS_MENU
      </div>
      <div className="p-2 flex flex-col gap-1">
        {DESKTOP_APP_KEYS.map((key) => {
          const app = APPS[key];
          return (
            <button
              key={key}
              onClick={() => openApp(key)}
              className="flex items-center gap-3 p-2 hover:bg-black hover:text-white font-bold text-sm uppercase w-full text-left transition-colors border border-transparent hover:border-black"
            >
              <app.icon size={16} /> {app.title}
            </button>
          );
        })}
      </div>
      <div className="border-t-2 border-black p-2 bg-gray-100 text-xs font-bold flex justify-between">
        <span>VERSION 1.0</span>
        <span className="text-gray-500">© 2026</span>
      </div>
    </div>
  );
}
