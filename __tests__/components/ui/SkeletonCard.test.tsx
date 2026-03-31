import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import SkeletonCard from "@/components/ui/SkeletonCard";

describe("SkeletonCard", () => {
  it("기본적으로 이미지 영역을 포함한다", () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelector(".w-20")).toBeInTheDocument();
  });

  it("hasImage=false면 이미지 영역을 렌더링하지 않는다", () => {
    const { container } = render(<SkeletonCard hasImage={false} />);
    expect(container.querySelector(".w-20")).not.toBeInTheDocument();
  });

  it("animate-pulse 클래스를 가진다", () => {
    const { container } = render(<SkeletonCard />);
    expect(container.firstChild).toHaveClass("animate-pulse");
  });
});
