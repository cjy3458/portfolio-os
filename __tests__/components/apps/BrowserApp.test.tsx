import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import BrowserApp from "@/components/apps/BrowserApp";
import { useOsStore } from "@/store/osStore";

beforeEach(() => {
  useOsStore.setState({
    selectedBlogPost: null,
  });
});

describe("BrowserApp", () => {
  it("블로그 글 미선택 시 안내 메시지를 표시한다", () => {
    render(<BrowserApp />);
    expect(screen.getByText("블로그 글을 선택해주세요.")).toBeInTheDocument();
  });

  it("블로그 글 선택 시 iframe을 렌더링한다", () => {
    useOsStore.setState({
      selectedBlogPost: {
        title: "Test Post",
        link: "https://example.com/1",
        description: "desc",
        pubDate: "2024-01-01",
        image: null,
      },
    });
    render(<BrowserApp />);
    const iframe = document.querySelector("iframe");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", "https://example.com/1");
  });

  it("입력 주소창이 블로그 링크로 설정된다", () => {
    useOsStore.setState({
      selectedBlogPost: {
        title: "Test",
        link: "https://example.com/1",
        description: "",
        pubDate: "",
        image: null,
      },
    });
    render(<BrowserApp />);
    const input = screen.getByPlaceholderText("주소를 입력하고 Enter");
    expect(input).toHaveValue("https://example.com/1");
  });
});
