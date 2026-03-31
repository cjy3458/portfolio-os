import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectsApp from "@/components/apps/ProjectsApp";
import { useOsStore } from "@/store/osStore";
import { PROJECTS } from "@/config/projects";

beforeEach(() => {
  useOsStore.setState({
    openWindows: [],
    focusedWindowId: null,
    zIndexCounter: 10,
    startMenuOpen: false,
    selectedProjectId: null,
  });
});

describe("ProjectsApp", () => {
  it("모든 프로젝트를 렌더링한다", () => {
    render(<ProjectsApp />);
    for (const p of PROJECTS) {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    }
  });

  it("프로젝트의 기술 스택을 표시한다", () => {
    render(<ProjectsApp />);
    const firstProject = PROJECTS[0];
    expect(screen.getByText(firstProject.stack.join(", "))).toBeInTheDocument();
  });

  it("프로젝트 클릭 시 openProjectDetail을 호출한다", async () => {
    const user = userEvent.setup();
    render(<ProjectsApp />);
    await user.click(screen.getByText(PROJECTS[0].title));
    const state = useOsStore.getState();
    expect(state.selectedProjectId).toBe(PROJECTS[0].id);
    expect(state.openWindows.some((w) => w.id === "project-detail")).toBe(true);
  });

  it("프로젝트의 연도를 표시한다", () => {
    render(<ProjectsApp />);
    expect(screen.getByText(PROJECTS[0].year)).toBeInTheDocument();
  });
});
