import { describe, it, expect } from "vitest";
import { APPS, DESKTOP_APP_KEYS, APP_KEYS } from "@/config/apps";

describe("config/apps", () => {
  describe("APPS", () => {
    it("모든 앱 설정에 필수 필드가 존재한다", () => {
      for (const [key, app] of Object.entries(APPS)) {
        expect(app.id).toBe(key);
        expect(app.title).toBeTruthy();
        expect(app.icon).toBeDefined();
        expect(app.component).toBeDefined();
        expect(app.defaultPosition).toHaveProperty("x");
        expect(app.defaultPosition).toHaveProperty("y");
        expect(app.width).toBeGreaterThan(0);
        expect(app.height).toBeGreaterThan(0);
      }
    });

    it("모든 앱의 id가 고유하다", () => {
      const ids = Object.values(APPS).map((a) => a.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("DESKTOP_APP_KEYS", () => {
    it("project-detail을 포함하지 않는다", () => {
      expect(DESKTOP_APP_KEYS).not.toContain("project-detail");
    });

    it("browser를 포함하지 않는다", () => {
      expect(DESKTOP_APP_KEYS).not.toContain("browser");
    });

    it("모든 키가 APPS에 존재한다", () => {
      for (const key of DESKTOP_APP_KEYS) {
        expect(APPS[key]).toBeDefined();
      }
    });
  });

  describe("APP_KEYS", () => {
    it("APPS의 모든 키를 포함한다", () => {
      expect(APP_KEYS.sort()).toEqual(Object.keys(APPS).sort());
    });
  });
});
