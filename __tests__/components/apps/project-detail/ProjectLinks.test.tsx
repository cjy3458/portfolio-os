import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProjectLinks from "@/components/apps/project-detail/ProjectLinks";

describe("ProjectLinks", () => {
  it("Links 헤더를 렌더링한다", () => {
    render(
      <ProjectLinks links={[{ label: "GitHub", href: "https://github.com/test" }]} />
    );
    expect(screen.getByText("Links")).toBeInTheDocument();
  });

  it("모든 링크를 렌더링한다", () => {
    const links = [
      { label: "GitHub", href: "https://github.com/test" },
      { label: "서비스 링크", href: "https://example.com" },
    ];
    render(<ProjectLinks links={links} />);
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("서비스 링크")).toBeInTheDocument();
  });

  it("링크에 올바른 href가 설정된다", () => {
    render(
      <ProjectLinks links={[{ label: "GitHub", href: "https://github.com/test" }]} />
    );
    const link = screen.getByText("GitHub").closest("a");
    expect(link).toHaveAttribute("href", "https://github.com/test");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("빈 배열이면 아무것도 렌더링하지 않는다", () => {
    const { container } = render(<ProjectLinks links={[]} />);
    expect(container.innerHTML).toBe("");
  });
});
