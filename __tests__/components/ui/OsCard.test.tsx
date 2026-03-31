import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OsCard from "@/components/ui/OsCard";

describe("OsCard", () => {
  it("onClick이 없으면 <div>를 렌더링한다", () => {
    render(<OsCard>Content</OsCard>);
    expect(screen.getByText("Content").closest("div")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("onClick이 있으면 <button>을 렌더링한다", () => {
    render(<OsCard onClick={() => {}}>Content</OsCard>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("onClick 핸들러가 호출된다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<OsCard onClick={onClick}>Clickable</OsCard>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("className이 전달된다", () => {
    render(<OsCard className="extra">Content</OsCard>);
    expect(screen.getByText("Content").closest("div")).toHaveClass("extra");
  });
});
