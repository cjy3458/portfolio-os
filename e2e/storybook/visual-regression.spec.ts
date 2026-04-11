import { test, expect } from "@playwright/test";

/**
 * 비주얼 리그레션 테스트
 *
 * 처음 실행: 기준 스크린샷(*.png)을 e2e/storybook/__screenshots__ 에 저장
 * 이후 실행: 현재 화면과 기준 스크린샷을 픽셀 단위로 비교
 * CSS 변경 후 실행: 의도치 않은 스타일 변화를 자동으로 감지
 *
 * 기준 스크린샷 갱신: npx playwright test --config=playwright.storybook.config.ts visual-regression --update-snapshots
 */

const story = (id: string) =>
  `/iframe.html?viewMode=story&id=${id}&globals=&args=`;

// 토큰 변경 영향 컴포넌트: shadow-button, shadow-card, text-green-terminal, caret-green-terminal

test.describe("Visual Regression — Design Tokens", () => {
  test("OsButton / default", async ({ page }) => {
    await page.goto(story("ui-osbutton--default"));
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("osbutton-default.png");
  });

  test("OsButton / medium", async ({ page }) => {
    await page.goto(story("ui-osbutton--medium"));
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("osbutton-medium.png");
  });

  test("OsCard / default", async ({ page }) => {
    await page.goto(story("ui-oscard--default"));
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("oscard-default.png");
  });

  test("OsCard / clickable", async ({ page }) => {
    await page.goto(story("ui-oscard--clickable"));
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("oscard-clickable.png");
  });

  test("TerminalApp / default", async ({ page }) => {
    await page.goto(story("apps-terminalapp--default"));
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("terminalapp-default.png");
  });

  test("DesktopIcon / default", async ({ page }) => {
    await page.goto(story("desktop-desktopicon--default"));
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("desktopicon-default.png");
  });

  test("Taskbar / empty", async ({ page }) => {
    await page.goto(story("desktop-taskbar--empty"));
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("taskbar-empty.png");
  });

  test("Taskbar / with windows", async ({ page }) => {
    await page.goto(story("desktop-taskbar--with-windows"));
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("taskbar-with-windows.png");
  });

  test("TagList / default", async ({ page }) => {
    await page.goto(story("ui-taglist--default"));
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("taglist-default.png");
  });

  test("ErrorBox / with retry", async ({ page }) => {
    await page.goto(story("ui-errorbox--with-retry"));
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("errorbox-with-retry.png");
  });
});
