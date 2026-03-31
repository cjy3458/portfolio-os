import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EmptyState from "@/components/ui/EmptyState";

describe("EmptyState", () => {
  it("기본 메시지를 표시한다", () => {
    render(<EmptyState />);
    expect(screen.getByText("항목을 찾을 수 없습니다.")).toBeInTheDocument();
  });

  it("커스텀 메시지를 표시한다", () => {
    render(<EmptyState message="데이터가 없습니다." />);
    expect(screen.getByText("데이터가 없습니다.")).toBeInTheDocument();
  });
});
