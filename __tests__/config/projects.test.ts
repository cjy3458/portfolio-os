import { describe, it, expect } from "vitest";
import { PROJECTS } from "@/config/projects";

describe("config/projects", () => {
  it("프로젝트가 1개 이상 존재한다", () => {
    expect(PROJECTS.length).toBeGreaterThan(0);
  });

  it("모든 프로젝트에 필수 필드가 존재한다", () => {
    for (const p of PROJECTS) {
      expect(p.id).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.year).toBeTruthy();
      expect(p.stack.length).toBeGreaterThan(0);
      expect(p.desc).toBeTruthy();
      expect(p.fullDesc).toBeTruthy();
      expect(p.features.length).toBeGreaterThan(0);
      expect(p.links).toBeDefined();
    }
  });

  it("모든 프로젝트 id가 고유하다", () => {
    const ids = PROJECTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("모든 링크에 label과 href가 존재한다", () => {
    for (const p of PROJECTS) {
      for (const link of p.links) {
        expect(link.label).toBeTruthy();
        expect(link.href).toMatch(/^https?:\/\//);
      }
    }
  });

  it("contributions가 있으면 title/problem/solution/result 필드가 있다", () => {
    for (const p of PROJECTS) {
      if (p.contributions) {
        for (const c of p.contributions) {
          expect(c.title).toBeTruthy();
          expect(c.problem).toBeTruthy();
          expect(c.solution).toBeTruthy();
          expect(c.result).toBeTruthy();
        }
      }
    }
  });
});
