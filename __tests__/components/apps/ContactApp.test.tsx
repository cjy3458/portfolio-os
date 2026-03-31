import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactApp from "@/components/apps/ContactApp";

describe("ContactApp", () => {
  it("Contact Me 제목을 렌더링한다", () => {
    render(<ContactApp />);
    expect(screen.getByText("Contact Me")).toBeInTheDocument();
  });

  it("이메일 연락처를 표시한다", () => {
    render(<ContactApp />);
    expect(screen.getByText("cjy34580324@gmail.com")).toBeInTheDocument();
  });

  it("GitHub 연락처를 표시한다", () => {
    render(<ContactApp />);
    expect(screen.getByText("github.com/cjy3458")).toBeInTheDocument();
  });

  it("모든 연락처 링크가 올바른 href를 가진다", () => {
    render(<ContactApp />);
    const emailLink = screen.getByText("cjy34580324@gmail.com").closest("a");
    expect(emailLink).toHaveAttribute("href", "mailto:cjy34580324@gmail.com");

    const githubLink = screen.getByText("github.com/cjy3458").closest("a");
    expect(githubLink).toHaveAttribute("href", "https://github.com/cjy3458");
  });

  it("이력서 다운로드 링크가 존재한다", () => {
    render(<ContactApp />);
    const downloadLink = screen.getByText("Download Resume").closest("a");
    expect(downloadLink).toHaveAttribute("href", "/resume.pdf");
    expect(downloadLink).toHaveAttribute("download");
  });

  it("외부 링크에 target=_blank와 rel 속성이 있다", () => {
    render(<ContactApp />);
    const githubLink = screen.getByText("github.com/cjy3458").closest("a");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
