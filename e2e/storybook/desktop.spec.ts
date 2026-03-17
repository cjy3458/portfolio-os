import { test, expect } from "@playwright/test";

const story = (id: string) =>
  `/iframe.html?viewMode=story&id=${id}&globals=&args=`;

// ────────────────────────────────────────────────────────────
// DesktopIcon
// ────────────────────────────────────────────────────────────
test.describe("Desktop/DesktopIcon", () => {
  test("Terminal.sh 아이콘이 렌더링된다", async ({ page }) => {
    // ID: desktop-desktopicon--terminal (점이 제거됨)
    await page.goto(story("desktop-desktopicon--terminal"));
    await expect(page.getByText("Terminal.sh")).toBeVisible();
  });

  test("README.md 아이콘이 렌더링된다", async ({ page }) => {
    await page.goto(story("desktop-desktopicon--readme"));
    await expect(page.getByText("README.md")).toBeVisible();
  });

  test("Projects.exe 아이콘이 렌더링된다", async ({ page }) => {
    await page.goto(story("desktop-desktopicon--projects"));
    await expect(page.getByText("Projects.exe")).toBeVisible();
  });

  test("모든 아이콘이 한 화면에 렌더링된다", async ({ page }) => {
    await page.goto(story("desktop-desktopicon--all-icons"));
    await expect(page.getByText("Terminal.sh")).toBeVisible();
    await expect(page.getByText("README.md")).toBeVisible();
    await expect(page.getByText("Projects.exe")).toBeVisible();
    await expect(page.getByText("Contact.info")).toBeVisible();
  });

  test("아이콘 클릭 시 앱이 열린다 (play 함수)", async ({ page }) => {
    await page.goto(story("desktop-desktopicon--click-opens-app"));
    // play 함수가 실행되면 스토리가 오류 없이 로드됨
    await expect(page.getByText("Terminal.sh")).toBeVisible();
    await page.locator(".flex.flex-col.items-center").first().click();
  });
});

// ────────────────────────────────────────────────────────────
// StartMenu
// ────────────────────────────────────────────────────────────
test.describe("Desktop/StartMenu", () => {
  test("OS_MENU 헤더가 표시된다", async ({ page }) => {
    await page.goto(story("desktop-startmenu--default"));
    await expect(page.getByText("OS_MENU")).toBeVisible();
  });

  test("모든 앱 항목이 메뉴에 표시된다", async ({ page }) => {
    await page.goto(story("desktop-startmenu--default"));
    await expect(page.getByText("README.md")).toBeVisible();
    await expect(page.getByText("Projects.exe")).toBeVisible();
    await expect(page.getByText("Terminal.sh")).toBeVisible();
    await expect(page.getByText("Contact.info")).toBeVisible();
    await expect(page.getByText("Blog.rss")).toBeVisible();
  });

  test("버전 정보가 표시된다", async ({ page }) => {
    await page.goto(story("desktop-startmenu--default"));
    await expect(page.getByText("VERSION 1.0")).toBeVisible();
  });

  test("메뉴 항목을 클릭할 수 있다", async ({ page }) => {
    await page.goto(story("desktop-startmenu--default"));
    // README.md 버튼 클릭
    await page.getByRole("button", { name: /readme/i }).click();
  });
});

// ────────────────────────────────────────────────────────────
// Taskbar
// ────────────────────────────────────────────────────────────
test.describe("Desktop/Taskbar", () => {
  test("START 버튼이 렌더링된다", async ({ page }) => {
    await page.goto(story("desktop-taskbar--empty"));
    // fullscreen layout + iframe.html → 1280px 뷰포트 → sm:inline 적용됨
    await expect(page.getByText("START")).toBeVisible();
  });

  test("시계 영역이 표시된다", async ({ page }) => {
    await page.goto(story("desktop-taskbar--empty"));
    await expect(page.locator(".animate-pulse")).toBeVisible();
  });

  test("열린 앱 탭이 태스크바에 표시된다", async ({ page }) => {
    await page.goto(story("desktop-taskbar--with-open-apps"));
    // hidden sm:inline → 1280px 뷰포트에서 표시됨
    await expect(page.getByText("README.md")).toBeVisible();
    await expect(page.getByText("Terminal.sh")).toBeVisible();
  });

  test("START 버튼 클릭 시 스타트 메뉴가 열린다", async ({ page }) => {
    await page.goto(story("desktop-taskbar--start-menu-toggle"));
    // Taskbar 내 START 텍스트가 있는 버튼 클릭
    const startBtn = page.locator("button").filter({ hasText: "START" });
    await startBtn.click();
    // 스타트 메뉴 OS_MENU 헤더 확인
    await expect(page.getByText("OS_MENU")).toBeVisible();
  });

  test("START 버튼을 두 번 클릭하면 메뉴가 닫힌다", async ({ page }) => {
    await page.goto(story("desktop-taskbar--start-menu-toggle"));
    const startBtn = page.locator("button").filter({ hasText: "START" });

    await startBtn.click();
    await expect(page.getByText("OS_MENU")).toBeVisible();

    await startBtn.click();
    await expect(page.getByText("OS_MENU")).not.toBeVisible();
  });
});
