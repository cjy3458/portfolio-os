import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import OsInput from "@/components/ui/OsInput";

describe("OsInput", () => {
  it("input을 렌더링한다", () => {
    render(<OsInput placeholder="검색..." />);
    expect(screen.getByPlaceholderText("검색...")).toBeInTheDocument();
  });

  it("ref가 전달된다", () => {
    const ref = createRef<HTMLInputElement>();
    render(<OsInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("className이 결합된다", () => {
    render(<OsInput className="custom" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveClass("custom");
    // 기본 클래스도 유지
    expect(screen.getByTestId("input")).toHaveClass("border-2");
  });

  it("HTML input 속성이 전달된다", () => {
    render(<OsInput type="email" disabled data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toBeDisabled();
  });
});
