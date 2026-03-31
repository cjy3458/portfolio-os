import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ProjectDetailApp from "@/components/apps/ProjectDetailApp";
import { useOsStore } from "@/store/osStore";
import { PROJECTS } from "@/config/projects";

beforeEach(() => {
  useOsStore.setState({
    selectedProjectId: null,
  });
});

describe("ProjectDetailApp", () => {
  it("프로젝트 미선택 시 안내 메시지를 표시한다", () => {
    render(<ProjectDetailApp />);
    expect(screen.getByText("프로젝트를 선택해주세요.")).toBeInTheDocument();
  });

  it("선택된 프로젝트의 타이틀을 표시한다", () => {
    useOsStore.setState({ selectedProjectId: PROJECTS[0].id });
    render(<ProjectDetailApp />);
    expect(screen.getByText(PROJECTS[0].title)).toBeInTheDocument();
  });

  it("선택된 프로젝트의 fullDesc를 표시한다", () => {
    useOsStore.setState({ selectedProjectId: PROJECTS[0].id });
    render(<ProjectDetailApp />);
    expect(screen.getByText(PROJECTS[0].fullDesc)).toBeInTheDocument();
  });

  it("선택된 프로젝트의 연도를 표시한다", () => {
    useOsStore.setState({ selectedProjectId: PROJECTS[0].id });
    render(<ProjectDetailApp />);
    expect(screen.getByText(PROJECTS[0].year)).toBeInTheDocument();
  });

  it("존재하지 않는 프로젝트 ID면 안내 메시지를 표시한다", () => {
    useOsStore.setState({ selectedProjectId: "non-existent" });
    render(<ProjectDetailApp />);
    expect(screen.getByText("프로젝트를 선택해주세요.")).toBeInTheDocument();
  });
});
