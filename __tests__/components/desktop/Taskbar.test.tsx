import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Taskbar from "@/components/desktop/Taskbar";
import { useOsStore } from "@/store/osStore";

beforeEach(() => {
  useOsStore.setState({
    isBooting: false,
    openWindows: [],
    focusedWindowId: null,
    zIndexCounter: 10,
    startMenuOpen: false,
    selectedProjectId: null,
    selectedBlogPost: null,
  });
});

describe("Taskbar", () => {
  it("START 버튼을 렌더링한다", () => {
    render(<Taskbar />);
    expect(screen.getByText("START")).toBeInTheDocument();
  });

  it("START 버튼 클릭 시 startMenu를 토글한다", async () => {
    const user = userEvent.setup();
    render(<Taskbar />);
    await user.click(screen.getByText("START"));
    expect(useOsStore.getState().startMenuOpen).toBe(true);
  });

  it("열린 앱의 탭을 렌더링한다", () => {
    useOsStore.getState().openApp("profile");
    render(<Taskbar />);
    expect(screen.getByText("README.md")).toBeInTheDocument();
  });

  it("포커스된 앱 탭은 다른 스타일을 가진다", () => {
    useOsStore.getState().openApp("profile");
    render(<Taskbar />);
    const tab = screen.getByText("README.md").closest("button");
    expect(tab).toHaveClass("bg-gray-200");
  });

  it("시계 영역이 존재한다", () => {
    render(<Taskbar />);
    // Taskbar의 시계 영역은 border-l-2 클래스를 가진 div
    const { container } = render(<Taskbar />);
    const clockSection = container.querySelector(".border-l-2");
    expect(clockSection).toBeInTheDocument();
    // animate-pulse 인디케이터가 존재
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });
});
