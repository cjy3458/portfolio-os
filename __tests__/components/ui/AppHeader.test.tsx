import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AppHeader from "@/components/ui/AppHeader";

describe("AppHeader", () => {
  it("타이틀을 렌더링한다", () => {
    render(<AppHeader title="Blog" />);
    expect(screen.getByText("Blog")).toBeInTheDocument();
  });

  it("아이콘이 있으면 렌더링한다", () => {
    render(<AppHeader title="Blog" icon={<span data-testid="icon">📝</span>} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("액션이 있으면 렌더링한다", () => {
    render(
      <AppHeader
        title="Blog"
        action={<button data-testid="action">Action</button>}
      />
    );
    expect(screen.getByTestId("action")).toBeInTheDocument();
  });

  it("액션이 없으면 액션 영역을 렌더링하지 않는다", () => {
    const { container } = render(<AppHeader title="Blog" />);
    // title div만 존재, action div는 없음
    const firstChild = container.firstChild as HTMLElement;
    expect(firstChild.children.length).toBe(1);
  });
});
