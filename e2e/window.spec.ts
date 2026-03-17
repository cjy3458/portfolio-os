import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".cursor-wait")).not.toBeVisible({ timeout: 15000 });
});

test.describe("Window", () => {
  test("앱 열기 → 태스크바에 탭이 추가된다", async ({ page }) => {
    await page.getByText("Terminal.sh").click();

    // 태스크바에 Terminal.sh 탭 확인
    const taskbarArea = page.locator(".absolute.bottom-0");
    await expect(taskbarArea.getByText("Terminal.sh")).toBeVisible();
  });

  test("윈도우 닫기 버튼으로 앱을 닫을 수 있다", async ({ page }) => {
    await page.getByText("README.md").click();

    // Window.tsx: aria-label="닫기", 내용은 Lucide <X> SVG 아이콘
    await page.getByRole("button", { name: "닫기" }).click();

    // 태스크바에서 탭이 사라짐
    const taskbarTabs = page.locator(".absolute.bottom-0");
    await expect(taskbarTabs.getByText("README.md")).not.toBeVisible();
  });

  test("여러 앱을 동시에 열 수 있다", async ({ page }) => {
    // README.md 아이콘 클릭
    await page.getByText("README.md").click();
    await page.waitForTimeout(300);

    // README.md 창이 Terminal.sh 아이콘을 가릴 수 있으므로
    // Start Menu에서 Terminal.sh를 열어 신뢰성 확보
    await page.getByRole("button", { name: /start/i }).click();
    await page.locator(".absolute.bottom-12").getByText("Terminal.sh").click();

    const taskbar = page.locator(".absolute.bottom-0");
    await expect(taskbar.getByText("README.md")).toBeVisible();
    await expect(taskbar.getByText("Terminal.sh")).toBeVisible();
  });
});
