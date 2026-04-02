import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OsButton from "@/components/ui/OsButton";

describe("OsButton", () => {
  it("href가 없으면 <button>을 렌더링한다", () => {
    render(<OsButton>Click me</OsButton>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("href가 있으면 <a>를 렌더링한다", () => {
    render(<OsButton href="https://example.com">Link</OsButton>);
    const link = screen.getByRole("link", { name: "Link" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("size prop에 따라 클래스가 달라진다", () => {
    const { rerender } = render(<OsButton size="icon">I</OsButton>);
    expect(screen.getByRole("button")).toHaveClass("p-1");

    rerender(<OsButton size="md">M</OsButton>);
    expect(screen.getByRole("button")).toHaveClass("px-4");
  });

  it("기본 size는 sm이다", () => {
    render(<OsButton>Btn</OsButton>);
    expect(screen.getByRole("button")).toHaveClass("px-3");
  });

  it("클릭 핸들러가 호출된다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<OsButton onClick={onClick}>Click</OsButton>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("className이 전달된다", () => {
    render(<OsButton className="custom-class">Btn</OsButton>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("[CI 실패 테스트] 의도적으로 실패시키는 테스트", () => {
    expect(true).toBe(false); // CI 차단 확인용 — 검증 후 삭제 예정
  });
});
