"use client";

import { useState, useEffect, useRef } from "react";
import { TerminalHistoryItem } from "@/types";
import { SYSTEM_INSTRUCTION } from "@/config/aiContext";

type HistoryEntry = TerminalHistoryItem & { id: number };

async function callGeminiAPI(prompt: string, retryCount = 0): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(errBody)}`);
    }
    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      "응답을 생성할 수 없습니다."
    );
  } catch (e) {
    if (retryCount < 3) {
      await new Promise((r) => setTimeout(r, 1000 * (retryCount + 1)));
      return callGeminiAPI(prompt, retryCount + 1);
    }
    return `[ERR] ${e instanceof Error ? e.message : String(e)}`;
  }
}

export default function TerminalApp() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([
    { role: "system", text: "PORTFOLIO_OS v1.0.0", id: 0 },
    { role: "system", text: "AI 어시스턴트에 연결되었습니다. 포트폴리오에 대해 질문해보세요.", id: 1 },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const makeEntry = (item: TerminalHistoryItem): HistoryEntry => ({
    ...item,
    id: Math.random(),
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // ✅ useCallback 제거 — input이 매 키입력마다 바뀌어 deps가 매번 무효화됨
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !input.trim() || isTyping) return;

    const cmd = input.trim();
    setInput("");

    if (cmd.toLowerCase() === "clear") {
      setHistory([]);
      return;
    }

    const loadingEntry = makeEntry({
      role: "ai",
      text: "포트폴리오에 오신 손님. 잠시만 기다리시면 답변을 드리겠습니다.",
      isLoading: true,
    });

    setHistory((prev) => [
      ...prev,
      makeEntry({ role: "user", text: `guest@os:~$ ${cmd}` }),
      loadingEntry,
    ]);
    setIsTyping(true);

    const responseText = await callGeminiAPI(cmd);

    // ✅ loading 항목을 id로 정확히 교체
    setHistory((prev) =>
      prev.map((item) =>
        item.id === loadingEntry.id
          ? { ...item, text: responseText, isLoading: false }
          : item,
      ),
    );
    setIsTyping(false);
  };

  return (
    <div
      className="bg-black text-[#33ff00] p-4 font-mono h-full flex flex-col text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto pb-4 terminal-scrollbar">
        {/* ✅ 안정적인 id를 key로 사용 — index key의 reconciliation 오류 방지 */}
        {history.map((item) => (
          <div
            key={item.id}
            className={`mb-2 ${item.isLoading ? "animate-pulse" : ""} ${
              item.role === "system" ? "text-gray-400" : ""
            }`}
          >
            {item.role === "ai" && !item.isLoading && (
              <span className="text-white mr-2">&gt;</span>
            )}
            <span className="whitespace-pre-wrap">{item.text}</span>
          </div>
        ))}
        {!isTyping && (
          <div className="flex items-center mt-2">
            <span className="mr-2">guest@os:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none flex-1 text-[#33ff00] caret-[#33ff00]"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
