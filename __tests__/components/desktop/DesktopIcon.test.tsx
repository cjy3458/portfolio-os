import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DesktopIcon from "@/components/desktop/DesktopIcon";
import { useOsStore } from "@/store/osStore";
import { FileText } from "lucide-react";
import { AppConfig } from "@/types";

const mockApp: AppConfig = {
  id: "profile",
  title: "README.md",
  icon: FileText,
  component: () => <div>Profile</div>,
  defaultPosition: { x: 40, y: 40 },
  width: 550,
  height: 450,
};

beforeEach(() => {
  useOsStore.setState({
    openWindows: [],
    focusedWindowId: null,
    zIndexCounter: 10,
    startMenuOpen: false,
  });
});

describe("DesktopIcon", () => {
  it("앱 타이틀을 렌더링한다", () => {
    render(<DesktopIcon app={mockApp} />);
    expect(screen.getByText("README.md")).toBeInTheDocument();
  });

  it("클릭 시 openApp을 호출한다", async () => {
    const user = userEvent.setup();
    render(<DesktopIcon app={mockApp} />);
    await user.click(screen.getByText("README.md"));
    expect(useOsStore.getState().openWindows.some((w) => w.id === "profile")).toBe(true);
  });
});
