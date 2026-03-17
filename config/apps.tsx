import { Briefcase, FileText, Terminal, Phone, FolderOpen, Rss, Globe } from "lucide-react";
import ProfileApp from "@/components/apps/ProfileApp";
import ProjectsApp from "@/components/apps/ProjectsApp";
import ProjectDetailApp from "@/components/apps/ProjectDetailApp";
import TerminalApp from "@/components/apps/TerminalApp";
import ContactApp from "@/components/apps/ContactApp";
import BlogApp from "@/components/apps/BlogApp";
import BrowserApp from "@/components/apps/BrowserApp";
import { AppConfig } from "@/types";

export const APPS: Record<string, AppConfig> = {
  profile: {
    id: "profile",
    title: "README.md",
    icon: FileText,
    component: ProfileApp,
    defaultPosition: { x: 40, y: 40 },
    width: 550,
    height: 450,
  },
  projects: {
    id: "projects",
    title: "Projects.exe",
    icon: Briefcase,
    component: ProjectsApp,
    defaultPosition: { x: 100, y: 80 },
    width: 600,
    height: 500,
  },
  "project-detail": {
    id: "project-detail",
    title: "Project Detail",
    icon: FolderOpen,
    component: ProjectDetailApp,
    defaultPosition: { x: 180, y: 60 },
    width: 560,
    height: 520,
  },
  terminal: {
    id: "terminal",
    title: "Terminal.sh",
    icon: Terminal,
    component: TerminalApp,
    defaultPosition: { x: 160, y: 120 },
    width: 500,
    height: 350,
  },
  contact: {
    id: "contact",
    title: "Contact.info",
    icon: Phone,
    component: ContactApp,
    defaultPosition: { x: 220, y: 160 },
    width: 450,
    height: 480,
  },
  blog: {
    id: "blog",
    title: "Blog.rss",
    icon: Rss,
    component: BlogApp,
    defaultPosition: { x: 260, y: 80 },
    width: 480,
    height: 520,
  },
  browser: {
    id: "browser",
    title: "Browser",
    icon: Globe,
    component: BrowserApp,
    defaultPosition: { x: 300, y: 60 },
    width: 760,
    height: 560,
  },
};

// project-detail은 데스크탑 아이콘에 표시하지 않음
export const DESKTOP_APP_KEYS: (keyof typeof APPS)[] = [
  "profile",
  "projects",
  "terminal",
  "contact",
  "blog",
];

export const APP_KEYS = Object.keys(APPS) as (keyof typeof APPS)[];
