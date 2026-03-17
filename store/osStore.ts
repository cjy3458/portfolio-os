import { create } from "zustand";
import { BlogPost, OsStore } from "@/types";

const PROJECT_DETAIL_ID = "project-detail";
const BROWSER_ID = "browser";

export const useOsStore = create<OsStore>((set, get) => ({
  isBooting: true,
  openWindows: [],
  focusedWindowId: null,
  zIndexCounter: 10,
  startMenuOpen: false,
  selectedProjectId: null,
  selectedBlogPost: null,

  setBootComplete: () => set({ isBooting: false }),

  openApp: (appId: string) => {
    const { openWindows, zIndexCounter, focusWindow } = get();
    set({ startMenuOpen: false });

    const alreadyOpen = openWindows.some((w) => w.id === appId);
    if (alreadyOpen) {
      focusWindow(appId);
      return;
    }

    const newZIndex = zIndexCounter + 1;
    set({
      openWindows: [...openWindows, { id: appId, zIndex: newZIndex }],
      focusedWindowId: appId,
      zIndexCounter: newZIndex,
    });
  },

  closeApp: (appId: string) => {
    const { openWindows, focusedWindowId } = get();
    const remaining = openWindows.filter((w) => w.id !== appId);
    const nextFocused =
      focusedWindowId === appId
        ? remaining.length > 0
          ? remaining[remaining.length - 1].id
          : null
        : focusedWindowId;

    set({ openWindows: remaining, focusedWindowId: nextFocused });
  },

  focusWindow: (appId: string) => {
    const { openWindows, zIndexCounter } = get();
    const newZIndex = zIndexCounter + 1;
    set({
      openWindows: openWindows.map((w) =>
        w.id === appId ? { ...w, zIndex: newZIndex } : w
      ),
      focusedWindowId: appId,
      zIndexCounter: newZIndex,
    });
  },

  toggleStartMenu: () =>
    set((state) => ({ startMenuOpen: !state.startMenuOpen })),

  closeStartMenu: () => set({ startMenuOpen: false }),

  openProjectDetail: (projectId: string) => {
    const { openWindows, zIndexCounter, focusWindow } = get();
    set({ selectedProjectId: projectId });

    const alreadyOpen = openWindows.some((w) => w.id === PROJECT_DETAIL_ID);
    if (alreadyOpen) {
      // 이미 열려있으면 포커스만 (selectedProjectId는 이미 업데이트됨)
      focusWindow(PROJECT_DETAIL_ID);
      return;
    }

    const newZIndex = zIndexCounter + 1;
    set({
      openWindows: [...openWindows, { id: PROJECT_DETAIL_ID, zIndex: newZIndex }],
      focusedWindowId: PROJECT_DETAIL_ID,
      zIndexCounter: newZIndex,
    });
  },

  openBrowser: (post: BlogPost) => {
    const { openWindows, zIndexCounter, focusWindow } = get();
    set({ selectedBlogPost: post });

    const alreadyOpen = openWindows.some((w) => w.id === BROWSER_ID);
    if (alreadyOpen) {
      focusWindow(BROWSER_ID);
      return;
    }

    const newZIndex = zIndexCounter + 1;
    set({
      openWindows: [...openWindows, { id: BROWSER_ID, zIndex: newZIndex }],
      focusedWindowId: BROWSER_ID,
      zIndexCounter: newZIndex,
    });
  },
}));
