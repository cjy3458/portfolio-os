import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ContributionList from "@/components/apps/project-detail/ContributionList";
import type { Contribution } from "@/config/projects";

const mockContributions: Contribution[] = [
  {
    title: "Gemini AI 터미널 교정",
    problem: "잘못된 명령어 입력 시 단순 에러만 출력",
    solution: "Gemini API로 명령어 교정 기능 구현",
    result: "명령어 즉시 교정 및 재실행",
  },
  {
    title: "Zustand WindowStore 설계",
    problem: "멀티 윈도우 상태 관리 필요",
    solution: "Zustand 전역 스토어 설계",
    result: "단일 스토어 관리로 예측 가능성 향상",
  },
];

describe("ContributionList", () => {
  it("Key Contributions 헤더를 렌더링한다", () => {
    render(<ContributionList contributions={mockContributions} />);
    expect(screen.getByText("Key Contributions")).toBeInTheDocument();
  });

  it("모든 기여 항목의 타이틀을 렌더링한다", () => {
    render(<ContributionList contributions={mockContributions} />);
    expect(screen.getByText("Gemini AI 터미널 교정")).toBeInTheDocument();
    expect(screen.getByText("Zustand WindowStore 설계")).toBeInTheDocument();
  });

  it("문제/해결/결과 라벨을 표시한다", () => {
    render(<ContributionList contributions={mockContributions} />);
    expect(screen.getAllByText("문제")).toHaveLength(2);
    expect(screen.getAllByText("해결")).toHaveLength(2);
    expect(screen.getAllByText("결과")).toHaveLength(2);
  });

  it("각 기여의 상세 내용을 표시한다", () => {
    render(<ContributionList contributions={mockContributions} />);
    expect(screen.getByText("잘못된 명령어 입력 시 단순 에러만 출력")).toBeInTheDocument();
    expect(screen.getByText("Gemini API로 명령어 교정 기능 구현")).toBeInTheDocument();
    expect(screen.getByText("명령어 즉시 교정 및 재실행")).toBeInTheDocument();
  });
});
