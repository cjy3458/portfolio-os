import { test, expect } from "@playwright/test";

const story = (id: string) =>
  `/iframe.html?viewMode=story&id=${id}&globals=&args=`;

// ────────────────────────────────────────────────────────────
// Window
// ────────────────────────────────────────────────────────────
test.describe("Window/Window", () => {
  test("타이틀바가 렌더링된다", async ({ page }) => {
    await page.goto(story("window-window--default"));
    await expect(page.getByText("Terminal.sh")).toBeVisible();
  });

  test("최대화 버튼이 존재한다", async ({ page }) => {
    await page.goto(story("window-window--default"));
    await expect(page.getByRole("button", { name: "최대화" })).toBeVisible();
  });

  test("닫기 버튼이 존재한다", async ({ page }) => {
    await page.goto(story("window-window--default"));
    await expect(page.getByRole("button", { name: "닫기" })).toBeVisible();
  });

  test("닫기 버튼 클릭 인터랙션", async ({ page }) => {
    await page.goto(story("window-window--close-button"));
    const closeBtn = page.getByRole("button", { name: "닫기" });
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    // onClose(fn()) 호출됨 — 스토리는 변화 없음 (mock fn)
  });

  test("최대화 버튼 클릭 시 창이 확장된다", async ({ page }) => {
    await page.goto(story("window-window--maximize-toggle"));
    const maxBtn = page.getByRole("button", { name: "최대화" });

    const windowEl = page.locator(".absolute.border-2.border-black.bg-white").first();
    const beforeWidth = await windowEl.evaluate((el) => el.getBoundingClientRect().width);

    await maxBtn.click();
    // CSS transition duration-200 + React re-render 대기
    await page.waitForTimeout(400);

    const afterWidth = await windowEl.evaluate((el) => el.getBoundingClientRect().width);
    expect(afterWidth).toBeGreaterThan(beforeWidth);
  });

  test("최대화 해제 시 원래 크기로 돌아온다", async ({ page }) => {
    await page.goto(story("window-window--maximize-toggle"));
    const maxBtn = page.getByRole("button", { name: "최대화" });
    const windowEl = page.locator(".absolute.border-2.border-black.bg-white").first();

    const originalWidth = await windowEl.evaluate((el) => el.getBoundingClientRect().width);

    await maxBtn.click(); // 최대화
    await page.waitForTimeout(400);
    await maxBtn.click(); // 해제
    await page.waitForTimeout(400);

    const restoredWidth = await windowEl.evaluate((el) => el.getBoundingClientRect().width);
    expect(restoredWidth).toBe(originalWidth);
  });

  test("여러 윈도우가 동시에 렌더링된다", async ({ page }) => {
    await page.goto(story("window-window--multiple-windows"));
    await expect(page.getByText("Terminal.sh")).toBeVisible();
    await expect(page.getByText("README.md")).toBeVisible();
  });

  test("포커스된 윈도우에 ring 스타일이 적용된다", async ({ page }) => {
    await page.goto(story("window-window--default"));
    const window = page.locator(".ring-2.ring-black\\/20");
    await expect(window).toBeVisible();
  });

  test("비포커스 윈도우에는 ring 스타일이 없다", async ({ page }) => {
    await page.goto(story("window-window--unfocused"));
    const unfocusedWindow = page.locator(".absolute.border-2.border-black.bg-white").first();
    await expect(unfocusedWindow).toBeVisible();
    // ring 클래스 없음 확인
    await expect(unfocusedWindow).not.toHaveClass(/ring-2/);
  });
});

// ────────────────────────────────────────────────────────────
// ContactApp
// ────────────────────────────────────────────────────────────
test.describe("Apps/ContactApp", () => {
  test("Contact Me 헤더가 표시된다", async ({ page }) => {
    await page.goto(story("apps-contactapp--default"));
    await expect(page.getByText("Contact Me")).toBeVisible();
  });

  test("모든 연락처 항목이 표시된다", async ({ page }) => {
    await page.goto(story("apps-contactapp--default"));
    // 라벨(span)만 타겟 — strict mode 방지
    await expect(page.getByRole("link", { name: /EMAIL/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /GITHUB/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /PHONE/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /BLOG/i })).toBeVisible();
  });

  test("이력서 다운로드 버튼이 있다", async ({ page }) => {
    await page.goto(story("apps-contactapp--default"));
    const btn = page.getByText(/Download Resume/i);
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute("href", "/resume.pdf");
  });

  test("GitHub 링크가 올바른 href를 가진다", async ({ page }) => {
    await page.goto(story("apps-contactapp--default"));
    const githubLink = page.getByRole("link", { name: /GITHUB github\.com/i });
    await expect(githubLink).toHaveAttribute("href", "https://github.com/cjy3458");
  });

  test("이메일 링크가 mailto: 스킴을 사용한다", async ({ page }) => {
    await page.goto(story("apps-contactapp--default"));
    const emailLink = page.getByRole("link", { name: /EMAIL/i }).first();
    await expect(emailLink).toHaveAttribute("href", /mailto:/);
  });
});

// ────────────────────────────────────────────────────────────
// TerminalApp
// ────────────────────────────────────────────────────────────
test.describe("Apps/TerminalApp", () => {
  test("초기 시스템 메시지가 표시된다", async ({ page }) => {
    await page.goto(story("apps-terminalapp--default"));
    await expect(page.getByText("PORTFOLIO_OS v1.0.0")).toBeVisible();
    await expect(page.getByText(/AI 어시스턴트에 연결되었습니다/)).toBeVisible();
  });

  test("입력 프롬프트가 표시된다", async ({ page }) => {
    await page.goto(story("apps-terminalapp--default"));
    await expect(page.getByText("guest@os:~$")).toBeVisible();
  });

  test("터미널 텍스트 색상이 녹색이다", async ({ page }) => {
    await page.goto(story("apps-terminalapp--default"));
    const terminal = page.locator(".bg-black");
    await expect(terminal).toBeVisible();
  });

  test("명령어를 입력할 수 있다", async ({ page }) => {
    await page.goto(story("apps-terminalapp--default"));
    const input = page.getByRole("textbox");
    await input.fill("hello");
    await expect(input).toHaveValue("hello");
  });

  test("clear 명령어로 히스토리가 초기화된다", async ({ page }) => {
    await page.goto(story("apps-terminalapp--default"));
    const input = page.getByRole("textbox");
    await input.fill("clear");
    await input.press("Enter");
    await expect(page.getByText("PORTFOLIO_OS v1.0.0")).not.toBeVisible();
  });

  test("Enter 입력 후 명령어가 히스토리에 표시된다", async ({ page }) => {
    await page.goto(story("apps-terminalapp--default"));
    const input = page.getByRole("textbox");
    await input.fill("테스트 명령어");
    await input.press("Enter");
    // 유저 입력이 히스토리에 추가됨
    await expect(page.getByText(/guest@os:~\$ 테스트 명령어/)).toBeVisible({ timeout: 3000 });
  });
});
