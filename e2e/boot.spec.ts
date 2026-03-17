import { test, expect } from "@playwright/test";

test.describe("BootScreen", () => {
  test("부팅 화면이 렌더링된다", async ({ page }) => {
    await page.goto("/");

    // 부팅 화면 확인
    await expect(page.locator(".font-mono.cursor-wait")).toBeVisible();
    await expect(page.getByText("System Boot Sequence")).toBeVisible();
    await expect(page.getByText("CPU: V8 자바스크립트 엔진, 속도: 최적")).toBeVisible();
  });

  test("프로그레스 바가 증가한다", async ({ page }) => {
    await page.goto("/");

    // 초기 진행 상황 캡처
    const getProgress = () =>
      page.evaluate(() => {
        const text = document.body.innerText;
        const match = text.match(/(\d+)%/);
        return match ? parseInt(match[1]) : 0;
      });

    const initialProgress = await getProgress();
    await page.waitForTimeout(1500);
    const laterProgress = await getProgress();

    expect(laterProgress).toBeGreaterThan(initialProgress);
  });

  test("부팅 완료 후 데스크탑으로 전환된다", async ({ page }) => {
    await page.goto("/");

    // 부팅 완료 대기 (최대 15초)
    await expect(page.locator(".cursor-wait")).not.toBeVisible({
      timeout: 15000,
    });

    // 데스크탑 태스크바 확인
    await expect(page.getByRole("button", { name: /start/i })).toBeVisible();
  });
});
