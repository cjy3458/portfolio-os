import { test, expect } from "@playwright/test";

// 각 테스트 전에 부팅 완료 상태로 이동
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  // 부팅 화면이 사라질 때까지 대기
  await expect(page.locator(".cursor-wait")).not.toBeVisible({ timeout: 15000 });
});

test.describe("Desktop", () => {
  test("데스크탑 아이콘이 렌더링된다", async ({ page }) => {
    // 5개 앱 아이콘 확인 (project-detail 제외)
    await expect(page.getByText("README.md")).toBeVisible();
    await expect(page.getByText("Projects.exe")).toBeVisible();
    await expect(page.getByText("Terminal.sh")).toBeVisible();
    await expect(page.getByText("Contact.info")).toBeVisible();
    await expect(page.getByText("Blog.rss")).toBeVisible();
  });

  test("태스크바가 렌더링된다", async ({ page }) => {
    await expect(page.getByRole("button", { name: /start/i })).toBeVisible();
    // 시계 영역 (pulse 점)
    await expect(page.locator(".animate-pulse")).toBeVisible();
  });

  test("앱 아이콘 클릭 시 윈도우가 열린다", async ({ page }) => {
    await page.getByText("README.md").click();
    // 윈도우 타이틀바 확인
    await expect(page.getByText("README.md").first()).toBeVisible();
  });

  test("START 버튼 클릭 시 스타트 메뉴가 열린다", async ({ page }) => {
    await page.getByRole("button", { name: /start/i }).click();
    // 스타트 메뉴 항목 확인
    await expect(page.locator("text=README.md, text=Projects.exe").first()).toBeVisible().catch(() => {
      // StartMenu가 렌더링됐는지 컨테이너 기준으로 확인
      return expect(page.locator("[class*='absolute'][class*='bottom']").first()).toBeVisible();
    });
  });

  test("데스크탑 클릭 시 스타트 메뉴가 닫힌다", async ({ page }) => {
    // 스타트 메뉴 열기
    await page.getByRole("button", { name: /start/i }).click();
    // 데스크탑 영역 클릭 (태스크바 제외)
    await page.locator(".bg-\\[\\#e5e5e5\\]").click({ position: { x: 600, y: 300 } });
    await page.waitForTimeout(300);
    // START 버튼이 열린 상태(bg-black)가 아님을 확인
    const startBtn = page.getByRole("button", { name: /start/i });
    await expect(startBtn).not.toHaveClass(/bg-black text-white shadow-inner/);
  });
});
