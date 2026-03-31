import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TagList from "@/components/ui/TagList";

describe("TagList", () => {
  const items = ["React", "TypeScript", "Zustand"];

  it("모든 아이템을 렌더링한다", () => {
    render(<TagList items={items} />);
    for (const item of items) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it("기본 layout은 wrap이다", () => {
    const { container } = render(<TagList items={items} />);
    expect(container.firstChild).toHaveClass("flex", "flex-wrap");
  });

  it("layout=grid이면 grid 클래스를 사용한다", () => {
    const { container } = render(<TagList items={items} layout="grid" />);
    expect(container.firstChild).toHaveClass("grid", "grid-cols-2");
  });

  it("빈 배열이면 아이템을 렌더링하지 않는다", () => {
    const { container } = render(<TagList items={[]} />);
    expect(container.firstChild?.childNodes).toHaveLength(0);
  });
});
