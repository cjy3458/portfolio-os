"use client";

import { useState, useEffect } from "react";
import { useBiosDateTime } from "@/hooks/useBiosDateTime";

interface BootScreenProps {
  onComplete: () => void;
}

const STATUS_MESSAGES: Record<number, string> = {
  15: "React Virtual DOM 로드 중... [완료]",
  35: "UI 컴포넌트 마운트 중... [완료]",
  55: "포트폴리오 데이터 불러오는 중... [완료]",
  75: "반응형 레이아웃 초기화 중... [완료]",
  95: "프론트엔드 개발자 OS에 오신 것을 환영합니다. 바탕화면 시작 중...",
};

const ASCII_LOGO = `    ____  ____  ____  ________  __    ________
   / __ \\/ __ \\/ __ \\/ ____/ / / /   /  _/ __ \\
  / /_/ / / / / /_/ / /_  / / / /    / // / / /
 / ____/ /_/ / _, _/ __/ / /_/ /____/ // /_/ /
/_/    \\____/_/ |_/_/    \\____/_____/___\\____/
======================================================
 FRONTEND ENGINEER PORTFOLIO - SYSTEM INITIALIZATION
======================================================`;

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0);
  const biosDateTime = useBiosDateTime();

  // ✅ derived state 제거 — progress로부터 직접 계산
  const statusText = STATUS_MESSAGES[progress] ?? "시스템 초기화 중...";

  // ✅ state updater를 순수하게 유지 — side effect 없음
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, 75);
    return () => clearInterval(interval);
  }, []);

  // ✅ completion 로직을 별도 effect로 분리 + cleanup으로 메모리 누수 방지
  useEffect(() => {
    if (progress < 100) return;
    const timeout = setTimeout(onComplete, 500);
    return () => clearTimeout(timeout);
  }, [progress, onComplete]);

  const BAR_LENGTH = 30;
  const filled = Math.floor((progress / 100) * BAR_LENGTH);
  const bar = "■".repeat(filled) + "□".repeat(BAR_LENGTH - filled);

  return (
    <div className="fixed inset-0 z-100 bg-black text-white font-mono p-6 sm:p-10 flex flex-col cursor-wait">
      {/* Desktop ASCII Header */}
      <div className="mb-4 hidden sm:block whitespace-pre text-xs sm:text-sm font-bold opacity-90 border-b-2 border-dashed border-gray-700 pb-4">
        {ASCII_LOGO}
      </div>

      {/* Mobile Text Header */}
      <div className="mb-6 sm:hidden font-bold opacity-90 border-b-2 border-dashed border-gray-700 pb-2">
        FRONTEND ENGINEER PORTFOLIO
        <br />
        SYSTEM INITIALIZATION
      </div>

      <div className="flex-1 text-sm sm:text-base opacity-80 mt-2">
        <div className="mb-1">BIOS 날짜 {biosDateTime} 버전 1.00</div>
        <div className="mb-1">CPU: V8 자바스크립트 엔진, 속도: 최적</div>
        <div className="mb-1">메모리 테스트: 4194304K 정상</div>
        <div className="mb-1 mt-6 font-bold text-gray-300">
          &gt; {statusText}
        </div>
      </div>

      <div className="mt-8 border-t-2 border-dashed border-gray-700 pt-4">
        <div className="mb-2 uppercase font-bold tracking-widest text-xs text-gray-400">
          System Boot Sequence
        </div>
        <div className="flex items-center gap-4 flex-wrap text-sm sm:text-base">
          <span className="text-gray-300">[{bar}]</span>
          <span className="font-bold">
            {progress.toString().padStart(3, " ")}%
          </span>
        </div>
      </div>
    </div>
  );
}
