import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Window from "@/components/window/Window";
import { FileText } from "lucide-react";
import { AppConfig } from "@/types";

const DummyContent = () => <div>App Content</div>;

const mockApp: AppConfig = {
  id: "test-app",
  title: "Test.exe",
  icon: FileText,
  component: DummyContent,
  defaultPosition: { x: 100, y: 100 },
  width: 400,
  height: 300,
};

describe("Window", () => {
  it("앱 타이틀을 렌더링한다", () => {
    render(
      <Window app={mockApp} zIndex={10} isFocused={true} onClose={vi.fn()} onFocus={vi.fn()} />
    );
    expect(screen.getByText("Test.exe")).toBeInTheDocument();
  });

  it("앱 컨텐츠를 렌더링한다", () => {
    render(
      <Window app={mockApp} zIndex={10} isFocused={true} onClose={vi.fn()} onFocus={vi.fn()} />
    );
    expect(screen.getByText("App Content")).toBeInTheDocument();
  });

  it("닫기 버튼 클릭 시 onClose를 호출한다", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Window app={mockApp} zIndex={10} isFocused={true} onClose={onClose} onFocus={vi.fn()} />
    );
    await user.click(screen.getByRole("button", { name: "닫기" }));
    expect(onClose).toHaveBeenCalledWith("test-app");
  });

  it("최대화 버튼이 존재한다", () => {
    render(
      <Window app={mockApp} zIndex={10} isFocused={true} onClose={vi.fn()} onFocus={vi.fn()} />
    );
    expect(screen.getByRole("button", { name: "최대화" })).toBeInTheDocument();
  });

  it("포커스 상태에서 ring 클래스를 가진다", () => {
    const { container } = render(
      <Window app={mockApp} zIndex={10} isFocused={true} onClose={vi.fn()} onFocus={vi.fn()} />
    );
    expect(container.firstChild).toHaveClass("ring-2");
  });

  it("비포커스 상태에서 ring 클래스가 없다", () => {
    const { container } = render(
      <Window app={mockApp} zIndex={10} isFocused={false} onClose={vi.fn()} onFocus={vi.fn()} />
    );
    expect(container.firstChild).not.toHaveClass("ring-2");
  });

  it("전달된 zIndex가 스타일에 적용된다", () => {
    const { container } = render(
      <Window app={mockApp} zIndex={42} isFocused={false} onClose={vi.fn()} onFocus={vi.fn()} />
    );
    expect((container.firstChild as HTMLElement).style.zIndex).toBe("42");
  });
});
