import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FeatureList from "@/components/apps/project-detail/FeatureList";

describe("FeatureList", () => {
  it("Key Features 헤더를 렌더링한다", () => {
    render(<FeatureList features={["Feature A"]} />);
    expect(screen.getByText("Key Features")).toBeInTheDocument();
  });

  it("모든 피처 아이템을 렌더링한다", () => {
    const features = ["Feature A", "Feature B", "Feature C"];
    render(<FeatureList features={features} />);
    for (const f of features) {
      expect(screen.getByText(f)).toBeInTheDocument();
    }
  });

  it("리스트 아이템으로 렌더링한다", () => {
    render(<FeatureList features={["Feature A"]} />);
    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });
});
