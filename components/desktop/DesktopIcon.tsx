"use client";

import { AppConfig } from "@/types";
import { useOsStore } from "@/store/osStore";

interface DesktopIconProps {
  app: AppConfig;
}

export default function DesktopIcon({ app }: DesktopIconProps) {
  const openApp = useOsStore((s) => s.openApp);

  return (
    <div
      className="flex flex-col items-center gap-1 w-20 p-2 cursor-pointer hover:bg-black/5 rounded group"
      onClick={() => openApp(app.id)}
    >
      <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:-translate-y-1 transition-transform group-hover:bg-black group-hover:text-white">
        <app.icon size={24} />
      </div>
      <span className="text-xs font-bold text-black bg-white/80 px-1 rounded uppercase tracking-tighter text-center leading-tight mt-1 border border-transparent group-hover:border-black">
        {app.title}
      </span>
    </div>
  );
}
