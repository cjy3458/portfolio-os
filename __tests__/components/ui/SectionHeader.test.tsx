import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SectionHeader from "@/components/ui/SectionHeader";

describe("SectionHeader", () => {
  it("타이틀을 렌더링한다", () => {
    render(<SectionHeader title="Tech Stack" />);
    expect(screen.getByText("Tech Stack")).toBeInTheDocument();
  });

  it("h2 태그로 렌더링한다", () => {
    render(<SectionHeader title="Features" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Features");
  });

  it("className이 전달된다", () => {
    render(<SectionHeader title="Test" className="custom" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveClass("custom");
  });
});
