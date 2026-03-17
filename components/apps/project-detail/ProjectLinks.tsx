import { ExternalLink, Github } from "lucide-react";
import { ProjectData } from "@/config/projects";
import SectionHeader from "@/components/ui/SectionHeader";
import OsButton from "@/components/ui/OsButton";

type Link = ProjectData["links"][number];

interface ProjectLinksProps {
  links: Link[];
}

export default function ProjectLinks({ links }: ProjectLinksProps) {
  if (links.length === 0) return null;

  return (
    <section>
      <SectionHeader title="Links" />
      <div className="flex flex-wrap gap-3">
        {links.map((link) => {
          const isGithub = link.label.toLowerCase() === "github";
          return (
            <OsButton
              key={link.label}
              href={link.href}
              size="sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              {isGithub ? <Github size={14} /> : <ExternalLink size={14} />}
              {link.label}
            </OsButton>
          );
        })}
      </div>
    </section>
  );
}
