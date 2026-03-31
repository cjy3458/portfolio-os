import { describe, it, expect, beforeEach } from "vitest";
import { useOsStore } from "@/store/osStore";
import { BlogPost } from "@/types";

// 각 테스트 전 스토어를 초기 상태로 리셋
beforeEach(() => {
  useOsStore.setState({
    isBooting: true,
    openWindows: [],
    focusedWindowId: null,
    zIndexCounter: 10,
    startMenuOpen: false,
    selectedProjectId: null,
    selectedBlogPost: null,
  });
});

describe("osStore", () => {
  describe("setBootComplete", () => {
    it("isBooting을 false로 설정한다", () => {
      useOsStore.getState().setBootComplete();
      expect(useOsStore.getState().isBooting).toBe(false);
    });
  });

  describe("openApp", () => {
    it("새 앱을 openWindows에 추가한다", () => {
      useOsStore.getState().openApp("terminal");
      const state = useOsStore.getState();
      expect(state.openWindows).toHaveLength(1);
      expect(state.openWindows[0].id).toBe("terminal");
      expect(state.focusedWindowId).toBe("terminal");
    });

    it("zIndex를 1 증가시킨다", () => {
      useOsStore.getState().openApp("terminal");
      expect(useOsStore.getState().zIndexCounter).toBe(11);
      expect(useOsStore.getState().openWindows[0].zIndex).toBe(11);
    });

    it("이미 열린 앱은 중복으로 추가하지 않고 포커스만 한다", () => {
      useOsStore.getState().openApp("terminal");
      useOsStore.getState().openApp("profile");
      useOsStore.getState().openApp("terminal"); // 중복
      expect(useOsStore.getState().openWindows).toHaveLength(2);
      expect(useOsStore.getState().focusedWindowId).toBe("terminal");
    });

    it("startMenu를 닫는다", () => {
      useOsStore.setState({ startMenuOpen: true });
      useOsStore.getState().openApp("terminal");
      expect(useOsStore.getState().startMenuOpen).toBe(false);
    });
  });

  describe("closeApp", () => {
    it("앱을 openWindows에서 제거한다", () => {
      useOsStore.getState().openApp("terminal");
      useOsStore.getState().closeApp("terminal");
      expect(useOsStore.getState().openWindows).toHaveLength(0);
    });

    it("닫힌 앱이 포커스 상태였다면 다음 앱으로 포커스를 이동한다", () => {
      useOsStore.getState().openApp("profile");
      useOsStore.getState().openApp("terminal");
      // terminal이 포커스 상태
      useOsStore.getState().closeApp("terminal");
      expect(useOsStore.getState().focusedWindowId).toBe("profile");
    });

    it("마지막 앱을 닫으면 focusedWindowId가 null이 된다", () => {
      useOsStore.getState().openApp("terminal");
      useOsStore.getState().closeApp("terminal");
      expect(useOsStore.getState().focusedWindowId).toBeNull();
    });

    it("포커스되지 않은 앱을 닫으면 focusedWindowId가 유지된다", () => {
      useOsStore.getState().openApp("profile");
      useOsStore.getState().openApp("terminal");
      // terminal이 포커스 상태, profile을 닫음
      useOsStore.getState().closeApp("profile");
      expect(useOsStore.getState().focusedWindowId).toBe("terminal");
    });
  });

  describe("focusWindow", () => {
    it("지정된 앱의 zIndex를 최상위로 올린다", () => {
      useOsStore.getState().openApp("profile");
      useOsStore.getState().openApp("terminal");
      // terminal이 최상위
      useOsStore.getState().focusWindow("profile");
      const state = useOsStore.getState();
      const profileWin = state.openWindows.find((w) => w.id === "profile");
      const terminalWin = state.openWindows.find((w) => w.id === "terminal");
      expect(profileWin!.zIndex).toBeGreaterThan(terminalWin!.zIndex);
      expect(state.focusedWindowId).toBe("profile");
    });
  });

  describe("toggleStartMenu", () => {
    it("startMenuOpen을 토글한다", () => {
      expect(useOsStore.getState().startMenuOpen).toBe(false);
      useOsStore.getState().toggleStartMenu();
      expect(useOsStore.getState().startMenuOpen).toBe(true);
      useOsStore.getState().toggleStartMenu();
      expect(useOsStore.getState().startMenuOpen).toBe(false);
    });
  });

  describe("closeStartMenu", () => {
    it("startMenuOpen을 false로 설정한다", () => {
      useOsStore.setState({ startMenuOpen: true });
      useOsStore.getState().closeStartMenu();
      expect(useOsStore.getState().startMenuOpen).toBe(false);
    });
  });

  describe("openProjectDetail", () => {
    it("selectedProjectId를 설정하고 project-detail 윈도우를 연다", () => {
      useOsStore.getState().openProjectDetail("web-os-emulator");
      const state = useOsStore.getState();
      expect(state.selectedProjectId).toBe("web-os-emulator");
      expect(state.openWindows.some((w) => w.id === "project-detail")).toBe(true);
      expect(state.focusedWindowId).toBe("project-detail");
    });

    it("이미 열려있으면 포커스만 하고 selectedProjectId는 갱신한다", () => {
      useOsStore.getState().openProjectDetail("web-os-emulator");
      useOsStore.getState().openApp("terminal");
      useOsStore.getState().openProjectDetail("arti");
      const state = useOsStore.getState();
      expect(state.selectedProjectId).toBe("arti");
      expect(state.openWindows.filter((w) => w.id === "project-detail")).toHaveLength(1);
      expect(state.focusedWindowId).toBe("project-detail");
    });
  });

  describe("openBrowser", () => {
    const testPost: BlogPost = {
      title: "Test Post",
      link: "https://example.com/1",
      description: "desc",
      pubDate: "2024-01-01",
      image: null,
    };

    it("selectedBlogPost를 설정하고 browser 윈도우를 연다", () => {
      useOsStore.getState().openBrowser(testPost);
      const state = useOsStore.getState();
      expect(state.selectedBlogPost).toEqual(testPost);
      expect(state.openWindows.some((w) => w.id === "browser")).toBe(true);
      expect(state.focusedWindowId).toBe("browser");
    });

    it("이미 열려있으면 포커스만 하고 selectedBlogPost를 갱신한다", () => {
      useOsStore.getState().openBrowser(testPost);
      useOsStore.getState().openApp("terminal");
      const newPost = { ...testPost, title: "New Post" };
      useOsStore.getState().openBrowser(newPost);
      const state = useOsStore.getState();
      expect(state.selectedBlogPost?.title).toBe("New Post");
      expect(state.openWindows.filter((w) => w.id === "browser")).toHaveLength(1);
    });
  });
});
