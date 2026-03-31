import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StartMenu from "@/components/desktop/StartMenu";
import { useOsStore } from "@/store/osStore";
import { DESKTOP_APP_KEYS, APPS } from "@/config/apps";

beforeEach(() => {
  useOsStore.setState({
    openWindows: [],
    focusedWindowId: null,
    zIndexCounter: 10,
    startMenuOpen: false,
  });
});

describe("StartMenu", () => {
  it("데스크탑 앱 목록을 렌더링한다", () => {
    render(<StartMenu />);
    for (const key of DESKTOP_APP_KEYS) {
      expect(screen.getByText(APPS[key].title)).toBeInTheDocument();
    }
  });

  it("OS_MENU 헤더를 표시한다", () => {
    render(<StartMenu />);
    expect(screen.getByText("OS_MENU")).toBeInTheDocument();
  });

  it("앱 클릭 시 openApp을 호출한다", async () => {
    const user = userEvent.setup();
    render(<StartMenu />);
    const firstApp = APPS[DESKTOP_APP_KEYS[0]];
    await user.click(screen.getByText(firstApp.title));
    expect(useOsStore.getState().openWindows.some((w) => w.id === DESKTOP_APP_KEYS[0])).toBe(true);
  });

  it("클릭 이벤트 전파를 중단한다", async () => {
    const user = userEvent.setup();
    const parentClick = vi.fn();
    render(
      <div onClick={parentClick}>
        <StartMenu />
      </div>
    );
    await user.click(screen.getByText("OS_MENU"));
    // StartMenu의 onClick stopPropagation으로 인해 parent에 전파되지 않음
    expect(parentClick).not.toHaveBeenCalled();
  });
});

// vi import 추가
import { vi } from "vitest";
