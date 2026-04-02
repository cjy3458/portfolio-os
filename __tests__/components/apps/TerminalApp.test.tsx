import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TerminalApp from "@/components/apps/TerminalApp";

// Gemini API 호출을 모킹
vi.stubGlobal("fetch", vi.fn());

beforeEach(() => {
  vi.mocked(fetch).mockReset();
});

describe("TerminalApp", () => {
  it("초기 시스템 메시지를 렌더링한다", () => {
    render(<TerminalApp />);
    expect(screen.getByText("PORTFOLIO_OS v1.0.0")).toBeInTheDocument();
    expect(
      screen.getByText("AI 어시스턴트 연결 포트폴리오에 대해 질문해보세요.")
    ).toBeInTheDocument();
  });

  it("프롬프트를 표시한다", () => {
    render(<TerminalApp />);
    expect(screen.getByText("guest@os:~$")).toBeInTheDocument();
  });

  it("입력 필드가 존재한다", () => {
    render(<TerminalApp />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("clear 명령 시 히스토리를 비운다", async () => {
    const user = userEvent.setup();
    render(<TerminalApp />);

    const input = screen.getByRole("textbox");
    await user.type(input, "clear{Enter}");

    // clear 후 시스템 메시지가 사라짐
    expect(screen.queryByText("PORTFOLIO_OS v1.0.0")).not.toBeInTheDocument();
  });

  it("사용자 입력을 히스토리에 추가한다", async () => {
    const user = userEvent.setup();

    // API 호출 모킹
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: "AI 응답" }] } }],
      }),
    } as Response);

    render(<TerminalApp />);
    const input = screen.getByRole("textbox");
    await user.type(input, "hello{Enter}");

    // 사용자 입력이 표시됨
    expect(screen.getByText("guest@os:~$ hello")).toBeInTheDocument();
  });
});
