"use client";

import { Briefcase, ChevronRight } from "lucide-react";
import { PROJECTS } from "@/config/projects";
import { useOsStore } from "@/store/osStore";

export default function ProjectsApp() {
  const openProjectDetail = useOsStore((s) => s.openProjectDetail);

  return (
    <div className="p-6 font-mono min-h-full bg-gray-50">
      <div className="flex flex-col gap-4">
        {PROJECTS.map((p) => (
          <button
            key={p.id}
            onClick={() => openProjectDetail(p.id)}
            className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all text-left group w-full"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-black uppercase flex items-center gap-2">
                <Briefcase size={18} /> {p.title}
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs bg-black text-white px-2 py-1 font-bold">
                  {p.year}
                </span>
                <ChevronRight
                  size={16}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
            <p className="text-xs font-bold opacity-70 mb-2 border-b border-gray-200 pb-2">
              {p.stack.join(", ")}
            </p>
            <p className="text-sm opacity-90 leading-relaxed">{p.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
