import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TechStackList from "@/components/apps/project-detail/TechStackList";

describe("TechStackList", () => {
  it("Tech Stack 헤더를 렌더링한다", () => {
    render(<TechStackList stack={["React", "TypeScript"]} />);
    expect(screen.getByText("Tech Stack")).toBeInTheDocument();
  });

  it("모든 스택 태그를 렌더링한다", () => {
    const stack = ["React", "TypeScript", "Zustand"];
    render(<TechStackList stack={stack} />);
    for (const s of stack) {
      expect(screen.getByText(s)).toBeInTheDocument();
    }
  });
});
