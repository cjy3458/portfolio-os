import { LucideIcon } from "lucide-react";
import { ComponentType } from "react";

export interface AppConfig {
  id: string;
  title: string;
  icon: LucideIcon;
  component: ComponentType;
  defaultPosition: { x: number; y: number };
  width: number;
  height: number;
}

export interface WindowInstance {
  id: string;
  zIndex: number;
}

export interface OsStore {
  isBooting: boolean;
  openWindows: WindowInstance[];
  focusedWindowId: string | null;
  zIndexCounter: number;
  startMenuOpen: boolean;
  selectedProjectId: string | null;
  selectedBlogPost: BlogPost | null;

  setBootComplete: () => void;
  openApp: (appId: string) => void;
  closeApp: (appId: string) => void;
  focusWindow: (appId: string) => void;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
  openProjectDetail: (projectId: string) => void;
  openBrowser: (post: BlogPost) => void;
}

export interface TerminalHistoryItem {
  role: "system" | "user" | "ai";
  text: string;
  isLoading?: boolean;
}

export interface BlogPost {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  image: string | null;
}
