import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("기본 모드로 렌더링한다", () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("label을 표시한다", () => {
    render(<LoadingSpinner label="로딩 중..." />);
    expect(screen.getByText("로딩 중...")).toBeInTheDocument();
  });

  it("label이 없으면 텍스트를 표시하지 않는다", () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector("span")).not.toBeInTheDocument();
  });

  it("overlay 모드에서 absolute 클래스를 가진다", () => {
    const { container } = render(<LoadingSpinner overlay />);
    expect(container.querySelector(".absolute")).toBeInTheDocument();
  });
});
