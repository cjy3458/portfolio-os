import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorBox from "@/components/ui/ErrorBox";

describe("ErrorBox", () => {
  it("에러 메시지를 표시한다", () => {
    render(<ErrorBox message="네트워크 오류" />);
    expect(screen.getByText("네트워크 오류")).toBeInTheDocument();
    expect(screen.getByText("[ ERROR ]")).toBeInTheDocument();
  });

  it("onRetry가 없으면 재시도 버튼을 렌더링하지 않는다", () => {
    render(<ErrorBox message="error" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("onRetry가 있으면 재시도 버튼을 렌더링한다", () => {
    render(<ErrorBox message="error" onRetry={() => {}} />);
    expect(screen.getByRole("button", { name: "재시도" })).toBeInTheDocument();
  });

  it("재시도 버튼 클릭 시 onRetry가 호출된다", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorBox message="error" onRetry={onRetry} />);
    await user.click(screen.getByRole("button", { name: "재시도" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
