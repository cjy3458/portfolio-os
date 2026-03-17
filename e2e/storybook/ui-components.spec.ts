import { test, expect } from "@playwright/test";

/**
 * Storybook 컴포넌트를 직접 iframe URL로 테스트
 * /?path=/story/... 대신 /iframe.html?viewMode=story&id=... 사용
 * - 사이드바 없이 전체 뷰포트에 렌더링 → sm:inline 요소 정상 표시
 */
const story = (id: string) =>
  `/iframe.html?viewMode=story&id=${id}&globals=&args=`;

// ────────────────────────────────────────────────────────────
// OsButton
// ────────────────────────────────────────────────────────────
test.describe("UI/OsButton", () => {
  test("Default 버튼이 렌더링된다", async ({ page }) => {
    await page.goto(story("ui-osbutton--default"));
    await expect(page.getByRole("button", { name: "클릭하세요" })).toBeVisible();
  });

  test("Disabled 상태가 적용된다", async ({ page }) => {
    await page.goto(story("ui-osbutton--disabled"));
    await expect(page.getByRole("button", { name: "비활성화" })).toBeDisabled();
  });

  test("링크 버튼이 <a> 태그로 렌더링된다", async ({ page }) => {
    await page.goto(story("ui-osbutton--as-link"));
    const link = page.getByRole("link", { name: "GitHub 방문" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "https://github.com");
  });

  test("Medium 버튼이 렌더링된다", async ({ page }) => {
    await page.goto(story("ui-osbutton--medium"));
    await expect(page.getByRole("button", { name: "Medium Button" })).toBeVisible();
  });
});

// ────────────────────────────────────────────────────────────
// OsCard
// ────────────────────────────────────────────────────────────
test.describe("UI/OsCard", () => {
  test("Static 카드가 렌더링된다", async ({ page }) => {
    await page.goto(story("ui-oscard--static"));
    await expect(page.getByText("정적 카드")).toBeVisible();
  });

  test("Clickable 카드가 button으로 렌더링된다", async ({ page }) => {
    await page.goto(story("ui-oscard--clickable"));
    const card = page.getByRole("button");
    await expect(card).toBeVisible();
    await card.click();
  });
});

// ────────────────────────────────────────────────────────────
// OsInput
// ────────────────────────────────────────────────────────────
test.describe("UI/OsInput", () => {
  test("기본 입력 필드가 렌더링된다", async ({ page }) => {
    await page.goto(story("ui-osinput--default"));
    await expect(page.getByPlaceholder("입력하세요...")).toBeVisible();
  });

  test("입력 가능하다", async ({ page }) => {
    await page.goto(story("ui-osinput--default"));
    const input = page.getByPlaceholder("입력하세요...");
    await input.fill("테스트 입력");
    await expect(input).toHaveValue("테스트 입력");
  });

  test("비활성화 상태가 적용된다", async ({ page }) => {
    await page.goto(story("ui-osinput--disabled"));
    await expect(page.getByPlaceholder("비활성화 입력")).toBeDisabled();
  });
});

// ────────────────────────────────────────────────────────────
// ErrorBox
// ────────────────────────────────────────────────────────────
test.describe("UI/ErrorBox", () => {
  test("에러 메시지가 표시된다", async ({ page }) => {
    await page.goto(story("ui-errorbox--without-retry"));
    await expect(page.getByText("[ ERROR ]")).toBeVisible();
    await expect(page.getByText("데이터를 불러올 수 없습니다.")).toBeVisible();
  });

  test("재시도 버튼이 표시된다", async ({ page }) => {
    await page.goto(story("ui-errorbox--with-retry"));
    await expect(page.getByRole("button", { name: "재시도" })).toBeVisible();
  });

  test("재시도 버튼 클릭 동작 확인", async ({ page }) => {
    await page.goto(story("ui-errorbox--with-retry"));
    const btn = page.getByRole("button", { name: "재시도" });
    await btn.click();
    // 클릭 후 버튼이 여전히 존재함 (UI 변화 없음)
    await expect(btn).toBeVisible();
  });
});

// ────────────────────────────────────────────────────────────
// LoadingSpinner
// ────────────────────────────────────────────────────────────
test.describe("UI/LoadingSpinner", () => {
  test("스피너 아이콘이 렌더링된다", async ({ page }) => {
    await page.goto(story("ui-loadingspinner--default"));
    await expect(page.locator(".animate-spin")).toBeVisible();
  });

  test("레이블이 표시된다", async ({ page }) => {
    await page.goto(story("ui-loadingspinner--with-label"));
    await expect(page.getByText("데이터 로딩 중...")).toBeVisible();
  });

  test("오버레이 모드가 렌더링된다", async ({ page }) => {
    await page.goto(story("ui-loadingspinner--overlay"));
    await expect(page.getByText("오버레이 로딩")).toBeVisible();
  });
});

// ────────────────────────────────────────────────────────────
// TagList
// ────────────────────────────────────────────────────────────
test.describe("UI/TagList", () => {
  test("Wrap 레이아웃 태그 목록이 렌더링된다", async ({ page }) => {
    await page.goto(story("ui-taglist--wrap"));
    await expect(page.getByText("React")).toBeVisible();
    await expect(page.getByText("TypeScript")).toBeVisible();
    await expect(page.getByText("Next.js")).toBeVisible();
  });

  test("Grid 레이아웃이 렌더링된다", async ({ page }) => {
    await page.goto(story("ui-taglist--grid"));
    await expect(page.getByText("React")).toBeVisible();
  });
});

// ────────────────────────────────────────────────────────────
// SectionHeader
// ────────────────────────────────────────────────────────────
test.describe("UI/SectionHeader", () => {
  test("섹션 헤더가 렌더링된다", async ({ page }) => {
    await page.goto(story("ui-sectionheader--default"));
    await expect(page.getByText("TECH STACK")).toBeVisible();
  });
});

// ────────────────────────────────────────────────────────────
// AppHeader
// ────────────────────────────────────────────────────────────
test.describe("UI/AppHeader", () => {
  test("타이틀만 있는 헤더", async ({ page }) => {
    await page.goto(story("ui-appheader--title-only"));
    await expect(page.getByText("PORTFOLIO_OS")).toBeVisible();
  });

  test("아이콘 + 타이틀 헤더", async ({ page }) => {
    await page.goto(story("ui-appheader--with-icon"));
    await expect(page.locator("span.font-black", { hasText: "TERMINAL" })).toBeVisible();
  });

  test("액션 버튼 포함 헤더", async ({ page }) => {
    await page.goto(story("ui-appheader--with-action"));
    await expect(page.getByText("PROJECTS")).toBeVisible();
    await expect(page.getByRole("button", { name: "+ 새 항목" })).toBeVisible();
  });
});
