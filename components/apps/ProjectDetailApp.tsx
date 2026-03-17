"use client";

import { useOsStore } from "@/store/osStore";
import { PROJECTS } from "@/config/projects";
import TechStackList from "./project-detail/TechStackList";
import FeatureList from "./project-detail/FeatureList";
import ProjectLinks from "./project-detail/ProjectLinks";
import ContributionList from "./project-detail/ContributionList";
import ImageGallery from "./project-detail/ImageGallery";

export default function ProjectDetailApp() {
  const selectedProjectId = useOsStore((s) => s.selectedProjectId);
  const project = PROJECTS.find((p) => p.id === selectedProjectId);

  if (!project) {
    return (
      <div className="p-6 font-mono flex items-center justify-center h-full text-gray-400">
        <p>프로젝트를 선택해주세요.</p>
      </div>
    );
  }

  return (
    <div className="font-mono h-full overflow-y-auto bg-white">
      {/* Hero Header */}
      <div className="bg-black text-white p-6 border-b-2 border-black">
        <div className="flex justify-between items-start gap-4">
          <h1 className="text-2xl font-black uppercase leading-tight">
            {project.title}
          </h1>
          <span className="text-xs bg-white text-black px-2 py-1 font-black shrink-0">
            {project.year}
          </span>
        </div>
        <p className="mt-3 text-sm text-gray-300 leading-relaxed">
          {project.fullDesc}
        </p>
      </div>

      <div className="p-6 flex flex-col gap-6">
        <TechStackList stack={project.stack} />
        {project.images && project.images.length > 0 && (
          <ImageGallery images={project.images} />
        )}
        <FeatureList features={project.features} />
        {project.contributions && project.contributions.length > 0 && (
          <ContributionList contributions={project.contributions} />
        )}
        <ProjectLinks links={project.links} />
      </div>
    </div>
  );
}
